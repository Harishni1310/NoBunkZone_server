import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Student'
  },
  roll: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  className: {
    type: String,
    trim: true,
    default: 'Not Assigned'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }
}, {
  timestamps: true
});

// Create compound index for better query performance
StudentSchema.index({ userId: 1, email: 1 });
StudentSchema.index({ name: 1 });

export default mongoose.model("Student", StudentSchema);
