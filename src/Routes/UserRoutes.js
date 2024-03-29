const express = require('express');
const bodyParser = require('body-parser');
const auth = require("../Middleware/auth");
const dotenv = require('dotenv');
const { signup, login,updateUser,getUserName } = require('../Controllers/userController');

const userRouter =express.Router();

userRouter.post("/signup" ,signup);
userRouter.post("/login" ,login);
userRouter.put("/updateuser/" ,auth , updateUser);
userRouter.get("/getUserName" ,auth , getUserName);

module.exports= userRouter;
