import employeeModel from "../model/employeeModel.js";
import { hashPassword, decodePassword, createToken } from "../middleware/common.js";


const createEmployee = async (req, res) => {
    try {
        const { employeeName, email, password, role, department, designation, status, joiningDate } = req.body;

        if (!employeeName || !email || !password || !department || !designation || !joiningDate) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValidation.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingEmployee = await employeeModel.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({
                message: "Employee already exists"
            });
        }

        const hashedPassword = await hashPassword(password);


        const employee = await employeeModel.create({
            employeeName,
            email,
            password: hashedPassword,
            role,
            department,
            designation,
            status,
            joiningDate
        });

        const payload = {
            _id: employee._id,
            name: employee.employeeName,
            email: employee.email,
            role: employee.role
        };

        const token = await createToken(payload);

        res.status(201).json({
            message: "Employee created successfully",
            employee,
            token,
            role
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const loginEmployee = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        const employee = await employeeModel.findOne({ email }).select("+password");

        if (!employee) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await decodePassword(
            password,
            employee.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const payload = {
            _id: employee._id,
            name: employee.employeeName,
            email: employee.email,
            role: employee.role
        };

        const token = await createToken(payload);

        const employeeData = {
            _id: employee._id,
            employeeName: employee.employeeName,
            email: employee.email,
            role: employee.role,
            department: employee.department,
            designation: employee.designation,
            status: employee.status,
            joiningDate: employee.joiningDate
        };

        res.status(200).json({
            message: "Login Successful",
            employee: employeeData,
            token,
            role: employee.role
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllEmployess = async (req, res) => {
    try {
        const role = req.user.role;
        const { searchkeyword, department, status, page = 1, limit = 10 } = req.query;
        const query = {
            role: "employee",
        };

        if (status) {
            query.status = status;
            query.isActive = status === "Active";
        }

        if (searchkeyword) {
            query.$or = [
                {
                    employeeName: {
                        $regex: searchkeyword, 
                        $options: "i"
                    }
                },
                {
                    email: { 
                        $regex: searchkeyword, 
                        $options: "i" 
                    }
                 }
            ];
        }

        if (department) {
            query.department = department;
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const totalCount = await employeeModel.countDocuments(query);

        const employee = await employeeModel
            .find(query)
            .select("-password")
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            employee,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {

        const { id } = req.params;

        const targetUser = await employeeModel.findById(id);

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isCurrentlyActive = targetUser.isActive;

        const updatedUser = await employeeModel.findByIdAndUpdate(
            id,
            {
                isActive: !isCurrentlyActive,
                status: isCurrentlyActive ? "Inactive" : "Active"
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: isCurrentlyActive
                ? "Employee deactivated successfully"
                : "Employee activated successfully",
            employee: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }
};


const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeName, department, designation, status, role } = req.body;

        const employee = await employeeModel.findById(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const updatedEmployee = await employeeModel.findByIdAndUpdate(
            id,
            {
                employeeName,
                department,
                designation,
                status,
                isActive: status === "Active",
                ...(role && { role }),
                updatedAt: Date.now()
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Employee updated successfully",
            employee: updatedEmployee
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const adminDashboard = async (req, res) => {
    try {

        const totalEmployees = await employeeModel.countDocuments({
            role: "employee"
        });

        const activeEmployees = await employeeModel.countDocuments({
            role: "employee",
            status: "Active",
            isActive: true
        });

        const inactiveEmployees = await employeeModel.countDocuments({
            role: "employee",
            status: "Inactive"
        });

        const departmentWiseCount = await employeeModel.aggregate([
            {
                $match: {
                    role: "employee",
                    isActive: true
                }
            },
            {
                $group: {
                    _id: "$department",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    department: "$_id",
                    count: 1
                }
            }
        ]);

        const monthlyJoinedEmployees = await employeeModel.aggregate([
            {
                $match: {
                    role: "employee",
                    isActive: true
                }
            },
            {
                $group: {
                    _id: {
                        $month: "$joiningDate"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            departmentWiseCount,
            monthlyJoinedEmployees
        });

    } catch (error) {

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });

    }
};

export default {
    createEmployee,
    loginEmployee,
    getAllEmployess,
    deleteEmployee,
    updateEmployee,
    adminDashboard
}