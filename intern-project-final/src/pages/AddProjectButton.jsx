import React, { useState } from 'react';
import ProjectForm from './ProjectForm';
import { addProject } from '../services/api'; // Import the API function

const AddProjectButton = ({ onProjectAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormSubmit = async (projectData) => {
    try {
      setIsSubmitting(true);
      
      // Generate a temporary ID for client-side use before saving to server
      // This ensures it has an ID immediately for drag and drop functionality
      const tempProject = {
        ...projectData,
        id: `temp-${Date.now()}`, // Use a prefixed timestamp as temporary ID to make string handling consistent
        createdAt: new Date().toISOString()
      };
      
      // Use the API service function
      const newProject = await addProject(tempProject);
      
      // Call the callback with the new project data - ensure ID is a string for consistency
      onProjectAdded({
        ...newProject,
        id: newProject.id || tempProject.id // Use the server-provided ID if available, otherwise fall back to temp ID
      });
      
      setIsSubmitting(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-project-container">
      {!showForm ? (
        <button 
          className="add-project-button" 
          onClick={() => setShowForm(true)}
        >
          + Add New Project
        </button>
      ) : (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProjectForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectButton;