const express = require('express');
const router = express.Router();
const Group = require('./models/Group');

router.post('/create-group',async (req,res)=>{
const {name,members}=req.body;
const newGroup=new Group ({name,members});
await newGroup.save();
res.status(201).json(newGroup);
});

router.get('/groups/:userId',async (req,res)=>{
  const groups= await Group.find({'members.userId':req.params.userId});
  res.status(200).json(groups);
})