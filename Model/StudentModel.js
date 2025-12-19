import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    default: 'Student'
  },
  roll: String,
  className: String,
  email: String
});

export default mongoose.model("Student", StudentSchema);
