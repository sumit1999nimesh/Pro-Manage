const userModel =require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

const signup= async(req,res)=>{
 
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (password.length<=4) {
      return res.status(400).json({ error: 'Password length is less than 5' });
    }

      try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email is already registered. Please use a different email.' });
        }
    
        const hashedPassword= await bcrypt.hash(password,10);
        const newUser =await userModel.create({
           name:name, 
           email: email,
            password: hashedPassword }
        );
   
       const token = jwt.sign({email:newUser.email,id:newUser._id},process.env.SECRET_KEY);     
    
        res.status(201).json({ user: newUser, token:token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
      }
    }


const login= async(req,res)=>{
    const {  email, password } = req.body;
    if (!email|| !password) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }

      try {
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
          return res.status(400).json({ error: 'User Not found' });
        }

        const matchPassword= await bcrypt.compare(password ,existingUser.password);
        if(!matchPassword){
            return res.status(400).json({ error: 'Invalid Credentials' });
        }
            const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY);     
            return res.status(200).json({ user: existingUser, token:token  });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const updateUser= async(req,res)=>{
  const userId=req.userId;
 console.log("uid" +userId)
  const { name, oldPassword, newPassword } = req.body;
    console.log(name +' '+ oldPassword+' '+ newPassword)
  if (!name || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (newPassword.length<=4) {
      return res.status(400).json({ error: 'New Password length is less than 5' });
    }
    const existingUser = await userModel.findById(userId);
    const matchPassword= await bcrypt.compare(oldPassword ,existingUser.password);
    if(!matchPassword){
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
    else{
      const hashedPassword= await bcrypt.hash(newPassword,10);
    //
    try {   
      const result = await userModel.updateOne(
      { _id: userId }, 
      { $set: { password: hashedPassword, name: name } }
  );
  if (result.modifiedCount === 1) {
    res.status(200).json({ message: `Password is updated` });
} else {
    res.status(404).json({ message: 'Task not found' });
}
} catch (error) {
console.error('Error updating task state:', error);
res.status(500).json({ message: 'Internal server error' });
}
      //
    }

   
  }

const getUserName= async(req,res)=>{ 
  const userId=req.userId;

  const user = await userModel.findById(userId);
   try{
        if (user) {
            res.json({ username: user.name });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {signup,login,updateUser,getUserName}
