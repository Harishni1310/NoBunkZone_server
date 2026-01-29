import Leave from "../Model/LeaveModel.js";
import Attendance from "../Model/AttendanceModel.js";
import User from "../Model/UserModel.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roll: user.roll || 'Not Assigned',
      className: user.className || 'Not Assigned'
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const myAttendance = async (req, res) => {
  try {
    // Get attendance records for this user
    const attendanceData = await Attendance.find({
      "records.studentId": req.user.id
    }).sort({ date: -1 });
    
    // Extract only this user's records
    const myAttendanceRecords = attendanceData.map(attendance => {
      const myRecord = attendance.records.find(record => 
        record.studentId.toString() === req.user.id
      );
      
      return {
        date: attendance.date,
        status: myRecord?.status || 'not-marked',
        _id: attendance._id
      };
    }).filter(record => record.status !== 'not-marked');
    
    // Calculate statistics
    const totalDays = myAttendanceRecords.length;
    const presentDays = myAttendanceRecords.filter(r => r.status === 'present').length;
    const absentDays = myAttendanceRecords.filter(r => r.status === 'absent').length;
    const lateDays = myAttendanceRecords.filter(r => r.status === 'late').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(2) : 0;
    
    res.json({
      student: {
        name: req.user.name,
        email: req.user.email
      },
      attendance: myAttendanceRecords,
      statistics: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: parseFloat(attendancePercentage)
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ msg: error.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { from, to, reason, type } = req.body;
    
    if (!from || !to || !reason || !type) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    
    await Leave.create({
      studentId: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      from,
      to,
      reason,
      type
    });
    
    res.json({ msg: "Leave application submitted successfully" });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(400).json({ msg: error.message });
  }
};

export const myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ msg: error.message });
  }
};
