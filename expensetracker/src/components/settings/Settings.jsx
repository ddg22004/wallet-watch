import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
const Settings = () => {
  const {userId}=useAuth();
  console.log(userId)
  const [activeField, setActiveField] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData,setFormData]=useState({
    firstName: '',
        lastName: '',
        email: '',
        password: ''
  })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });};
    const handleSubmit = async () => {
      try {
        await axios.put(`${apiUrl}/api/users/update`, { userId, [activeField]: formData[activeField] });
        alert(`${activeField.replace(/([A-Z])/g, ' $1')} updated successfully!`);
        setActiveField(null); 
      } catch (error) {
        console.error(error);
        alert(`Failed to update ${activeField}.`);
      }
    };
  
    const fields = ['firstName', 'lastName', 'email', 'password'];
  

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col p-6 space-y-4 ml-12">
    <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

    <ul className="space-y-2">
      {fields.map((field) => (
        <li key={field} className="bg-zinc-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-zinc-700 transition duration-200 text-white">
          <div onClick={() => setActiveField(activeField === field ? null : field)}>
            Change {field.replace(/([A-Z])/g, ' $1')}
          </div>
          {activeField === field && (
            <div className="mt-2 bg-zinc-800 p-4 rounded-lg shadow-md w-full max-w-md">
              <input
                type={activeField === 'password' ? 'password' : 'text'}
                name={activeField}
                value={formData[activeField]}
                onChange={handleChange}
                className="  mt-1  w-full p-2 border border-zinc-600 rounded-md bg-zinc-700 text-white"
              />
              <button
                onClick={handleSubmit}
                className="block mt-3 w-full bg-zinc-500 text-white p-2 rounded-md hover:bg-zinc-400 transition duration-200"
              >
                Change {field.replace(/([A-Z])/g, ' $1')}
              </button>
              <button
                onClick={() => setActiveField(null)} // Close the form
                className="mt-2 w-full text-white p-2 rounded-md hover:bg-zinc-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default Settings