import express from 'express'
import { addDoctor,adminLogin, allDoctors, getStats, getAllAppointments } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express. Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'), addDoctor)
adminRouter.post('/login',adminLogin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/stats',authAdmin,getStats) // New route for getting dashboard stats
adminRouter.get('/appointments',authAdmin,getAllAppointments) // New route for getting all appointments

export default adminRouter

