import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => localStorage.getItem('userId')); 
    const [token, setToken] = useState(() => localStorage.getItem('token')); 

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedToken = localStorage.getItem('token');
         
        if (storedUserId) setUserId(storedUserId);
        if (storedToken) {setToken(storedToken);
           
        }
        
    }, []);
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token'); 
        }
    }, [token]);
    const logout = () => {
        setUserId(null);
        setToken(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ userId, setUserId, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
