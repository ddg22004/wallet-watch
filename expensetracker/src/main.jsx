import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Expenses from './components/expenses/Expenses.jsx';
import Home from './components/home/Home.jsx';
import Settings from './components/settings/Settingsexp.jsx';
import Support from './components/support/Support.jsx';
import './App.css';
import Layout from './Layout.jsx';
import Signup from './components/login/Signup.jsx';
import Login from './components/login/Login.jsx';
import { AuthProvider } from './components/context/AuthContext.jsx';
const user = localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: '/',
    element:<Layout />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'expenses', element: <Expenses /> },
      
    ],
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
 
  { path: '*', element: <Navigate to="/login" replace /> },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
