import mongoose from "../dbConfig.js";
const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
    },
    department: {
        type: String,
        enum: ["IT", "HR", "Sales", "Finance", "Marketing"],
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    joiningDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true

    }
}, {
    collection: 'employee',
    versionKey: false
})

employeeSchema.index({ email: 1 })
employeeSchema.index({ role: 1 })


const userModel = mongoose.model('employee', employeeSchema)

export default userModel