import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const [myAppointments, setMyAppointments] = useState([])
  const navigate = useNavigate()

  const fetchMyAppointments = async () => {
    if (!token) {
      toast.error("Please login to view your appointments.")
      navigate("/login")
      return
    }
    try {
      const { data } = await axios.get(backendUrl + '/api/user/list-appointments', { headers: { token } })
      if (data.success) {
        // Filter out cancelled appointments before setting state
        const activeAppointments = data.appointments.filter(app => app.status !== 'cancelled');
        setMyAppointments(activeAppointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    if (!token) {
        toast.error("Please login to cancel appointments.")
        navigate("/login")
        return
    }
    try {
        const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
        if (data.success) {
            toast.success(data.message)
            // Filter out the cancelled appointment from the state for immediate UI update
            setMyAppointments(prevAppointments => prevAppointments.filter(app => app._id !== appointmentId));
            // Optionally, re-fetch all appointments to ensure full data consistency (can be less responsive)
            // await fetchMyAppointments() 
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchMyAppointments()
  }, [token])

  return (
    <div className='max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm'>
      <p className='text-2xl font-semibold mb-6'>My Appointments</p>
      <div className='flex flex-col gap-4'>
        {myAppointments.length > 0 ? (
          myAppointments.map((item, index) => (
            <div key={index} className='flex flex-col md:flex-row items-center gap-5 p-4 border border-gray-200 rounded-lg shadow-sm'>
              <div className='flex-shrink-0 w-24 h-24 rounded-full overflow-hidden'>
                <img className='w-full h-full object-cover' src={item.doctorImage || 'https://via.placeholder.com/150'} alt="doctor" />
              </div>
              <div className='flex-1 text-center md:text-left'>
                <p className='text-lg font-medium'>Dr. {item.doctorName}</p>
                <p className='text-sm text-gray-600'>{item.doctorSpeciality}</p>
                <p className='text-sm text-gray-600'>{item.date} | {item.time}</p>
                <p className='text-sm text-gray-600'>Fee: ${item.consultationFee}</p>
                <p className={`text-sm font-semibold ${item.status === 'approved' ? 'text-green-600' : item.status === 'cancelled' ? 'text-red-600' : 'text-orange-600'}`}>Status: {item.status}</p>
              </div>
              <div className='flex flex-col gap-2 md:ml-auto'>
                {item.status === 'pending' && (
                  <button 
                    onClick={() => cancelAppointment(item._id)}
                    className='bg-red-500 text-white py-2 px-4 rounded-md text-sm hover:bg-red-600 transition'
                  >
                    Cancel Appointment
                  </button>
                )}
                {/* Add Pay Online button if needed */}
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-600'>No appointments found.</p>
        )}
      </div>
    </div>
  )
}

export default MyAppointments