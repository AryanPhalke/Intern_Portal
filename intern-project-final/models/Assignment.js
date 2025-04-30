// models/Assignment.js
import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  internIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Intern',
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);

export default Assignment;