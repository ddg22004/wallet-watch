const router= require("express").Router();
const {User,validate}= require("../models/user")
const bcrypt=require("bcryptjs")

router.post("/",async (req,res)=>{
  try {
    const {error}= validate(req.body);
    if(error)
      return res.status(400).send({message: error.details[0].message});
    const user = await User.findOne({email:req.body.email});
    if(user){
      return res.status(409).send({message: "User with given email already exists!"})
    }
    const salt= await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password,salt)

    await new User({...req.body,password:hashPassword}).save();
    res.status(201).send({message:"User created Successfully!"})
    



  } catch (error) {
    res.status(500).send({message:"Internal Server Error"})
  }
})


router.get('/:userId', async (req,res)=>{
  try {
    const userId= req.params.userId;
    const user = await User.findOne({userId});
    console.log("Received request for user:", req.params.userId);
    if (!user){
      return res.status(404).json({message: 'User not found'});
    }
   res.json(user)
  }
  catch(error){
    res.status(500).json({message: error.message});
  }
})

module.exports=router;