import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js' // Import userModel
import appointmentModel from '../models/appointmentModel.js' // Import appointmentModel

//API for adding doctor
const addDoctor = async(req,res) => {
    try{
        const { name, email, password, speciality, degree, experience, about, fees, address, phoneNumber } = req.body
        const imageFile = req.file

        //checking for all data to add doctor
        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !phoneNumber){
            return res.json({success: false, message: "Missing Details"})
        }
        
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }

        //validating strong password
        if(password.length < 8){
            return res.json({success: false, message: "Please enter strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            phoneNumber,
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for admin login
const adminLogin = async (req,res) => {
    try{
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const allDoctors = async(req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for getting dashboard stats
const getStats = async (req, res) => {
    try {
        const totalDoctors = await doctorModel.countDocuments({});
        const totalAppointments = await appointmentModel.countDocuments({});
        const totalUsers = await userModel.countDocuments({});

        res.json({ success: true, stats: { totalDoctors, totalAppointments, totalUsers } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for getting all appointments (admin side)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
            .populate('userId', 'name email') // Populate user details
            .populate('doctorId', 'name speciality'); // Populate doctor details

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {addDoctor,adminLogin,allDoctors, getStats, getAllAppointments}