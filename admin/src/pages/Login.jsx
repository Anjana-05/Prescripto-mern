import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'

const Login = () => {

    const {backendUrl, setAToken} = useContext(AdminContext)
    const navigate = useNavigate()

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            const {data} = await axios.post(backendUrl + '/api/admin/login', {email,password})
            if(data.success){
                localStorage.setItem('aToken',data.token)
                setAToken(data.token)
                toast.success("Logged in Successfully")
                navigate('/admin-dashboard')
            } else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='flex flex-col items-center justify-center min-h-[90vh]'> {/* Added a wrapper div */}
      <img onClick={() => window.location.href = 'http://localhost:5173/'} className='w-44 cursor-pointer mb-8' src={assets.admin_logo} alt='Admin Logo'/> {/* Corrected image source and navigation */}
      <form onSubmit={onSubmitHandler}> {/* Removed min-h-[90vh] flex items-center from here */}
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[320px] sm:min-w-[380px] border rounded-2xl shadow-lg bg-white'>
            <p className='text-2xl font-semibold'>Admin Login</p>

            <p className='text-gray-500'>Please log in to the admin panel</p>

            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
            </div>

            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" required />
            </div>

            <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base mt-3 hover:bg-[#4f46e5] transition'>Login</button>
        </div>
    </form>
    </div>
  )
}

export default Login