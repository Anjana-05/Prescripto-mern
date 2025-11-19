import React from "react";
import { assets } from '../assets/assets_frontend/assets'

const Contact = () => {
  return (
    <div className="px-6 md:px-20 lg:px-40 my-16">
      {/* Heading */}
      <div className="text-center text-2xl font-light text-gray-500 pt-10">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Content Section */}
      <div className="my-10 flex flex-col md:flex-row justify-center items-center gap-16">
        {/* Left Side - Image */}
        <img
          src={assets.contact_image}
          alt="doctor with patient"
          className="w-full md:w-[400px] rounded-lg shadow-md"
        />

        {/* Right Side - Info */}
        <div className="text-gray-600 max-w-md">
          {/* Office Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">OUR OFFICE</h3>
          <p className="mb-4">
            00000 Willms Station <br />
            Suite 000, Washington, USA
          </p>
          <p className="mb-8">
            Tel: (000) 000-0000 <br />
            Email: xxx@gmail.com
          </p>

          {/* Careers Section */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            CAREERS AT PRESCRIPTO
          </h3>
          <p className="mb-6">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-gray-800 px-6 py-2 rounded-md hover:bg-gray-800 hover:text-white transition">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
