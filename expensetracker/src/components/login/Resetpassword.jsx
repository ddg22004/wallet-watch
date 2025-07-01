import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import COVER_IMAGE from '../../assets/loginimg.jpg'; 

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.APP_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setError(''); 
        } catch (error) {
            console.error(error);
            setError('Error resetting password. Please try again.');
            setMessage(''); 
        }
    };

    return (
        <div className="relative w-full h-screen bg-cover bg-center " style={{ backgroundImage: `url(${COVER_IMAGE})` }}>
            <div className='flex items-center justify-center h-full bg-black bg-opacity-50'>
                <form className='text-white bg-gray-800 p-8 rounded-lg shadow-lg bg-opacity-70 max-w-md w-full' onSubmit={handleSubmit}>
                    <h1 className='text-3xl text-center font-sans md:font-serif lg:font-mono py-3'>Reset Password</h1>
                    <input 
                        type='password' 
                        placeholder='Enter new password' 
                        value={password} 
                        required
                        onChange={(e) => setPassword(e.target.value)} 
                        className='w-full p-2 mb-4 rounded text-black'
                    />
                    {error && <div className="text-red-500">{error}</div>}
                    {message && <div className="text-green-500">{message}</div>}
                    <button type="submit" className='w-full bg-cyan-700 p-2 rounded hover:bg-cyan-400'>Reset Password</button>
                    <div className="flex justify-center mt-4">
    <Link to="/login" className='w-full p-2 text-center'>
        Back to Login
    </Link>
</div>
                </form>
                
            </div>
        </div>
    );
};

export default ResetPassword;
