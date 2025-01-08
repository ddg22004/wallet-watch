const mongoose= require('mongoose')
const { v4: uuidv4 } = require('uuid');
const ExpenseSchema =new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  description: String,
  amount: Number,
  category: String,
  date : {type: Date, default:Date.now},
  taskId:{type: String,default: uuidv4,required: true}
})

module.exports = mongoose.model('Expense',ExpenseSchema)
