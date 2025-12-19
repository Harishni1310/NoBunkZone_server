import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  date: String,
  records: [
    {
      studentId: mongoose.Schema.Types.ObjectId,
      status: String
    }
  ]
});

export default mongoose.model("Attendance", AttendanceSchema);
