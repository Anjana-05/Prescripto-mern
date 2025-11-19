import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios' // Import axios
import { toast } from 'react-toastify' // Import toast

const Appointments = () => {

  const {docId} = useParams()
  const navigate = useNavigate() // Initialize useNavigate
  const {doctors, currencySymbol, backendUrl, token} = useContext(AppContext) // Destructure backendUrl and token
  const daysOfWeek = ['SUN','MON','TUE','WED','THUR','FRI','SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const  fetchDocInfo = async () => {
      const docInfo = doctors.find(doc => doc._id === docId)
      setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])

    //getting current date
    let today = new Date()

  
    for(let i = 0; i < 7 ; i++){
      let timeSlots = []

      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the datte with index
      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if(today.getDate() === currentDate.getDate()){
        currentDate.setHours(currentDate.getHours() > 10  ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      while(currentDate < endTime){
        let formatedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        //add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formatedTime,
        })

        //Increment current time by 30 minutes
        currentDate.setTime(currentDate.getTime() + 30 * 60 * 1000)
      }

      setDocSlots(prev => [...prev, timeSlots])
    }
  }

  const handleBooking = async () => {
    if (!token) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!docInfo || !slotTime || !docSlots.length) {
      toast.error("Please select a slot before booking.");
      return;
    }

    const selectedDate = docSlots[slotIndex][0].datetime.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    try {
      const response = await axios.post(backendUrl + '/api/user/book-appointment', {
        doctorId: docInfo._id,
        date: selectedDate,
        time: slotTime,
        consultationFee: docInfo.fees,
        userId: '' // This will be replaced by the backend middleware with the actual userId from the token
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        navigate('/my-appointments');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchDocInfo()
  },[doctors,docId])


  useEffect(() => {
    getAvailableSlots()
  },[docInfo])

  useEffect(() => {
  },[docSlots])


  return docInfo && (
    <div>
      {/*------------ Doctor Details  --------------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' ></img>
        </div>

        {/*------------ Doc Info: name, degree, experience  --------------*/} 
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-700'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt=''/>
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            <a href={`tel:${docInfo.phoneNumber}`} className='text-xs text-primary underline cursor-pointer'>{docInfo.phoneNumber}</a>
          </div>

          {/*------------ Doctor About --------------*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'> 
              About <img src={assets.info_icon} /> </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 mt-4 font-medium'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>


    {/*-------------  Booking slots  -----------*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots.map((item,index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={handleBooking} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-16'>Book an Appointment</button>
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointments
