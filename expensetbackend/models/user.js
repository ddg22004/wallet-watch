
const mongoose=require('mongoose');
const jwt= require('jsonwebtoken')
const Joi=require('joi');
const passwordComplexity=require("joi-password-complexity");
const { v4: uuidv4 } = require('uuid');
const userSchema =new mongoose.Schema({
  userId: {type: String, default: uuidv4, unique: true},
  firstName: {type: String,required:true},
  lastName: {type: String,required:true},
  email: {type: String,required:true,unique: true},
  password: {type: String,required:true},
  resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
})

userSchema.methods.generateAuthToken = function(){
 const token=jwt.sign({userId: this.userId,email:this.email},process.env.JWTPRIVATEKEY,{expiresIn:"7d"})
 return token
}

const User=mongoose.model("user",userSchema);


const validate=(data)=>{
  const schema= Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    
  });
  return schema.validate(data)
};
module.exports={User,validate};