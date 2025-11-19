import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctors from './pages/Admin/AddDoctors';
import AllApointments from './pages/Admin/AllApointments';
import DoctorsList from './pages/Admin/DoctorsList';


const App = () => {

  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/admin-dashboard' element={<Dashboard />}></Route>
          <Route path='/all-appointments' element={<AllApointments />}></Route>
          <Route path='/add-doctor' element={<AddDoctors />}></Route>
          <Route path='/doctor-list' element={<DoctorsList />}></Route>
        </Routes>
      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
}

export default App
