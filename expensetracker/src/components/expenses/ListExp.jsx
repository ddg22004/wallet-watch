import React from 'react'

const ListExp = ({transactions,deleteExpense}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); 
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; 
};
  
  
  return (
    <main className='flex flex-col items-center justify-center mt-3  bg-zinc-800 sm:mt-5 sm:p-5'>
    <div className='text-white text-xl sm:text-3xl text-center mb-2 sm:mb-4'>Expenses</div>
    <hr className='border-white w-full mb-2 sm:mb-4' />
    <div className='text-white bg-zinc-900  sm:p-6 rounded-lg shadow-lg w-full max-w-4xl'>
      <table className="min-w-full table-auto text-white">
        <thead>
          <tr className='bg-zinc-700'>
            <th className='px-1 py-1 sm:px-4 sm:py-2 '>Name</th>
            <th className='px-1 py-1 sm:px-4 sm:py-2'>Date</th>
            <th className='px-1 py-1 sm:px-4 sm:py-2'>Category</th>
            <th className='px-1 py-1 sm:px-4 sm:py-2'>Amount</th>
            <th className='px-1 py-1 sm:px-4 sm:py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-2">No recent expenses recorded.</td>
            </tr>
          ) : (
            transactions.map((task, index) => (
              <tr key={index} className="hover:bg-zinc-800">
                <td className="border px-2 py-1 text-center border-black">{task.description}</td>
                <td className="border px-2 py-1 text-center border-black">{formatDate(task.date)}</td>
                <td className="border px-2 py-1 border-black text-center">{task.category}</td>
                <td className="border border-black px-2 py-1 text-center">₹{task.amount}</td>
                <td className="border border-black px-2 py-1 text-center">
                  <button
                    onClick={() => deleteExpense(task)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded m-1 "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </main>
  
  );
};

export default ListExp;