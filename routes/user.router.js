const express = require("express");
const userController = require("../controllers/userCtrls");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signUp", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;