import multer from "multer";
import Employee from "../models/Employee.js"
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import path from "path"
//import { error } from "console";
import Department from '../models/Department.js'
import mongoose from "mongoose";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/tmp")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const addEmployee = async (req, res) => {
    try{
    const{
        name,
        email,
        employeeId,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        salary,
        password,
        role,
    } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file); 

    const user = await User.findOne({email})
    if(user) {
        //console.log(error.message)
        return res.status(400).json({success: false, error: "user always registered in emp"});
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        name,
        email,
        password: hashPassword,
        role,
        profileImage: req.file ? req.file.filename : ""
    })

    const savedUser = await newUser.save()

    const newEmployee = new Employee({
        userId: savedUser._id,
        employeeId,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        salary
    })

    await newEmployee.save()
    return res.status(200).json({success: true, message: "employee created"})
    } catch(error) {
       // console.log(error.message)
         return res.status(500).json({success: false, message: "server error in adding employee"})
    }
}

const getEmployees = async(req, res) => {
    try{
        const employees = await Employee.find().populate('userId', {password: 0}).populate("department")
        return res.status(200).json({success: true, employees})
    } catch(error){
        return res.status(500).json({success: false, error: "get employees server  error"})
    }
}

const getEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    let employee;
      console.log("Incoming ID from frontend:", id);

    // First: find by Employee _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id)
        .populate("userId", { password: 0 })
        .populate("department");
    }

    // If not found, try to find by userId
    if (!employee && mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findOne({ userId: new mongoose.Types.ObjectId(id) })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get employee error:", error.message);
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};


const updateEmployee = async(req, res) => {
    try{
        const {id} = req.params;
        const{
        name,
        maritalStatus,
        designation,
        department,
        salary,
    } = req.body;

    const employee = await Employee.findById({_id: id})
    if(!employee) {
        return res.status(404).json({success: false, error: "employees not found" })
    }
    const user = await User.findById({_id: employee.userId})

    if(!user) {
        return res.status(404).json({success: false, error: "user not found" })
    }

    const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
    const updateEmployee = await Employee.findByIdAndUpdate({_id: id},
        {
            maritalStatus, 
            designation,
            salary, department
        })

        if(!updateEmployee || !updateUser) {
             return res.status(404).json({success: false, error: "document not found" })
        }

        return res.status(200).json({success: true, message: "employee updated" }) 

    } catch(error){
        return res.status(500).json({success: false, error: "update employees server error"})
    }
}

const fetchEmployeeByDepId = async (req, res) => {
    const {id} = req.params;
    try{
        const employees = await Employee.find({department: id})
        return res.status(200).json({success: true, employees});
    } catch(error){
        return res.status(500).json({success: false, error: "get employeesByDepId server error"});
    }

}

export {addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeeByDepId}