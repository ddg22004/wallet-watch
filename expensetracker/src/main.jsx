import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Expenses from './components/expenses/Expenses.jsx';
import Home from './components/home/Home.jsx';
import { CategoriesProvider } from './components/context/CategoriesContext'; 
import './App.css';
import Layout from './Layout.jsx';
import Signup from './components/login/Signup.jsx';
import Login from './components/login/Login.jsx';
import { AuthProvider, useAuth } from './components/context/AuthContext.jsx';
import Settings from './components/settings/Settings.jsx';
import ForgotPassword
 from './components/login/ForgotPassword.jsx';
import ResetPassword from './components/login/Resetpassword.jsx';

const ProtectedLayout = () => {
  const { userId } = useAuth(); 

  return userId ? <Layout /> : <Navigate to="/login" />;
};
const router = createBrowserRouter([
  {
    path: '/',
    element:<ProtectedLayout/>,
    children: [
      { path: '', element: <Navigate to="/home" replace /> }, // Default redirect
      { path: 'home', element: <Home /> },
      { path: 'expenses', element: <Expenses /> },
      {path:'settings',element:<Settings/>},
    ],
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
    <RouterProvider router={router} /></CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
);
