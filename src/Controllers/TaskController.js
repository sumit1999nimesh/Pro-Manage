
const taskModel =require("../Models/Task");

const CreateTask= async(req,res)=>{
    const { title, priority, checklist, dueDate,state ,userID} = req.body;
    
    if (!title|| !priority|| !checklist|| !state) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
      try {
            const newTask=await taskModel.create({
              title:title, 
              priority: priority,
              checklist: checklist,
              dueDate: dueDate,
              state: state,
              userId:req.userId }
        );
        await newTask.save();
        
        res.status(201).json({ Task: newTask });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
      }
    }
    const deleteTask= async(req,res)=>{
        const id=req.params.id;
        try{
       const task=await taskModel.findByIdAndDelete(id);
       res.status(200).json(task);
        }
        catch(error){
       res.status(500).json({ error: 'Something went wrong' });

    }
  }
    const updateTask= async(req,res)=>{
      const id=req.params.id;
      const { title, priority, checklist, dueDate,state ,userID} = req.body;
      if (!title|| !priority|| !checklist|| !state) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }
        const updateTask={
          title:title, 
          priority: priority,
          checklist: checklist,
          dueDate: dueDate,
          state: state,
          userId:req.userId }
          try{
            const task=await taskModel.findByIdAndUpdate(id,updateTask,{new :true});
        res.status(200).json(task);
         }
         catch(error){
        res.status(500).json({ error: 'Something went wrong' });
 
     }
    }

    const getTask= async(req,res)=>{
      try {
       const tasks=await taskModel.find({userId : req.userId});
       res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
    }

    
    const getTaskPublic= async(req,res)=>{
      const id=req.params.taskid;
      try {
       const tasks=await taskModel.findById(id);
       res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
    }

    const updateTaskstate=async (req, res) => {
              console.log(" trmt ");
      const taskId = req.params.taskid;
      const newState = req.params.state;
        console.log(taskId+"  ts  ns " +newState);
      if (!taskId|| !newState) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }
      try {   
        const result = await taskModel.updateOne(
        { _id: taskId }, 
        { $set: { state: newState } }
    );
    if (result.modifiedCount === 1) {
      res.json({ message: `State of task ${taskId} updated to ${newState}` });
  } else {
      res.status(404).json({ message: 'Task not found' });
  }
} catch (error) {
  console.error('Error updating task state:', error);
  res.status(500).json({ message: 'Internal server error' });
}
}
module.exports = {CreateTask,getTask,deleteTask,updateTask,getTaskPublic,updateTaskstate}
