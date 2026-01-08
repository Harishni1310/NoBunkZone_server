import Leave from "../Model/LeaveModel.js";
import Attendance from "../Model/AttendanceModel.js";
import Student from "../Model/StudentModel.js";

export const getProfile = async (req, res) => {
  try {
    console.log('Looking for student with user:', req.user);
    
    let student = await Student.findOne({ 
      $or: [
        { userId: req.user.id },
        { email: req.user.email }
      ]
    });
    
    // If not found by userId/email, try to find by name match
    if (!student && req.user.name) {
      student = await Student.findOne({ name: req.user.name });
    }
    
    console.log('Found student:', student);
    
    // If still no student found, try to find by name and update with user info
    if (!student) {
      // First try to find an existing student with the same name and update it
      student = await Student.findOneAndUpdate(
        { name: req.user.name },
        { 
          userId: req.user.id,
          email: req.user.email || student?.email
        },
        { new: true }
      );
      
      // If still no match, create a new profile
      if (!student) {
        student = await Student.create({
          userId: req.user.id,
          name: req.user.name || 'Student',
          email: req.user.email,
          roll: 'AUTO-' + Date.now(),
          className: 'Not Assigned'
        });
        console.log('Created new student profile:', student);
      } else {
        console.log('Updated existing student profile:', student);
      }
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const myAttendance = async (req, res) => {
  try {
    // Find student record by userId or email
    let student = await Student.findOne({ 
      $or: [
        { userId: req.user.id },
        { email: req.user.email }
      ]
    });
    
    // If not found by userId/email, try to find by name match
    if (!student && req.user.name) {
      student = await Student.findOne({ name: req.user.name });
    }
    
    console.log('Attendance - Found student:', student);
    
    // If still no student found, create a basic profile
    if (!student) {
      student = await Student.create({
        userId: req.user.id,
        name: req.user.name || 'Student',
        email: req.user.email,
        roll: 'AUTO-' + Date.now(),
        className: 'Not Assigned'
      });
      console.log('Created new student profile for attendance:', student);
    }
    
    // Get attendance records for this student
    const attendanceData = await Attendance.find({
      "records.studentId": student._id
    }).sort({ date: -1 }); // Sort by date descending (latest first)
    
    // Extract only this student's records from each attendance document
    const myAttendanceRecords = attendanceData.map(attendance => {
      const myRecord = attendance.records.find(record => 
        record.studentId.toString() === student._id.toString()
      );
      
      return {
        date: attendance.date,
        status: myRecord?.status || 'not-marked',
        markedAt: myRecord?.markedAt,
        _id: attendance._id
      };
    }).filter(record => record.status !== 'not-marked');
    
    // Calculate attendance statistics
    const totalDays = myAttendanceRecords.length;
    const presentDays = myAttendanceRecords.filter(r => r.status === 'present').length;
    const absentDays = myAttendanceRecords.filter(r => r.status === 'absent').length;
    const lateDays = myAttendanceRecords.filter(r => r.status === 'late').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(2) : 0;
    
    console.log('Attendance data for student:', {
      totalRecords: myAttendanceRecords.length,
      attendancePercentage
    });
    
    res.json({
      student: {
        name: student.name,
        roll: student.roll,
        className: student.className
      },
      attendance: myAttendanceRecords,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: parseFloat(attendancePercentage)
      },
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ msg: error.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    // Find student record by userId or email
    let student = await Student.findOne({ 
      $or: [
        { userId: req.user.id },
        { email: req.user.email }
      ]
    });
    
    // If not found by userId/email, try to find by name match
    if (!student && req.user.name) {
      student = await Student.findOne({ name: req.user.name });
    }
    
    // If still no student found, create a basic profile
    if (!student) {
      student = await Student.create({
        userId: req.user.id,
        name: req.user.name || 'Student',
        email: req.user.email,
        roll: 'AUTO-' + Date.now(),
        className: 'Not Assigned'
      });
      console.log('Created new student profile for leave application:', student);
    }
    
    await Leave.create({
      ...req.body,
      studentId: student._id,
      appliedOn: new Date().toISOString().slice(0,10)
    });
    res.json({ msg: "Leave applied" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const myLeaves = async (req, res) => {
  try {
    // Find student record by userId or email
    let student = await Student.findOne({ 
      $or: [
        { userId: req.user.id },
        { email: req.user.email }
      ]
    });
    
    // If not found by userId/email, try to find by name match
    if (!student && req.user.name) {
      student = await Student.findOne({ name: req.user.name });
    }
    
    // If still no student found, create a basic profile
    if (!student) {
      student = await Student.create({
        userId: req.user.id,
        name: req.user.name || 'Student',
        email: req.user.email,
        roll: 'AUTO-' + Date.now(),
        className: 'Not Assigned'
      });
      console.log('Created new student profile for leaves:', student);
    }
    
    const leaves = await Leave.find({ studentId: student._id });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
