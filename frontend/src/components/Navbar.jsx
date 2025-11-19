import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Navbar = () => {

    const navigate = useNavigate(); //hook

    const [showMenu,setShowMenu] = useState(false)
    const {token, setToken, userData} = useContext(AppContext) || {} 
    const logout = () => {
        setToken("") // Clear token in context
        localStorage.removeItem('token')
        toast.success("Logged out successfully.") // Toastify message
        navigate('/login') // Redirect to login page
    }

    const handleAdminPanelRedirect = () => {
      // Assuming the admin panel is served on a different port or path
      window.location.href = 'http://localhost:5174/'; // Redirect to admin panel base URL
    };

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=''></img>
        
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                <button 
                    onClick={handleAdminPanelRedirect}
                    className='bg-gray-200 text-gray-700 py-3 px-4 rounded-full font-light hidden md:block hover:bg-gray-300 transition'>
                    Admin Panel
                </button>
                {
                    token ? 
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className='w-8 rounded-full' src={userData?.image || assets.upload_icon} alt='profile'></img>
                        <img className='w-2.5' src={assets.dropdown_icon} alt=''></img>
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                    :<button onClick={() => navigate('/login')} className='bg-primary text-white py-3 px-8 rounded-full font-light hidden md:block'>Create Account</button>
                }
            </div>
    </div>
  )
}

export default Navbar