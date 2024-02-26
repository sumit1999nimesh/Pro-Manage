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
  const userId=req.params.userid;
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (password.length<=4) {
      return res.status(400).json({ error: 'Password length is less than 5' });
    }

    console.error(userId);
    const hashedPassword= await bcrypt.hash(password,10);
    const updateUser={
      name:name, 
      email: email,
       password: hashedPassword }

    try {
      const user=await userModel.findByIdAndUpdate(userId,updateUser,{new :true});
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

module.exports = {signup,login,updateUser}