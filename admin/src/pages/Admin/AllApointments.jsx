import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext'; // Corrected import path to AdminContext

const AllApointments = () => {
  const { backendUrl, aToken } = useContext(AdminContext); // Destructure from AdminContext
  const [appointments, setAppointments] = useState([]);

  const fetchAllAppointments = async () => {
    if (!aToken) {
      // This case should ideally be handled by AdminRoutes protecting the route
      return;
    }
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
        headers: { aToken }, // Use aToken for admin authentication
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, [aToken]); // Depend on aToken

  if (appointments.length === 0) {
    return <p className="p-4">No appointments found.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.userId?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.userId?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date} | {appointment.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' : appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllApointments;