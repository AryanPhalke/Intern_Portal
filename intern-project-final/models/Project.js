// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Completed'],
    default: 'Pending'
  },
  requiredTech: {
    type: [String],
    required: true
  },
  requiredRoles: {
    type: [String],
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  }
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;