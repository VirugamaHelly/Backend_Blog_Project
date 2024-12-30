const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Use environment variables for security

const authenticate = (req, res, next) => {
  const token = req.cookies?.authToken || req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.startsWith("Bearer ") ? token.split(" ")[1] : token, secretKey);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
