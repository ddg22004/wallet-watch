const router= require("express").Router();
const Budget= require('../models/budget')
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const { userId, categories } = req.body; 
  console.log("Received request:", { userId, categories });
 
  try {
  
  
    const budget = await Budget.findOneAndUpdate(
      { userId : userId },
      { categories: categories },
      { new: true, upsert: true } 
    );
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId',async (req,res)=>{
  try {
    const budget =await Budget.findOne({userId: req.params.userId});
    if(!budget){
      return res.status(404).json({message: 'Budget Not Found'});
    }
    res.json(budget)
  }
  catch (error){
  res.status(500).json({error:error.message});
  }
})


module.exports=router;
