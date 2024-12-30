const express = require("express");
const {
  signUP,
  signupFile,
  login,
  Loginfile,
  homefile,
  logout,
} = require("../controller/UserController");
const authenticate = require("../Middleware/auth");

const UserRouter = express.Router();

UserRouter.post("/signUP", signUP);
UserRouter.get("/signUP", signupFile);

UserRouter.post("/login", login);
UserRouter.get("/login", Loginfile);

UserRouter.get("/home", authenticate, homefile);
UserRouter.get("/logout",authenticate, logout);

module.exports = UserRouter;
