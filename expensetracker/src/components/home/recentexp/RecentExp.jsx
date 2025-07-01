import React, { useState,useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';

const RecentExp = () => {
   const [expenses,setExpense]=useState([])
   const {userId,token}=useAuth();
const apiUrl = import.meta.env.VITE_API_URL;
  const fetchExpenses= async() =>{
     try {
       if (!userId) return;
       const response = await fetch(`${apiUrl}/api/expenses/${userId}`,{
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
    <main className='flex flex-col items-center justify-center mt-3 p-3 bg-zinc-800 sm:mt-5 sm:p-5'>
    <div className='text-white text-xl sm:text-3xl text-center mb-2 sm:mb-4'>Recent Expenses</div>
    <hr className='border-white w-full mb-2 sm:mb-4' />
    <div className='text-white bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl'>
      <table className="min-w-full table-auto text-white">
        <thead>
          <tr className='bg-zinc-700'>
            <th className='px-2 py-1 sm:px-4 sm:py-2'>Name</th>
            <th className='px-2 py-1 sm:px-4 sm:py-2'>Category</th>
            <th className='px-2 py-1 sm:px-4 sm:py-2'>Amount</th>
          </tr>
        </thead>
        <tbody>
          {latestExpenses.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-2 sm:py-4 ">No recent expenses recorded.</td>
            </tr>
          ) : (
            latestExpenses.map((task, index) => (
              <tr key={index} className="hover:bg-zinc-800">
                <td className="border px-2 py-1 sm:px-4 sm:py-2  text-center border-black">{task.description}</td>
                <td className="border px-2 py-1 sm:px-4 sm:py-2 border-black text-center">{task.category}</td>
                <td className="border border-black px-2 py-1 sm:px-4 sm:py-2 text-center">₹{task.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </main>
    
  )
}

export default RecentExp