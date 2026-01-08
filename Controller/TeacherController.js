import Student from "../Model/StudentModel.js";
import Attendance from "../Model/AttendanceModel.js";
import Leave from "../Model/LeaveModel.js";
import Todo from "../Model/TodoModel.js";

export const addStudent = async (req, res) => {
  try {
    const { name, roll, className, email } = req.body;
    
    if (!name || !roll) {
      return res.status(400).json({ msg: "Name and roll number are required" });
    }
    
    // Check if student with same roll already exists
    const existingStudent = await Student.findOne({ roll });
    if (existingStudent) {
      return res.status(400).json({ msg: "Student with this roll number already exists" });
    }
    
    const student = await Student.create(req.body);
    res.json({ msg: "Student added successfully", student });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(400).json({ msg: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ msg: "Date and records array are required" });
    }
    
    // Validate records format
    for (const record of records) {
      if (!record.studentId || !record.status) {
        return res.status(400).json({ msg: "Each record must have studentId and status" });
      }
    }
    
    // Add teacher info to records
    const enrichedRecords = records.map(record => ({
      ...record,
      markedBy: req.user.id,
      markedAt: new Date()
    }));
    
    // Check if attendance for this date already exists
    const existingAttendance = await Attendance.findOne({ date });
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.records = enrichedRecords;
      await existingAttendance.save();
      res.json({ 
        msg: "Attendance updated successfully", 
        attendance: existingAttendance,
        updatedAt: new Date()
      });
    } else {
      // Create new attendance record
      const newAttendance = await Attendance.create({ date, records: enrichedRecords });
      res.json({ 
        msg: "Attendance saved successfully", 
        attendance: newAttendance,
        createdAt: new Date()
      });
    }
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(400).json({ msg: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('studentId', 'name roll className');
    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ msg: "Valid status (approved/rejected/pending) is required" });
    }
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!leave) {
      return res.status(404).json({ msg: "Leave application not found" });
    }
    
    res.json({ msg: "Leave status updated successfully", leave });
  } catch (error) {
    console.error('Update leave error:', error);
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
