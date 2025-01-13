import React, { useEffect, useState } from 'react'
import Budgethandle from './Budgethandle';

const Budgetcard = () => {
  const [isCardOpen,setIsCardOpen]=useState(false);
    
  const handleOpenCard =()=>{
 setIsCardOpen(true);
  }
  const handleCloseCard =()=>{
    setIsCardOpen(false);
     }
     useEffect(() => {
      if (isCardOpen) {
          document.body.style.overflow = 'hidden'; 
      } else {
          document.body.style.overflow = 'auto'; 
      }

     
      return () => {
          document.body.style.overflow = 'auto';
      };
  }, [isCardOpen]);

  return (
    <div className='text-white mb-6'>
      <button onClick={handleOpenCard} className='bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-300'>Set Budget</button>
      <Budgethandle isOpen={isCardOpen} onClose={handleCloseCard}/>
    </div>
  )
}

export default Budgetcard