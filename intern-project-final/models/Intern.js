// models/Intern.js
import mongoose from 'mongoose';

const InternSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  initials: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2
  },
  techStack: {
    type: [String],
    required: true
  },
  funFacts: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Intern = mongoose.model('Intern', InternSchema);

export default Intern;