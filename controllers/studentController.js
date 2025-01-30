import Student from "../models/Student.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import Department from "../models/Department.js";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      studentId,
      dob,
      gender,
      degree,
      department,
      password,
      role,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "user already registered in student" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    const newStudent = new Student({
      userId: savedUser._id,
      name,
      email,
      studentId,
      dob,
      gender,
      degree,
      department,
      password: hashPassword,
      role,
    });

    await newStudent.save();
    return res.status(200).json({ success: true, message: "student created" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "server error in adding student " });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, students });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch students. Please try again later.",
    });
  }
};

const getStudent = async (req, res) => {
  const { id } = req.params;
  try {
    let student;
    student = await Student.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");
    if (!student) {
      student = await Student.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    return res.status(200).json({ success: true, student });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch students. Please try again later.",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, degree, department } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "student not found. Please try again later.",
      });
    }
    const user = await User.findById({ _id: student.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user not found. Please try again later.",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: student.userId },
      { name }
    );
    const updateStudent = await Student.findByIdAndUpdate(
      { _id: id },
      {
        degree,
        department,
      }
    );
    if (!updateStudent || !updateUser) {
      return res.status(500).json({
        success: false,
        error: "document not found. Please try again later.",
      });
    }
    return res.status(200).json({ success: true, message: "student updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to update students. Please try again later.",
    });
  }
};
export { addStudent, upload, getStudents, getStudent, updateStudent };
