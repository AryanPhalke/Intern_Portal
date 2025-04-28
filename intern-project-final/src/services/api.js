// Simulated API service
import { MOCK_PROJECTS } from '../mockProjects.js';

// Simulated delay to mimic network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage key
const INTERNS_STORAGE_KEY = 'mock_interns_data';
const PROJECT_ASSIGNMENTS_KEY = 'project_assignments_data';

// Initialize mock data in browser storage if not present
const initializeMockData = async () => {
  if (!localStorage.getItem(INTERNS_STORAGE_KEY)) {
    try {
      const mockData = await import('../mockData.json');
      localStorage.setItem(INTERNS_STORAGE_KEY, JSON.stringify(mockData.default));
    } catch (error) {
      console.error('Error initializing mock data:', error);
      throw error;
    }
  }
};

// Function to fetch all interns
export const fetchInterns = async () => {
  try {
    // Simulate network delay
    await delay(800);
    
    // Initialize mock data if needed
    await initializeMockData();
    
    // Get data from storage
    const internsData = localStorage.getItem(INTERNS_STORAGE_KEY);
    return JSON.parse(internsData);
  } catch (error) {
    console.error('Error fetching interns:', error);
    throw error;
  }
};



// Function to fetch projects
export const getProjects = async () => {
  try {
    await delay(800);
    return MOCK_PROJECTS;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Function to add a new intern
export const addIntern = async (internData) => {
  try {
    // Simulate network delay for POST request
    await delay(1000);
    
    // Initialize mock data if needed
    await initializeMockData();
    
    // Get current interns
    const internsData = localStorage.getItem(INTERNS_STORAGE_KEY);
    const interns = JSON.parse(internsData);
    
    // Add to interns array
    const updatedInterns = [...interns, newIntern];
    
    // Update storage
    localStorage.setItem(INTERNS_STORAGE_KEY, JSON.stringify(updatedInterns));
    
    // Optional: Simulate updating mockData.json by logging
    console.log('Mock update: Saving new intern to mockData.json', newIntern);
    
    return newIntern;
  } catch (error) {
    console.error('Error adding intern:', error);
    throw error;
  }
};

// Function to save project assignments
export const saveProjectAssignments = async (assignments) => {
  try {
    // Simulate network delay
    await delay(500);
    
    // Save to storage
    localStorage.setItem(PROJECT_ASSIGNMENTS_KEY, JSON.stringify(assignments));
    
    return { success: true };
  } catch (error) {
    console.error('Error saving project assignments:', error);
    throw error;
  }
};

// Function to get project assignments
export const getProjectAssignments = async () => {
  try {
    await delay(300);
    
    const storedAssignments = localStorage.getItem(PROJECT_ASSIGNMENTS_KEY);
    if (storedAssignments) {
      return JSON.parse(storedAssignments);
    }
    
    // Return empty object if no assignments yet
    return {};
  } catch (error) {
    console.error('Error fetching project assignments:', error);
    throw error;
  }
};

// Initialize mock data when the module is imported
initializeMockData().catch(error => console.error('Failed to initialize mock data:', error));