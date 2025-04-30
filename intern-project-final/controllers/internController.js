// controllers/internController.js
import Intern from '../models/Intern.js';

// Get all interns
export const getAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (error) {
    console.error('Error fetching interns:', error);
    res.status(500).json({ error: 'Failed to fetch interns' });
  }
};

// Get intern by ID
export const getInternById = async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    
    res.json(intern);
  } catch (error) {
    console.error(`Error fetching intern with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch intern' });
  }
};

// Create new intern
export const createIntern = async (req, res) => {
  try {
    const intern = new Intern(req.body);
    const savedIntern = await intern.save();
    res.status(201).json(savedIntern);
  } catch (error) {
    console.error('Error creating intern:', error);
    res.status(400).json({ error: 'Failed to create intern', details: error.message });
  }
};

// Update intern
export const updateIntern = async (req, res) => {
  try {
    const updatedIntern = await Intern.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedIntern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    
    res.json(updatedIntern);
  } catch (error) {
    console.error(`Error updating intern with ID ${req.params.id}:`, error);
    res.status(400).json({ error: 'Failed to update intern', details: error.message });
  }
};

// Delete intern
export const deleteIntern = async (req, res) => {
  try {
    const intern = await Intern.findByIdAndDelete(req.params.id);
    
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    
    res.json({ message: 'Intern deleted successfully' });
  } catch (error) {
    console.error(`Error deleting intern with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete intern' });
  }
};