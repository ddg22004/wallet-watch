import React from 'react';

const Report = ({ reportData }) => {
    return (
        <div className='bg-zinc-800 p-6 rounded-lg shadow-lg mt-6'>
            <h2 className='text-2xl font-bold text-white mb-4'>Financial Report</h2>
           
            <p className="text-lg text-white mb-2">Total Expenses: <span className="font-semibold">₹{reportData.totalExpense}</span></p>
            <h3 className="text-xl font-semibold text-white mb-2">Budget Adherence</h3>
            <ul className='list-disc list-inside text-white'>
                {reportData.budgetAdherence && reportData.budgetAdherence.map((item) => (
                    <li key={item.category} className='mb-2'>
                        <span className="font-medium">{item.category}:</span>  Spent ₹{item.spent} of ₹{item.budget}  <span className={`ml-2 ${item.adherence > 100 ? 'text-red-500' : 'text-green-500'}`}>
                            ({item.adherence.toFixed(2)}%)
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Report;
