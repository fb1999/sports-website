const express = require("express");
const user = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.post("/register", user.signup);
userRouter.post("/login", user.login);
userRouter.get("/logout", user.logout);
userRouter.get("/loggedIn", user.checkUser);

//userRouter.post("/user-data", user.userData);
userRouter.post("/forgot-password", user.forgotPassword);
userRouter.get("/reset-password/:id/:token", user.resetPassword);
userRouter.post("/reset-password/:id/:token", user.updatePassword);
//userRouter.get("/:id", user.getUser);

module.exports = userRouter;