const express = require('express');
const auth = require("../Middleware/auth");

const { CreateTask,deleteTask,getTask,updateTask,getTaskPublic,updateTaskstate } = require('../Controllers/TaskController');
const taskRouter =express.Router();

taskRouter.post("/createtask" ,auth , CreateTask);
taskRouter.get("/gettask" ,auth , getTask);
taskRouter.delete("/:id" ,auth , deleteTask);

taskRouter.put("/updatetask/:id" ,auth , updateTask);
taskRouter.get("/gettaskpublic/:taskid" , getTaskPublic);
taskRouter.put("/updatetaskstate/:taskid/:state" , auth,updateTaskstate);
 

module.exports= taskRouter;