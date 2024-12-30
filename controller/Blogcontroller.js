const Blogmodel = require("../Model/BlogModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//images
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

// Create Blog
const createblog = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).send("User not authenticated");
        }

        const newblog = await Blogmodel.create({
            title,
            description,
            image,
            creator: req.user.id,
        });

        res.redirect("/blog/myblogs");
    } catch (err) {
        console.error("Error creating blog:", err);
        res.status(500).send("Error creating blog");
    }
};

// Render Create Blog Page
const createblogfile = async (req, res) => {
    res.render("create", { user: req.user });
};

// Edit Blog - Show Edit Form
const editBlog = async (req, res) => {
    try {
        const blog = await Blogmodel.findById(req.params.id); // Fetch the blog using the ID
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        res.render("editBlog", { blog, user: req.user });
    } catch (error) {
        console.error("Error fetching blog for edit:", error);
        res.status(500).send("Error fetching blog for edit");
    }
};


// Update Blog
const updateBlog = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const blog = await Blogmodel.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.image = image || blog.image;

        await blog.save();

        res.redirect(`/blog/myblogs`);
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).send("Error updating blog");
    }
};

// Delete Blog
const delet = async (req, res) => {
    try {
        const id = req.params.id;
        const blogdata = await Blogmodel.findByIdAndDelete(id);

        if (!blogdata) {
            return res.status(404).send({ message: "Blog not found" });
        }
        res.redirect("/blog/myblogs");
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(400).send({ message: error.message });
    }
};

// Fetch User's Blogs
const myBlogsFile = async (req, res) => {
    try {
        const userBlogs = await Blogmodel.find({ creator: req.user.id });
        res.render('myBlog', { blogs: userBlogs, user: req.user });
    } catch (error) {
        res.status(500).send({ message: "Error fetching user's blogs", error: error.message });
    }
};

// Fetch All Blogs
const allblogsfile = async (req, res) => {
    try {
        const blogdata = await Blogmodel.find();
        const user = req.user || null;
        res.render("Allblogs", { blogs: blogdata, user });
    } catch (error) {
        res.status(500).send("An error occurred while fetching blogs.");
    }
};

module.exports = {
    createblog: [upload.single("image"), createblog],
    createblogfile,
    editBlog,
    updateBlog: [upload.single("image"), updateBlog],
    delet,
    allblogsfile,
    myBlogsFile
};
