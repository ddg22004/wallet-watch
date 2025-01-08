import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ListExp from "./ListExp";
import Report from "./Report";
import { useAuth } from "../context/AuthContext";
import ExpenseChart from "../Charts/Linechart";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Others",
];

const Expenses = () => {
  const [expense, setExpense] = useState([]);
  const {userId,token}=useAuth();
  const [budgets, setBudgets] = useState({});
  const [reportData, setReportData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
 
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
  

  

  const addExpense = async (transaction) => {
    const date = new Date();
    console.log(transaction)
    const da=JSON.stringify({userId,...transaction,date,token})
    console.log(da)
    try {
      const response=await fetch(`http://localhost:8080/api/expenses`,{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({...transaction,userId}),
      })
      if(!response.ok) throw new Error ('Failed to add expense');
      const newExpense= await response.json();
      setExpense((prevExpenses) => [...prevExpenses,newExpense]);
      checkBudgetAlerts(transaction);
     
    } catch (error) {
      console.error("Error adding expense", error);
    }
   
  };

  const generateReport = () => {
    // Calculate total expenses
    const totalExpense = expense.reduce((acc, curr) => acc + curr.amount, 0);

    // Create a mapping of spent amounts per category
    const spentByCategory = expense.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    // Generate report data
    const report = {
        totalExpense,
        budgetAdherence: Object.keys(budgets).map((cat) => {
            const spent = spentByCategory[cat] || 0; // Get spent amount or default to 0
            const budget = budgets[cat] || 0; // Get budget or default to 0
            const adherence = budget ? (spent / budget) * 100 : 0;

            return {
                category: cat,
                spent,
                budget,
                adherence: parseFloat(adherence.toFixed(2)), // Format to two decimal places
            };
        }),
    };

    setReportData(report);
};
const deleteExpense = async (transactions) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
  if (!confirmDelete) return;

  try {
    
    const response = await fetch(`http://localhost:8080/api/expenses/${transactions.taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
     
    });

    if (!response.ok) throw new Error("Failed to delete expense");

  
    setExpense((prevExpenses) => prevExpenses.filter(exp => 
      exp.taskId !==transactions.taskId
    ));
  } catch (error) {
    console.error("Error deleting expense", error);
  }
};
  const checkBudgetAlerts = (transaction) => {
    const currentBudget = budgets[transaction.category];
    const totalSpent =
      expense
        .filter((t) => t.category === transaction.category)
        .reduce((acc, curr) => acc + curr.amount, 0) + transaction.amount;

    if (
      totalSpent > currentBudget * 0.8 &&
      !alerts.includes(transaction.category)
    ) {
      setAlerts((prev) => [...prev, transaction.category]);
      alert(
        `Alert: You have spent over 80% of your budget for ${transaction.category}`
      );
    }
  };

  const filteredExpense = selectedCategory
    ? expense.filter((x) => x.category === selectedCategory)
    : expense;

  const getWeeklySummary = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyExpenses = expense.filter(
      (expense) => new Date(expense.date) >= lastWeek
    );
    const totalWeekly = weeklyExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    return { total: totalWeekly, expenses: weeklyExpenses };
  };
  const getMonthlySummary = () => {
  const now=new Date();
  const start=new Date(now.getFullYear(),now.getMonth(),1);
  const end=new Date(now.getFullYear(),now.getMonth() +1,0);
  const monthlyExpenses=expense.filter((expense)=>start && new Date(expense.date)<=end);
  const totalMonthly =monthlyExpenses.reduce((acc,curr)=>acc+curr.amount,0);

    return { total: totalMonthly, expenses: monthlyExpenses };
  };
  useEffect(()=>{
    generateReport();
  },[expense,budgets])
  
 
  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
     
     <h1 className="text-3xl font-bold text-white mb-4">Manage Your Expenses</h1>
     <button 
                onClick={() => setIsFormOpen(!isFormOpen)} 
                className='bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4'
            >
                {isFormOpen ? 'Cancel' : 'Add Expense'}
            </button>
            <div 
                className={`transition-all duration-300 ease-in-out ${isFormOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
            >
                {isFormOpen && <ExpenseForm addExpense={addExpense} budgets={budgets} />}
            </div>
      <div className="mb-2">
      <label className="text-white text-lg" htmlFor="categorySelect">Filter by Category:</label>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory} className="bg-zinc-800 text-white rounded-lg p-2 ml-2"
        >
          <option value="" className="bg-zinc-900">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-zinc-900">
              {cat}
            </option>
          ))}
        </select>
        </div>
        <ListExp transactions={filteredExpense} deleteExpense={deleteExpense} />
       

        <div className="mt-6 bg-zinc-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white">Weekly Summary</h2>
        <p className="text-white">Total Expenses This Week: ₹{getWeeklySummary().total}</p>
        <ul className="mt-2">
          {getWeeklySummary().expenses.map((expense, index) => (
            <li key={index} className="text-white">
              {expense.description}: ₹{expense.amount} on{" "}
              {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Monthly Summary */}
      <div className="mt-6 bg-zinc-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white">Monthly Summary</h2>
        <p className="text-white">Total Expenses This Month: ₹{getMonthlySummary().total}</p>
        <ul className="mt-2">
          {getMonthlySummary().expenses.map((expense, index) => (
            <li key={index} className="text-white">
              {expense.description}: ₹{expense.amount} on{" "}
              {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-white">
      <Report reportData={reportData}/>
      </div>
     
    </div>
  );
};

export default Expenses;
