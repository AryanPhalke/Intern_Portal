// services/api.js
const API_BASE_URL = '/api';

// Utility function to handle API response and errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `API error: ${response.status}`);
  }
  return response.json();
};

// Fetch all interns
export const fetchInterns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/interns`);
    const data = await handleResponse(response);
    
    // Normalize data structure - ensure each intern has an id property
    return data.map(intern => ({
      ...intern,
      id: intern._id || intern.id // MongoDB uses _id, but our app uses id
    }));
  } catch (error) {
    console.error('Error fetching interns:', error);
    throw error;
  }
};

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const data = await handleResponse(response);
    
    // Normalize data structure
    return data.map(project => ({
      ...project,
      id: project._id || project.id
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Add a new intern
export const addIntern = async (internData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(internData)
    });
    
    const data = await handleResponse(response);
    return {
      ...data,
      id: data._id || data.id
    };
  } catch (error) {
    console.error('Error adding intern:', error);
    throw error;
  }
};

// Add a new project
export const addProject = async (projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    
    const data = await handleResponse(response);
    return {
      ...data,
      id: data._id || data.id
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Get assignments for a project
export const getProjectAssignments = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments/project/${projectId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching assignments for project ${projectId}:`, error);
    throw error;
  }
};

// Save project assignments
export const saveProjectAssignments = async (projectId, internIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, internIds })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error saving project assignments:', error);
    throw error;
  }
};

// Remove intern assignment
export const removeInternAssignment = async (projectId, internId) => {
  // First, get current assignments
  const currentAssignment = await getProjectAssignments(projectId);
  
  // Remove the intern from the list
  const updatedInternIds = currentAssignment.internIds.filter(id => id !== internId);
  
  // Save updated assignments
  return saveProjectAssignments(projectId, updatedInternIds);
};