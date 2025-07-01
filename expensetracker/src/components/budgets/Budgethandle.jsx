import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../context/CategoriesContext';


const Budgethandle = ({isOpen,onClose}) => {
    const {userId}=useAuth();
    const [budgets, setBudgets] = useState({});
    const { combinedCategories } = useCategories();
    const apiUrl = process.env.APP_URL;
  useEffect(()=>{
   if(userId){
    fetchBudget(userId);
    
   }
   },[userId]);
  const handleBudgetChange =(e)=>{
    const {name,value}=e.target;
    setBudgets(prev=>({...prev,[name]:parseFloat(value)}));
  }
  const handleSubmit =async()=>{
    console.log("Budgets before submission:", budgets);
    localStorage.setItem('budgets',JSON.stringify(budgets));
    try{
      
      const sdata= JSON.stringify({userId ,categories: Object.entries(budgets).map(([name,amount])=>({name,amount}
      )
    )})
    console.log(sdata)
      const response= await fetch(`${apiUrl}/api/budgets`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: sdata
      })
      console.log(response)
      if(!response.ok) throw new Error('Failed to save budget');
      const data = await response.json();
      console.log("Budget Saved",data);
   onClose();
    }
    catch(error){
      console.error("Error saving budget",error)
    }

  }

    const fetchBudget =async ()=>{
      try {
        const response =await fetch(`${apiUrl}/api/budgets/${userId}`);
     if(!response.ok) throw new Error ('failed to fetch budget');
     const data= await response.json();
     console.log(data)
     setBudgets(data.categories.reduce((acc,category)=>({
      ...acc,[category.name]: category.amount }),{}
     ))
      }
      catch (error){
        console.log('Error fetching budget',error)
      }
    }
if (!isOpen) return null;
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 '>
       <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md ">
       <h2 className="text-xl font-bold mb-4">Set Your Budgets</h2>
         {combinedCategories.map(cat => (
          <div key={cat} className='mb-1'>
              <label className="block text-sm font-medium mb-1">{cat} Budget:</label>
              <input
                  type='number'
                  name={cat}
                  value={budgets[cat] || 0} 
                  onChange={handleBudgetChange}
                  className='bg-gray-800 border border-gray-700 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-cyan-500'
              />
          </div>
      ))}
     <div className="flex justify-between">
     <button onClick={handleSubmit} className='mt-4 bg-black-500 text-white px-4 py-2 rounded'>
        Submit Budget
      </button>
      <button className='mt-4 bg-black-500 text-white px-4 py-2 rounded' onClick={onClose}>Cancel</button>
      </div></div></div>
  )
}

export default Budgethandle