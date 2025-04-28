import React, { useState, useEffect } from 'react';
import { addIntern } from '../services/api';
import './AddIntern.css';

const AddIntern = ({ onInternAdded, allInterns = [] }) => {
  const initialFormState = {
    name: '',
    role: '',
    school: '',
    degree: '',
    initials: '',
    techStack: '',
    selectedTechStack: '',
    funFacts: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableTechStacks, setAvailableTechStacks] = useState([]);

  // Extract unique tech stacks from existing interns
  useEffect(() => {
    const techStacks = new Set();
    
    allInterns.forEach(intern => {
      if (intern.techStack && Array.isArray(intern.techStack)) {
        intern.techStack.forEach(tech => {
          techStacks.add(tech.trim());
        });
      }
    });
    
    setAvailableTechStacks([...techStacks].sort());
  }, [allInterns]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.school.trim()) newErrors.school = 'School is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    
    // Generate initials if empty
    if (!formData.initials.trim() && formData.name.trim()) {
      // Auto-generate initials from name
      const nameParts = formData.name.trim().split(' ');
      if (nameParts.length >= 2) {
        const generatedInitials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        setFormData(prev => ({ ...prev, initials: generatedInitials }));
      }
    } else if (!formData.initials.trim()) {
      newErrors.initials = 'Initials are required';
    }
    
    // Validate tech stack
    if (!formData.techStack.trim() && !formData.selectedTechStack) {
      newErrors.techStack = 'At least one tech skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTechStackSelect = (e) => {
    const selectedTech = e.target.value;
    
    if (selectedTech && selectedTech !== "Select a tech stack") {
      setFormData(prev => {
        // Add the selected tech to the techStack string if it's not already included
        const currentTechs = prev.techStack ? prev.techStack.split(',').map(t => t.trim()) : [];
        
        if (!currentTechs.includes(selectedTech)) {
          const updatedTechStack = prev.techStack ? 
            `${prev.techStack.trim()}, ${selectedTech}` : 
            selectedTech;
            
          return {
            ...prev,
            techStack: updatedTechStack,
            selectedTechStack: ''
          };
        }
        
        return {
          ...prev,
          selectedTechStack: ''
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        selectedTechStack: selectedTech
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Format arrays from comma-separated strings
        const formattedData = {
          ...formData,
          techStack: formData.techStack.split(',').map(item => item.trim()),
          funFacts: formData.funFacts ? formData.funFacts.split(',').map(item => item.trim()) : []
        };
        
        // Call API service to add intern
        const newIntern = await addIntern(formattedData);
        
        // Call the callback to update parent component
        if (onInternAdded) {
          onInternAdded(newIntern);
        }
        
        // Reset form
        setFormData(initialFormState);
        setSubmitSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error adding intern:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to add intern. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="add-intern-container">
      <div className="form-header">
        <h2>Add New Intern</h2>
        <p>Fill out the form below to add a new intern to the directory</p>
      </div>
      
      {submitSuccess && (
        <div className="success-message">
          Intern successfully added to the directory!
        </div>
      )}
      
      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="intern-form">
        <div className="form-group">
          <label htmlFor="name">Full Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role*</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? 'input-error' : ''}
          />
          {errors.role && <span className="error">{errors.role}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="school">School*</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className={errors.school ? 'input-error' : ''}
            />
            {errors.school && <span className="error">{errors.school}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="degree">Degree*</label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className={errors.degree ? 'input-error' : ''}
            />
            {errors.degree && <span className="error">{errors.degree}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="initials">Initials* (Auto-generated if left blank)</label>
          <input
            type="text"
            id="initials"
            name="initials"
            value={formData.initials}
            onChange={handleChange}
            maxLength="2"
            className={errors.initials ? 'input-error' : ''}
          />
          {errors.initials && <span className="error">{errors.initials}</span>}
        </div>
        
        <div className="form-row tech-stack-inputs">
          <div className="form-group">
            <label htmlFor="techStack">Tech Stack* (comma-separated)</label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, JavaScript, CSS"
              className={errors.techStack ? 'input-error' : ''}
            />
            {errors.techStack && <span className="error">{errors.techStack}</span>}
          </div>
          
          <div className="form-group" >
            <label htmlFor="selectedTechStack">Add from existing</label>
            <select
              id="selectedTechStack"
              name="selectedTechStack"
              value={formData.selectedTechStack}
              onChange={handleTechStackSelect}
              className="tech-select"
              style={{color: 'black'}}
            >
              <option value="">Select a tech stack</option>
              {availableTechStacks.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="funFacts">Fun Facts (comma-separated)</label>
          <input
            type="text"
            id="funFacts"
            name="funFacts"
            value={formData.funFacts}
            onChange={handleChange}
            placeholder="Coffee lover, Gaming enthusiast"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Intern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIntern;