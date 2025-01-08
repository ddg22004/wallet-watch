import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import sidebarimg from '../../assets/sidebar.jpg'
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
        <div className='flex items-center justify-between bg-zinc-900 p-4'>
            <button onClick={() => setIsopen(!isOpen)} className="lg:hidden md:p-2 bg-zinc-900 text-white">
                <img src={sidebarimg} alt='Menu' className='h-12' />
            </button>
           
            
            {isOpen && (
                <aside className={`fixed inset-y-0 left-0 bg-zinc-900 text-white text-3xl p-6 md:hidden w-1/3 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                     <button onClick={() => setIsopen(!isOpen)} className="md:p-2 bg-zinc-900 text-white">
                <img src={sidebarimg} alt='Menu' className='h-12' />
            </button>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className='text-2xl'>Hello, {user.firstName} {user.lastName}</h1>
                        </div>
                    <ul>
                
                        <li className='py-4'><Link to="/home" className="hover:bg-zinc-700 block p-2 rounded">Home</Link></li>
                        <li className='py-8'><Link to="/expenses" className="hover:bg-zinc-700 block p-2 rounded">Expenses</Link></li>
                       
                        <li className="py-8"> <button onClick={handleLogout} className="hover:bg-zinc-700 block p-2 rounded">Log Out</button></li>
                    </ul>
                   
                </aside>
            )}
            
            <nav className="hidden md:flex space-x-4">
               
                <Link to="/home" className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Home</Link>
                <Link to="/expenses" className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Expenses</Link>
                <button onClick={handleLogout} className="text-white hover:bg-zinc-700 px-3 py-2 rounded">Log Out</button>
            </nav>
        </div>
    );
};

export default Navbar;
