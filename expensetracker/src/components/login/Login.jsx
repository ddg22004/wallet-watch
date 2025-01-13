import React from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import COVER_IMAGE from '../../assets/loginimg.jpg'
import walletImg from '../../assets/walletwatch.png'
const Login = () => {
  const [data,setData]=useState({
    
    email: "",
    password:"",
  })
  const {setUserId,setToken} =useAuth();
   const navigate=useNavigate();
  const handleChange=({currentTarget:input})=>{
   setData({...data,[input.name]:input.value});

  }
  const [error,setError]=useState('')
  const handleSubmit= async (e)=>{
   e.preventDefault();
   try {
    const url="http://localhost:8080/api/auth";
    const res= await axios.post(url,data);
    console.log(res.data)
    localStorage.setItem("token", res.data.token); 
    localStorage.setItem("userId", res.data.userId);
   
    navigate('/home');
    
    setUserId(res.data.userId);
    setToken(res.data.token)
  
   } catch (error) {
     if(error.response && 
      error.response.status>=400 && error.response.status<=500
      ){
   setError(error.response.data.message)
      }
   }
  }

  return ( 
    
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${COVER_IMAGE})`}}>
     <div className='flex items-center justify-center h-full bg-black bg-opacity-50'>
     
  

    <form className='text-white bg-gray-800 p-8 rounded-lg shadow-lg bg-opacity-70 max-w-md w-full' onSubmit={handleSubmit} >
        <h1 className='text-3xl text-center font-sans md:font-serif lg:font-mono'>Wallet Watch</h1>
        <div class="flex items-center justify-center ">
        <img src={walletImg} alt="Wallet watch" className='w-3/5 md:w-1/3 lg:w-2/4 filter hue-rotate-180' />
    </div>
       
        <input type='email' placeholder='Email' name='email' value={data.email} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        
        <input type='password' placeholder='Password' name='password' value={data.password} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        {error && <div>{error}</div>}
        <button type="submit" className='w-full bg-cyan-700 p-2 rounded hover:bg-cyan-400' >Login</button>
        <div className='text-white mt-4 flex flex-col'>
    <h1 className='text-center'> New Here ? </h1>
    <div class="flex items-center justify-center ">
    <Link to='/signup'>
    
    <button type='button' className='mt-2 bg-cyan-700 p-2 rounded hover:bg-cyan-400 items-center justify-center'>Sign Up</button></Link>
    </div>
    <div className="flex items-center justify-center mt-2">
                            <Link to='/forgot-password' className='text-cyan-400 hover:underline'>
                                Forgot Password?
                            </Link>
                        </div></div>
      </form>
   
   
    </div>
  </div>
  )
}

export default Login;
