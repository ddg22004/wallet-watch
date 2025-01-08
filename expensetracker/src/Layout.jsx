import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';

const Layout = () => {
 

  return (
    <div className=''>
      <Navbar user="" /> 
      <div className=""> 
        <Outlet />
      </div>
      
    </div>
  );
};

export default Layout;
