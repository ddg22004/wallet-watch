import React from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import COVER_IMAGE from '../../assets/loginimg.jpg'
const Signup = () => {
  const [data,setData]=useState({
    firstName: "",
    lastName: "",
    email: "",
    password:"",
  })
  const navigate =useNavigate();
  const handleChange=({currentTarget:input})=>{
   setData({...data,[input.name]:input.value});

  }
  const apiUrl = process.env.APP_URL;
  const [error,setError]=useState('')
  const handleSubmit= async (e)=>{
   e.preventDefault();
   try {
    const url=`${apiUrl}/api/users`;
    const {data:res}= await axios.post(url,data);
    console.log(res.message)
    navigate("/login")
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
    
   
    
    <div>
    <h1 className='text-white my-5 text-3xl text-center font-sans md:font-serif lg:font-mono'>Welcome To Wallet Watch</h1>
      <form className='text-white bg-gray-800 p-8 rounded-lg shadow-lg bg-opacity-70 max-w-md w-full' onSubmit={handleSubmit} >
        <h1 className='text-3xl text-center font-sans md:font-serif lg:font-mono my-3'>Create Account</h1>
        <input type='text' placeholder='First Name' name='firstName' value={data.firstName} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        
        <input type='text' placeholder='Last Name' name='lastName' value={data.lastName} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        
        <input type='email' placeholder='Email' name='email' value={data.email} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        
        <input type='password' placeholder='Password' name='password' value={data.password} required
        onChange={handleChange} className='w-full p-2 mb-4 rounded text-black'/>
        {error && <div>{error}</div>}
        <button type="submit" className='
        w-full bg-cyan-700 p-2 rounded hover:bg-cyan-400'>Sign Up</button>
        <h1 className='my-2'>Already a Registered User?</h1>   <div className='justify-center items-center align-middle flex'><Link to='/login'>
       
        <button type='button' className='
        w-auto bg-cyan-700 p-2 rounded hover:bg-cyan-400'>Sign in</button></Link></div>
      </form>
      </div></div>
    </div>
  )
}

export default Signup