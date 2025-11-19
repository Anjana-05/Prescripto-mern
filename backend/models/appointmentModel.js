import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorSpeciality: {
        type: String,
        required: true
    },
    doctorImage: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled', 'completed'],
        default: 'pending'
    },
    consultationFee: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel
