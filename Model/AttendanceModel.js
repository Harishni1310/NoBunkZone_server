import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    index: true
  },
  records: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      studentName: String,
      status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        required: true
      },
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      markedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Index for faster queries
AttendanceSchema.index({ date: 1, 'records.studentId': 1 });

export default mongoose.model("Attendance", AttendanceSchema);
