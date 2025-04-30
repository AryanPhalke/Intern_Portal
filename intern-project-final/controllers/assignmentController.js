// controllers/assignmentController.js
import Assignment from '../models/Assignment.js';

// Get all project assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('projectId')
      .populate('internIds');
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

// Get assignments for a specific project
export const getAssignmentByProject = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ projectId: req.params.projectId })
      .populate('internIds');
    
    if (!assignment) {
      return res.json({ projectId: req.params.projectId, internIds: [] });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error(`Error fetching assignment for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
};

// Create or update assignment
export const saveAssignment = async (req, res) => {
  try {
    const { projectId, internIds } = req.body;
    
    // Find and update, or create if doesn't exist
    const assignment = await Assignment.findOneAndUpdate(
      { projectId },
      { projectId, internIds, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json(assignment);
  } catch (error) {
    console.error('Error saving assignment:', error);
    res.status(400).json({ error: 'Failed to save assignment', details: error.message });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ projectId: req.params.projectId });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(`Error deleting assignment for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};