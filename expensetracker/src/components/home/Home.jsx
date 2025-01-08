import React, { useState,useEffect } from 'react'

import RecentExp from './recentexp/RecentExp';

import Budgetcard from '../budgets/Budgetcard';
import { useAuth } from '../context/AuthContext';
import Expenses from '../expenses/Expenses';



const Home = () => {

 const [expenses,setExpense]=useState([]);
 const {userId,token}=useAuth();
 const [budgets,setBudgets]=useState({});
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
       console.log(data)
     }
     catch (error){
       console.error("Error fetching Expense",error)
     }
   };
   useEffect(()=>{
     fetchExpenses();
   },[userId])
   useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/budgets/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch budgets');
        const data = await response.json();
        setBudgets(data.categories.reduce((acc, category) => ({
          ...acc,
          [category.name]: category.amount,
        }), {}));
      } catch (error) {
        console.error("Error fetching budgets", error);
      }
    };
  
    fetchBudgets();
  }, [userId]);
   const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
   
 
   const totalIncome = Object.values(budgets).reduce((acc, curr) => acc + curr, 0);
   const remainingBudget=totalIncome-totalExpenses;
  return (
    <>
  <div className='p-6 bg-zinc-900 min-h-screen'>
  <h1 className="text-3xl font-bold mb-4 text-zinc-400 text-center">Welcome to Wallet Watch!</h1>
  <Budgetcard/>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Total Income</h2>
                    <p className="text-2xl">₹{totalIncome}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Total Expenses</h2>
                    <p className="text-2xl">₹{totalExpenses}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold">Remaining Budget</h2>
                    <p className="text-2xl">₹{remainingBudget}</p>
                </div>
            </div>

    <RecentExp/>
    <Expenses/>
  </div>

  </>
  )
}

export default Home