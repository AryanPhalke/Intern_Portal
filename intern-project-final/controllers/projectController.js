// controllers/projectController.js
import Project from '../models/Project.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error(`Error fetching project with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: 'Failed to create project', details: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project with ID ${req.params.id}:`, error);
    res.status(400).json({ error: 'Failed to update project', details: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(`Error deleting project with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};