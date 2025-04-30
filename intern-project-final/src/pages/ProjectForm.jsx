import React, { useState } from 'react';

const ProjectForm = ({ onSubmit, onCancel }) => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    status: 'Pending',
    requiredTech: [],
    requiredRoles: [],
    deadline: '',
    capacity: 1
  });
  
  const [techInput, setTechInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCapacityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setProject(prev => ({
      ...prev,
      capacity: Math.max(1, value) // Ensure minimum capacity is 1
    }));
  };
  
  const addTech = () => {
    if (techInput.trim() && !project.requiredTech.includes(techInput.trim())) {
      setProject(prev => ({
        ...prev,
        requiredTech: [...prev.requiredTech, techInput.trim()]
      }));
      setTechInput('');
    }
  };
  
  const removeTech = (tech) => {
    setProject(prev => ({
      ...prev,
      requiredTech: prev.requiredTech.filter(t => t !== tech)
    }));
  };
  
  const addRole = () => {
    if (roleInput.trim() && !project.requiredRoles.includes(roleInput.trim())) {
      setProject(prev => ({
        ...prev,
        requiredRoles: [...prev.requiredRoles, roleInput.trim()]
      }));
      setRoleInput('');
    }
  };
  
  const removeRole = (role) => {
    setProject(prev => ({
      ...prev,
      requiredRoles: prev.requiredRoles.filter(r => r !== role)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!project.title.trim()) {
      alert('Please enter a project title');
      return;
    }
    
    if (!project.description.trim()) {
      alert('Please enter a project description');
      return;
    }
    
    if (project.requiredTech.length === 0) {
      alert('Please add at least one required technology');
      return;
    }
    
    if (project.requiredRoles.length === 0) {
      alert('Please add at least one required role');
      return;
    }
    
    if (!project.deadline.trim()) {
      alert('Please set a project deadline');
      return;
    }
    
    onSubmit(project);
  };
  
  return (
    <div className="project-form-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Describe the project"
            rows="4"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={project.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div className="form-group tech-input-group">
          <label htmlFor="techInput">Required Technologies:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="techInput"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Enter a technology"
            />
            <button type="button" onClick={addTech}>Add</button>
          </div>
          
          <div className="tags-container">
            {project.requiredTech.map((tech, index) => (
              <div key={index} className="tag">
                {tech}
                <button type="button" onClick={() => removeTech(tech)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group role-input-group">
          <label htmlFor="roleInput">Required Roles:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="roleInput"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="Enter a role"
            />
            <button type="button" onClick={addRole}>Add</button>
          </div>
          
          <div className="tags-container">
            {project.requiredRoles.map((role, index) => (
              <div key={index} className="tag">
                {role}
                <button type="button" onClick={() => removeRole(role)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={project.deadline}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="capacity">Capacity (max interns):</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            value={project.capacity}
            onChange={handleCapacityChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Add Project</button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;