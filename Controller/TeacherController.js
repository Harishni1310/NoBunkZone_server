import Student from "../Model/StudentModel.js";
import Attendance from "../Model/AttendanceModel.js";
import Leave from "../Model/LeaveModel.js";
import Todo from "../Model/TodoModel.js";

export const addStudent = async (req, res) => {
  try {
    await Student.create(req.body);
    res.json({ msg: "Student added" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    await Attendance.create(req.body);
    res.json({ msg: "Attendance saved" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    await Leave.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Leave updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Student updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: "Student deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ teacherId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addTodo = async (req, res) => {
  try {
    const todo = await Todo.create({ ...req.body, teacherId: req.user.id });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    await Todo.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Todo updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Todo deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
