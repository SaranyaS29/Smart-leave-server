import Department from "../models/Department.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to fetch departments. Please try again later.",
      });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();

    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to add department. Please try again later.",
      });
  }
};
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to fetch departments. Please try again later.",
      });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updateDep = await Department.findByIdAndUpdate(id, {
      dep_name,
      description,
    });
    return res.status(200).json({ success: true, updateDep });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to update departments. Please try again later.",
      });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDep = await Department.findByIdAndDelete(id);
    return res.status(200).json({ success: true, deleteDep });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to delete  departments. Please try again later.",
      });
  }
};

export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
