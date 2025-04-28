import React, { useState } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ 
  project, 
  assignedInterns = [], 
  onDrop,
  onRemoveIntern,
  showAssignedInterns = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const internId = e.dataTransfer.getData('intern');
    if (internId && onDrop) {
      onDrop(project.id, internId);
    }
  };
  
  // Calculate tech stack match percentage for assigned interns
  const calculateTechMatch = (intern) => {
    if (!intern.techStack || !project.requiredTech) return 0;
    
    const matchingTechs = intern.techStack.filter(tech => 
      project.requiredTech.includes(tech)
    );
    
    return Math.round((matchingTechs.length / project.requiredTech.length) * 100);
  };
  
  // Calculate role match (boolean) for each intern
  const hasRoleMatch = (intern) => {
    return project.requiredRoles.includes(intern.role);
  };

  return (
    <div 
      className={`project-card ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="project-header">
        <h2 className="project-title">{project.title}</h2>
        <div className="project-status">
          <span className={`status-badge ${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-meta">
        <div className="tech-requirements">
          <h3>Required Technologies</h3>
          <div className="tech-tags">
            {project.requiredTech.map((tech, index) => (
              <span key={index} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
        
        <div className="role-requirements">
          <h3>Required Roles</h3>
          <div className="role-tags">
            {project.requiredRoles.map((role, index) => (
              <span key={index} className="role-tag">{role}</span>
            ))}
          </div>
        </div>
      </div>
      
      {showAssignedInterns && (
        <div className="assigned-interns">
          <h3>Assigned Interns ({assignedInterns.length}/{project.capacity})</h3>
          {assignedInterns.length > 0 ? (
            <ul className="intern-list">
              {assignedInterns.map((intern) => {
                const techMatch = calculateTechMatch(intern);
                const roleMatch = hasRoleMatch(intern);
                
                return (
                  <li key={intern.id} className="assigned-intern">
                    <div className="intern-avatar">{intern.initials}</div>
                    <div className="intern-info">
                      <span className="intern-name">{intern.name}</span>
                      <span className="intern-role">{intern.role}</span>
                      <div className="intern-match">
                        <span className={`match-indicator ${roleMatch ? 'good' : 'poor'}`}>
                          {roleMatch ? 'Role Match' : 'Role Mismatch'}
                        </span>
                        <span className={`match-indicator ${
                          techMatch >= 70 ? 'good' : techMatch >= 30 ? 'medium' : 'poor'
                        }`}>
                          {techMatch}% Tech Match
                        </span>
                      </div>
                    </div>
                    {onRemoveIntern && (
                      <button 
                        className="remove-intern-btn"
                        onClick={() => onRemoveIntern(intern.id)}
                        title="Remove from project"
                      >
                        ×
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-interns">No interns assigned yet. Drag interns here to assign them.</p>
          )}
        </div>
      )}
      
      <div className="project-footer">
        <span className="deadline">Deadline: {project.deadline}</span>
        <span className="capacity">Team Size: {assignedInterns.length}/{project.capacity}</span>
      </div>
    </div>
  );
};

export default ProjectCard;