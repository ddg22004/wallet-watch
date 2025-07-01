import React, { useState } from 'react';
import axios from 'axios';
import COVER_IMAGE from '../../assets/loginimg.jpg'; 
import walletImg from '../../assets/walletwatch.png'; 
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.APP_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setMessage(response.data.message);
            setError(''); 
        } catch (error) {
            console.error(error);
            setError('Error sending reset link. Please try again.');
            setMessage(''); 
        }
    };

    return (
        <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${COVER_IMAGE})` }}>
            <div className='flex items-center justify-center h-full bg-black bg-opacity-50'>
                <form className='text-white bg-gray-800 p-8 rounded-lg shadow-lg bg-opacity-70 max-w-md w-full' onSubmit={handleSubmit}>
                    <h1 className='text-3xl text-center font-sans md:font-serif lg:font-mono'>Wallet Watch</h1>
                    <div className="flex items-center justify-center">
                        <img src={walletImg} alt="Wallet watch" className='w-3/5 md:w-1/3 lg:w-2/4 filter hue-rotate-180' />
                    </div>
                    <input 
                        type='email' 
                        placeholder='Enter your email' 
                        value={email} 
                        required
                        onChange={(e) => setEmail(e.target.value)} 
                        className='w-full p-2 mb-4 rounded text-black'
                    />
                    {error && <div className="text-red-500">{error}</div>}
                    {message && <div className="text-green-500">{message}</div>}
                    <button type="submit" className='w-full bg-cyan-700 p-2 rounded hover:bg-cyan-400'>Send Reset Link</button>
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

export default ForgotPassword;
