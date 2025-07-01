import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ListExp from "./ListExp";
import Report from "./Report";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../context/CategoriesContext";
import { jsPDF } from "jspdf";


const Expenses = () => {
  const [expense, setExpense] = useState([]);
  const apiUrl = process.env.APP_URL;
  const {userId,token}=useAuth();
  const [budgets, setBudgets] = useState({});
  const [reportData, setReportData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { combinedCategories, addCustomCategory } = useCategories();
  
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
      console.log(data)
      console.log(categories)
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
      const response = await fetch(`${apiUrl}/api/budgets/${userId}`);
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
      const response=await fetch(`${apiUrl}/api/expenses`,{
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
    
    const response = await fetch(`${apiUrl}/api/expenses/${transactions.taskId}`, {
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
  const getMonthlySummary = (year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); 

    const monthlyExpenses = expense.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
    });

    const totalMonthly = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    return { total: totalMonthly, expenses: monthlyExpenses };
};
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
const handleMonthChange = (e) => {
  setSelectedMonth(Number(e.target.value));
};
const handleYearChange = (e) => {
  setSelectedYear(Number(e.target.value));
};
  useEffect(()=>{
    generateReport();
  },[expense,budgets])
  
  const monthlySummary = getMonthlySummary(selectedYear, selectedMonth);



  const generatePDF = () => {
    const doc = new jsPDF();
    const monthlySummary = getMonthlySummary(selectedYear, selectedMonth);
   
    // Title
    doc.setFontSize(22);
    doc.text("Monthly Expenses Summary", 20, 20);

    
    const walletBalance = budgets ? Object.values(budgets).reduce((acc, curr) => acc + curr, 0) : 0;
    doc.setFontSize(12);
    doc.text(`Wallet Watch: ${walletBalance} Rs`, 120, 20); 

    // Current Date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

    // Total Expenses
    doc.setFontSize(16);
    doc.text(`Total Expenses for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}: ${monthlySummary.total} Rs`, 20, 40);

    // Expense Details
    doc.setFontSize(14);
    doc.text("Expense Details:", 20, 60);
    
    let yPosition = 70;
    monthlySummary.expenses.forEach((exp) => {
        doc.text(`${exp.description}: ${exp.amount} Rs on ${new Date(exp.date).toLocaleDateString()}`, 20, yPosition);
        yPosition += 10; 
    });

    doc.setFontSize(10);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 20, yPosition + 20);

    // Save the PDF
    doc.save("monthly_expenses_summary.pdf");
};
  
  return (
    <div className="p-6 bg-zinc-900 min-h-screen ">
     
     <h1 className="text-3xl font-bold text-white mb-4">Manage Your Expenses</h1>
     <div className="mb-4">
        <input type="text" placeholder="Add Custom Category"
        onKeyDown={(e)=>{
          if(e.key=='Enter'){
            addCustomCategory(e.target.value);
            e.target.value=""
          }
        }}  className="bg-zinc-800 text-white rounded-lg p-2"/>

      </div>
     <button 
                onClick={() => setIsFormOpen(!isFormOpen)} 
                className='bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4'
            >
                {isFormOpen ? 'Cancel' : 'Add Expense'}
            </button>
            <div 
                className={`transition-all duration-300 ease-in-out ${isFormOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
            >
                {isFormOpen && <ExpenseForm addExpense={addExpense} budgets={budgets} categories={combinedCategories} />}
            </div>
      <div className="mb-2">
      <label className="text-white text-lg" htmlFor="categorySelect">Filter by Category:</label>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory} className="bg-zinc-800 text-white rounded-lg p-2 ml-2"
        >
          <option value="" className="bg-zinc-900">All Categories</option>
          {combinedCategories.map((cat) => (
            <option key={cat} value={cat} className="bg-zinc-900">
              {cat}
            </option>
          ))}
        </select>
        </div>
        <ListExp transactions={filteredExpense} deleteExpense={deleteExpense}  />
       

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

      
      <div className="mt-6 bg-zinc-800 p-4 rounded-lg shadow-lg  ">
    <label className="text-white" htmlFor="monthSelect">Select Month:</label>
    <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange} className="bg-zinc-800 p-4 rounded-lg shadow-lg text-white hover:bg-zinc-500 ">
        {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1} className="bg-zinc-800 p-4 rounded-lg shadow-lg text-white hover:bg-zinc-500">{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
        ))}
    </select>

    <label className="text-white  ml-2" htmlFor="yearSelect">Select Year:</label>
    <select id="yearSelect" value={selectedYear} onChange={handleYearChange} className=" bg-zinc-800 p-4 rounded-lg shadow-lg text-white hover:bg-zinc-500">
        {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i} className="bg-zinc-800 p-4 rounded-lg shadow-lg text-white hover:bg-zinc-500">{new Date().getFullYear() - i}</option>
        ))}
    </select>

<div className=" bg-zinc-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white">Monthly Summary</h2>
        <p className="text-white">Total Expenses for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}: ₹{monthlySummary.total}</p>
        <ul className="mt-2">
            {monthlySummary.expenses.map((expense, index) => (
                <li key={index} className="text-white">
                    {expense.description}: ₹{expense.amount} on{" "}
                    {new Date(expense.date).toLocaleDateString()}
                </li>
            ))}
        </ul>
    </div>
    </div>
    <button 
                    onClick={generatePDF} 
                    className='mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded'
                >
                    Download Monthly Summary as PDF
                </button>
      <div className="text-white">
      <Report reportData={reportData}/>
      </div>
    
    </div>
  );
};

export default Expenses;
