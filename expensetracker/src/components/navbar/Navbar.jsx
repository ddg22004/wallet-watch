import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoneyBillWave, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
const Navbar = () => {
    const [isOpen, setIsopen] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { userId } = useAuth();
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = '/login'; 
      };
    console.log("User ID from context:", userId);
    
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

    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className='flex items-center justify-between bg-zinc-900 p-4 '>
           
                   
                        <aside className={`lg:hidden fixed inset-y-0 left-0 bg-zinc-900 text-white p-4 transition-transform duration-300 ease-in-out $`}>
            
            <ul>
                <li className="flex items-center py-2">
                    <Link to="/home" className="hover:bg-zinc-700 block p-2 rounded">
                    <FontAwesomeIcon icon={faHome} className="my-6" /></Link>
                </li>
                <li className="flex items-center py-2">
                    <Link to="/expenses" className="hover:bg-zinc-700 block p-2 rounded">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="my-6" /></Link>
                </li>
                
                <li className="flex items-center py-2">
                   
                    <Link to="/settings" className="hover:bg-zinc-700 block p-2 rounded"> <FontAwesomeIcon icon={faCog} className="my-6" /></Link>
                </li>
                <li className="flex items-center py-2">
                    
                    <button onClick= {handleLogout}className="hover:bg-zinc-700 block p-2 rounded"><FontAwesomeIcon icon={faSignOutAlt} className="my-6" /></button>
                </li>
            </ul>
        </aside>
                   
           
            <div className='sm:hidden lg:block'>
            <nav className="space-x-4">
               
                <Link to="/home" className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Home</Link>
                <Link to="/expenses" className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Expenses</Link>
                <button onClick={handleLogout} className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Log Out</button>
            </nav></div>
        </div>
    );
};

export default Navbar;
