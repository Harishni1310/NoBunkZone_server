import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    default: "pending",
    enum: ['pending', 'approved', 'rejected']
  },
  appliedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model("Leave", LeaveSchema);
