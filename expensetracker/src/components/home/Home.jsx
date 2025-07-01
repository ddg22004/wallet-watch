import React, { useState,useEffect } from 'react'

import RecentExp from './recentexp/RecentExp';

import Budgetcard from '../budgets/Budgetcard';
import { useAuth } from '../context/AuthContext';
import BudgetVsExpensesChart from "../charts/BudgetVsExpenseChart";

import ExpenseTrendChart from '../charts/ExpenseTrendChart';
import ComparisonChart from '../charts/ComparisonChart';
import MonthlyExpenseDistributionChart from '../charts/MonthlyExpenseDistributionChart';
import { useCategories } from '../context/CategoriesContext';


const Home = () => {
 const {combinedCategories}=useCategories();
 const [expenses,setExpense]=useState([]);
 const {userId,token}=useAuth();
 const [budgets,setBudgets]=useState({});
 const [user,setUser]=useState('')
 useEffect(() => {
         const fetchUserData = async () => {
             if (!userId){
               console.log("No user ID available")
               return;
             } 
             
             try {
               
                 const response = await fetch(`http://localhost:8080/api/users/${userId}`)
                 console.log(response)
                 if (!response.ok) {
                     const errorText = await response.text(); 
                     console.log(errorText)
                     throw new Error(`User not found: ${errorText}`);
                 }
                 const data = await response.json();
                 console.log(data)
                 setUser(data);
             } catch (error) {
                 setError(error.message);
                 console.log(error)
             }
            
         };
         fetchUserData();
     }, [userId]);
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
   const expense=expenses
 
   const totalIncome = Object.values(budgets).reduce((acc, curr) => acc + curr, 0);
   const remainingBudget=totalIncome-totalExpenses;


   const preparePieChartData = () => {
    const spentByCategory = expense.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    return Object.keys(spentByCategory).map((category) => ({
        id: category,
        label: category,
        value: spentByCategory[category],
    }));
};

const chartData = preparePieChartData();

const prepareExpenseTrendData =()=>{
  const trendData={};
expenses.forEach((exp)=>{
  const date=new Date(exp.date);
  const monthYear=`${date.getFullYear()}-${date.getMonth()+1}`;
  if(!trendData[monthYear]){
    trendData[monthYear]={totalSpent:0};
  }
  trendData[monthYear].totalSpent+=exp.amount;
})
const trendArray = Object.keys(trendData).map((key) => ({
  month: key,
  spent: trendData[key].totalSpent,
}));


trendArray.sort((a, b) => new Date(a.month) - new Date(b.month));

return trendArray;
}

const expensecatdata=prepareExpenseTrendData();

const prepareComparisionData =() =>{
  const spentByCategory=expenses.reduce((acc,curr)=>{
    acc[curr.category]=(acc[curr.category]||0)+curr.amount;
    return acc;
  },{});

  return combinedCategories.map((category)=>({
    category,
    spent: spentByCategory[category]||0,
    budget: budgets[category]||0,
  }))
}


const comparisonData=prepareComparisionData();

const prepareMonthlyExpenseDistributiondata = () => {
  const monthlyData = {};
  expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {};
      }
      if (!monthlyData[monthYear][exp.category]) {
          monthlyData[monthYear][exp.category] = 0;
      }
      monthlyData[monthYear][exp.category] += exp.amount;
  });

  
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a) - new Date(b); 
  });

  return sortedMonths.map((month) => {
      const categoriesData = {};
      
      combinedCategories.forEach((category) => {
          categoriesData[category] = monthlyData[month][category] || 0; 
      });
      
      return { month, ...categoriesData };
  });
};
const d=prepareMonthlyExpenseDistributiondata();
return (
  <div className=''>
      <div className='p-4 md:p-6 bg-zinc-900 min-h-screen'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2 text-zinc-400 text-center'>Hello {user.firstName}</h1>
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-zinc-400 text-center">Welcome to Wallet Watch!</h1>
          <div className='md:ml-10'>
          <Budgetcard />
          <RecentExp />
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg md:text-xl font-semibold">Total Income</h2>
                  <p className="text-xl md:text-2xl">₹{totalIncome}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg md:text-xl font-semibold">Total Expenses</h2>
                  <p className="text-xl md:text-2xl">₹{totalExpenses}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg md:text-xl font-semibold">Remaining Budget</h2>
                  <p className="text-xl md:text-2xl">₹{remainingBudget}</p>
              </div>
          </div>
          </div>
          <div className='bg-black flex-grow m-2 p-4 rounded-lg'>
              <h2 className="text-xl font-semibold text-black text-center mb-3">Expense Breakdown</h2>
               <BudgetVsExpensesChart data={chartData} val={0.3} /> 
          </div>

          <div className='grid grid-cols-1 md:grid-cols-1 gap-4 my-6'>
              <div className="bg-blue-100 flex-grow m-2 p-4 rounded-lg">
                  <h2 className="text-lg md:text-xl font-semibold m-5">Expenses Over Time</h2>
                  <ExpenseTrendChart data={expensecatdata} />
              </div>
              <div className="bg-blue-100 flex-grow m-2 p-4 rounded-lg">
                  <h2 className="text-lg md:text-xl font-semibold text-black">Actual vs. Budgeted Amounts</h2>
                  <ComparisonChart data={comparisonData} />
              </div>
              <div className="bg-blue-100 flex-grow m-2 p-4 rounded-lg ">
                  <h2 className="text-lg md:text-xl font-semibold text-black">Month Wise Distribution of Data Based on Category</h2>
                  <MonthlyExpenseDistributionChart data={d} />
              </div>
          </div>
      </div>
  </div>
);
}

export default Home