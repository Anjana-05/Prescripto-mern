import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MyProfile = () => {
  const { backendUrl, userData, setUserData, token, loadUserProfileData } =
    useContext(AppContext) || {};
  const navigate = useNavigate(); // Initialize useNavigate

  // Re-enable isEdit state
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  // Removed local state for name debugging
  // const [localName, setLocalName] = useState(userData?.name || "");

  // Removed useEffect for localName debugging
  // useEffect(() => {
  //   setLocalName(userData?.name || "");
  // }, [userData?.name]);

  // Redirect to login if token is missing or unauthorized
  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your profile.");
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Load user data when page loads
  // Temporarily disable to debug edit functionality
  useEffect(() => {
    if (loadUserProfileData && token) { // Ensure token exists before loading profile
      loadUserProfileData();
    }
  }, [loadUserProfileData, token]); // Add token to dependencies

  // ✅ Handle API update
  const updateUserProfileData = async () => {
    try {
      // Use local state for formData construction
      const formData = new FormData();
      formData.append("name", editableUserData.name || "");
      formData.append("phone", editableUserData.phone || "");
      formData.append("address", JSON.stringify(editableUserData.address || {})); 
      formData.append("gender", editableUserData.gender || "");
      formData.append("dob", editableUserData.dob || "");
      if (image) formData.append("image", image);

      const { data } = await axios.post(
       backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Local state for editable user data
  const [editableUserData, setEditableUserData] = useState({});

  useEffect(() => {
    if (userData && !isEdit) {
      setEditableUserData({ ...userData });
    }
  }, [userData, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setEditableUserData((prev) => ({ ...prev, address: { line1: value, line2: "" } }));
    } else {
      setEditableUserData((prev) => ({ ...prev, [name]: value }));
    }
  };


  // ✅ Show loading or empty UI
  if (!userData) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile Image */}
        <div className="relative">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer">
              <div className="relative w-36 h-36 rounded-full overflow-hidden">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : userData.image || assets.profile_pic
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
                <img
                  src={assets.upload_icon}
                  alt="upload"
                  className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full p-1 shadow"
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              className="w-36 h-36 rounded-full object-cover"
              src={userData.image || assets.profile_pic}
              alt="profile"
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          {isEdit ? (
            <input
              type="text"
              name="name" // Add name attribute
              value={editableUserData.name || ""}
              onChange={handleInputChange}
              className="bg-gray-50 text-2xl font-medium max-w-60 mt-4 px-2 py-1 rounded border"
            />
          ) : (
            <p className="font-medium text-2xl text-neutral-800 mt-4">
              {userData.name}
            </p>
          )}

          <hr className="bg-zinc-400 h-[1px] border-none my-4" />

          {/* Contact Info */}
          <div>
            <p className="text-neutral-500 underline mt-3">
              CONTACT INFORMATION
            </p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Email id:</p>
              <p>{userData.email}</p>

              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input
                  type="text"
                  name="phone" // Add name attribute
                  value={editableUserData.phone || ""}
                  onChange={handleInputChange}
                  className="bg-gray-50 px-2 py-1 rounded border"
                />
              ) : (
                <p>{userData.phone || "N/A"}</p>
              )}

              <p className="font-medium">Address:</p>
              {isEdit ? (
                <textarea
                  name="address" // Add name attribute
                  value={editableUserData.address && (typeof editableUserData.address === 'object') ? `${editableUserData.address.line1}, ${editableUserData.address.line2}` : (typeof editableUserData.address === 'string' ? editableUserData.address : "")}
                  onChange={handleInputChange}
                  className="bg-gray-50 px-2 py-1 rounded border"
                  rows="2"
                />
              ) : (
                <p>{userData.address ? `${userData.address.line1}, ${userData.address.line2}` : "N/A"}</p>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-6">
            <p className="text-neutral-500 underline">BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select
                  name="gender" // Add name attribute
                  value={editableUserData.gender || ""}
                  onChange={handleInputChange}
                  className="bg-gray-50 px-2 py-1 rounded border"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{userData.gender || "N/A"}</p>
              )}

              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  type="date"
                  name="dob" // Add name attribute
                  value={editableUserData.dob && !isNaN(new Date(editableUserData.dob)) ? new Date(editableUserData.dob).toISOString().split('T')[0] : ""}
                  onChange={handleInputChange}
                  className="bg-gray-50 px-2 py-1 rounded border"
                />
              ) : (
                <p>{userData.dob && !isNaN(new Date(userData.dob)) ? new Date(userData.dob).toLocaleDateString() : "N/A"}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            {isEdit ? (
              <>
                <button
                  onClick={updateUserProfileData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full"
                >
                  Save Information
                </button>
                <button
                  onClick={() => setIsEdit(false)}
                  className="px-4 py-2 border border-gray-400 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-2 border border-gray-400 rounded-full"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
