import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext'; // Corrected import path to AdminContext

const Dashboard = () => {
  const { backendUrl, aToken } = useContext(AdminContext); // Destructure from AdminContext
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    if (!aToken) {
      // This case should ideally be handled by AdminRoutes protecting the route
      return;
    }
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/stats', {
        headers: { aToken }, // Use aToken for admin authentication
      });
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [aToken]); // Depend on aToken

  if (!stats) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Total Doctors</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalDoctors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Total Appointments</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;