require('dotenv').config();
const express=require('express');
const app=express();
const  cors=require("cors");
const connection=require('./db')
const userRoutes = require("./routes/users");
const authRoutes =require ("./routes/auth");
const bodyParser=require('body-parser')
const apiUrl = import.meta.env.VITE_API_URL;
//database connection
connection();


//middleware
app.use(express.json())
app.use(cors({
  origin: `${apiUrl}`,
}));
app.use(bodyParser.json())

//routes
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use('/api/expenses',require('./routes/expenses'))
app.use('/api/budgets',require('./routes/budgetroute'))




const port = process.env.PORT||8080;
app.listen(port,()=>console.log(`Listening on Port ${port}...`));

