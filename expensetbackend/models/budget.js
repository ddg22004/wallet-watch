const mongoose= require('mongoose')

const budgetSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  categories: [
    {
      name: String,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model('Budget', budgetSchema);
