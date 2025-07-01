const router= require("express").Router();
const {User} =require('../models/user');
const Joi = require("joi");
const bcrypt= require("bcryptjs")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const apiUrl = process.env.APP_URL; 
require('dotenv').config();
router.post("/",async (req,res)=>{
  try {
    const {error}= validate(req.body);
    if(error){
      res.status(400).send({message: error.details[0].message});
    }
    const user= await User.findOne({email: req.body.email})
   
    if(!user){
      return res.status(401).send({message:"Invalid Email or Password"})
    }
    
    const validPassword = await bcrypt.compare(
      req.body.password,user.password
    )
    if(!validPassword){
      res.status(401).send({message:"Inavlid Email or Password"})
    }
    const token =user.generateAuthToken();
    res.status(200).send({message:"Logged in successfully",userId: user.userId,token:token})
    console.log("logged in successfully")
  } catch (error) {
    res.status(500).send({message:"Internal Server Error"});
    
  }
})

const validate=(data) =>{
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password")
  })
  return schema.validate(data)
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
  },
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found.' });

      // Generate a reset token
      const token = crypto.randomBytes(20).toString('hex');
      
      // Set token and expiration on user document
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      // Send email with reset link
      const resetUrl = `${apiUrl}/reset-password/${token}`;
      
      await transporter.sendMail({
          to: email,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      });

      res.json({ message: 'Reset link sent to your email.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, 
      });

      if (!user) return res.status(400).json({ message: 'Token is invalid or has expired.' });

    
      user.password = await bcrypt.hash(password, 10);
      
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ message: 'Your password has been successfully updated.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports=router;
