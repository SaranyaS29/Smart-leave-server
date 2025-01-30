import mongoose from "mongoose";
import Leave from "../models/Leave.js";
import Student from "../models/Student.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    console.log("Leave Type:", leaveType);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid userId format" });
    }

    if (!leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const validLeaveTypes = ["Sick Leave", "Casual Leave", "Annual Leave"];
    if (!validLeaveTypes.includes(leaveType.trim())) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid leaveType" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid date format" });
    }

    const student = await Student.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    const newLeave = new Leave({
      studentId: student._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
    });

    await newLeave.save();

    return res
      .status(200)
      .json({ success: true, message: "Leave request saved successfully" });
  } catch (error) {
    console.error("Error while adding leave:", error.message, error.stack);
    return res
      .status(500)
      .json({ success: false, error: "leave add server error" });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is in correct ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid userId format" });
    }

    // Find the student using the userId (id from params)
    const student = await Student.findOne({
      userId: new mongoose.Types.ObjectId(id),
    });

    // If student is not found, return an error
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    // Fetch the leaves for the student
    const leaves = await Leave.find({ studentId: student._id });

    // Return the leaves
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error while fetching leaves:", error.message, error.stack);
    return res
      .status(500)
      .json({ success: false, error: "leave fetch server error" });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "studentId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error while fetching leaves:", error.message, error.stack);
    return res
      .status(500)
      .json({ success: false, error: "leave fetch server error" });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "studentId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name,profileImage",
        },
      ],
    });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error while fetching leaves:", error.message, error.stack);
    return res
      .status(500)
      .json({ success: false, error: "leave fetch server error" });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status: req.body.status }
    );
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, error: "leave not founded" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, error: "leave update server error" });
  }
};

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };
