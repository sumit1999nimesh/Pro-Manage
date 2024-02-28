const express = require('express');
const bodyParser = require('body-parser');


const userRouter = require('./Routes/UserRoutes');
const mongoose = require('mongoose');
const taskRouter = require('./Routes/TaskRoutes');
const dotenv = require('dotenv');
const cors= require('cors');
dotenv.config({path:'.env'});
const app = express();

app.use(cors());
 app.use(express.json());
 app.use("/user" , userRouter);
 app.use("/task" , taskRouter);

console.log(process.env.Port);
 const PORT = process.env.PORT || 3000;
console.log(process.env.Mongo_URL);

mongoose.connect(process.env.Mongo_URL)
.then(()=>{
  app.listen(PORT, () => {
  
   
    console.log(`Server is2 running on http://localhost:` + PORT);
  });
})
.catch((error)=>{
  console.log("error in DB connection")
})
