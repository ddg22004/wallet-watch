const express= require('express');
const authenticateUser= require('../middleware/auth');
const Expense=require('../models/Expense');

const router=express.Router();

router.get('/:userId',authenticateUser,async(req,res)=>{
  const { userId } = req.params;
  const expenses= await Expense.find({userId});
    res.json(expenses);
});

router.post('/',authenticateUser,async (req,res)=>{
  const { userId, description, amount, category,date } = req.body; 
  const expense= new Expense({userId,description,amount,category,date});
  try {
    await expense.save();
    res.status(201).json(expense);
  }
  catch(error){
    res.status(400).send(error);
  }
})

router.delete('/:taskId',async(req,res)=>{
  try {
    const {taskId}=req.params;
    const deleteExpense= await Expense.findOneAndDelete({taskId});
    if(!deleteExpense){
      return res.status(404).json({message:'Expense Not Found'});
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Server Error'})
  }
})

module.exports=router