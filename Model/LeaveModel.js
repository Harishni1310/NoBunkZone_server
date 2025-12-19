import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  from: String,
  to: String,
  reason: String,
  type: String,
  status: { type: String, default: "pending" },
  appliedOn: String
});

export default mongoose.model("Leave", LeaveSchema);
