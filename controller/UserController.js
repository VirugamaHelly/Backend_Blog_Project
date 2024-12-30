const usermodel = require("../Model/UserModel");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// Define constants
const secretKey = "your-secret-key"; // Ensure consistency in your secret key

// Image Upload Configuration
const uploadDir = path.join(__dirname, "../Uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Signup Controller
const signUP = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    const image = req.file ? req.file.filename : null;

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const userdata = await usermodel.create({
      username,
      email,
      password: hashpassword,
      image,
    });

    res.redirect("/user/login");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ message: "An error occurred during signup" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userdata = await usermodel.findOne({ email });
    if (!userdata) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userdata.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: userdata._id, username: userdata.username, email: userdata.email, image: userdata.image },
      secretKey,
      { expiresIn: "24h" }
    );

    res.cookie("authToken", token, { httpOnly: true, secure: false });
    res.redirect("/user/home");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "An error occurred during login" });
  }
};

// Logout Controller
const logout = (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/user/login");
};

// Page Render Controllers
const signupFile = (req, res) => {
  res.render("signUP",{user : req.user});
};

const Loginfile = (req, res) => {
  res.render("login" , {user : req.user});
};

const homefile = (req, res) => {
  res.render("Home", { user: req.user });
};

module.exports = {
  signUP: [upload.single("image"), signUP],
  signupFile,
  login,
  Loginfile,
  homefile,
  logout,
};
