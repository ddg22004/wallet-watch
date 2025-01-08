import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ExpenseForm = ({ addExpense, budgets }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date,setDate]=useState("")
  const {userId}=useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({userId, description, amount: parseFloat(amount), category,date});
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Add Your Expense</h2>
      
      <hr className="shadow-md mb-4" />
      <form onSubmit={handleSubmit} >

         <div className="mb-4">
                    <label className="block text-white">Description:</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="bg-zinc-700 text-white rounded-lg p-2 w-full" 
                        required 
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white">Amount:</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="bg-zinc-700 text-white rounded-lg p-2 w-full" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Date:</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="bg-zinc-700 text-white rounded-lg p-2 w-full" 
                       required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Category:</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="bg-zinc-700 text-white rounded-lg p-2 w-full" required
                    ><option value="" className="bg-zinc-900">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Health">Health</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <button type="submit" className='bg-zinc-700  text-white px-4 py-2 my-5 mx-1 rounded hover:bg-zinc-500 transition duration-300'>Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
