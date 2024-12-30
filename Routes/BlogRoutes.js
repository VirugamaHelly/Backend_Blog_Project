const express = require("express");
const { createblogfile, createblog, editBlog, updateBlog, delet, myBlogsFile, allblogsfile } = require("../controller/BlogController");
const authenticate = require("../Middleware/auth");

const blogrouter = express.Router();

blogrouter.post("/create", authenticate, createblog);
blogrouter.get("/create", authenticate, createblogfile);

blogrouter.get("/edit/:id", authenticate, editBlog); 
blogrouter.post("/update/:id", authenticate, updateBlog);

blogrouter.post("/delet/:id", authenticate, delet);
blogrouter.get("/get", allblogsfile);
blogrouter.get("/myblogs", authenticate, myBlogsFile);

module.exports = blogrouter;
