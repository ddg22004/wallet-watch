import React, { useState,useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';

const RecentExp = () => {
   const [expenses,setExpense]=useState([])
   const {userId,token}=useAuth();

  const fetchExpenses= async() =>{
     try {
       if (!userId) return;
       const response = await fetch(`http://localhost:8080/api/expenses/${userId}`,{
         method: 'GET',
         headers:{
           'Authorization' :`Bearer ${token}`
         }
       })
       if(!response.ok) throw new Error ('Failed to fetch expenses');
       const data = await response.json();
       setExpense(data);
     }
     catch (error){
       console.error("Error fetching Expense",error)
     }
   };
   useEffect(()=>{
     fetchExpenses();
   },[userId])
 
  const latestExpenses=expenses.slice(-10);
  return (
    <main className='flex flex-col items-center justify-center mt-5 p-5 bg-zinc-800'>
    <div className='text-white text-3xl text-center mb-4'>Recent Expenses</div>
    <hr className='border-white w-full mb-4'/>
    <div className='text-white bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-4xl'>
    <table className="min-w-full table-auto text-white "> 
      <thead>
        <tr className='bg-zinc-700'><th className='px-4 py-2'>Name</th><th className='px-4 py-2'>Category</th><th className='px-4 py-2'>Amount</th>
          </tr>
          </thead> 
      <tbody>
      {latestExpenses.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No recent expenses recorded.</td>
                            </tr>
                        ) : (latestExpenses.map((task, index) => ( 
          <tr key={index} className="hover:bg-zinc-800"> 
          <td className="border px-4 py-2 text-center border-black">{task.description}</td> 
          <td className="border px-4 py-2 border-black text-center">{task.category}</td> 
          <td className="border border-black px-4 py-2 text-center">₹{task.amount}</td>
          </tr>)))}
          </tbody></table>
    </div>
    </main>
    
  )
}

export default RecentExp