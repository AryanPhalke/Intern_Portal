import React, { useState, useEffect, useRef } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ 
  project, 
  assignedInterns = [], 
  onDrop,
  onRemoveIntern,
  showAssignedInterns = true,
  allInterns = [] // Add a prop for all available interns
}) => {
  const [selectedInternId, setSelectedInternId] = useState('');
  const cardRef = useRef(null);
  
  // Ensure project has required properties
  const safeProject = {
    id: project?.id || 'unknown',
    title: project?.title || 'Untitled Project',
    description: project?.description || 'No description',
    status: project?.status || 'Pending',
    requiredTech: project?.requiredTech || [],
    requiredRoles: project?.requiredRoles || [],
    deadline: project?.deadline || 'Not set',
    capacity: project?.capacity || 1
  };
  
  // Log the project ID when the component mounts (for debugging)
  useEffect(() => {
    console.log(`ProjectCard mounted for project ID: ${safeProject.id}`);
  }, [safeProject.id]);
  
  // Filter out interns that are already assigned to this project
  const availableInterns = allInterns.filter(intern => 
    !assignedInterns.some(assigned => assigned.id === intern.id)
  );
  
  // Handle intern selection from dropdown
  const handleInternSelect = (e) => {
    setSelectedInternId(e.target.value);
  };
  
  // Handle assigning the selected intern to the project
  const handleAssignIntern = () => {
    if (selectedInternId && onDrop) {
      onDrop(String(safeProject.id), selectedInternId);
      setSelectedInternId(''); // Reset selection after assignment
    }
  };
  
  // Calculate tech stack match percentage for assigned interns
  const calculateTechMatch = (intern) => {
    if (!intern.techStack || !safeProject.requiredTech || safeProject.requiredTech.length === 0) return 0;
    
    const matchingTechs = intern.techStack.filter(tech => 
      safeProject.requiredTech.includes(tech)
    );
    
    return Math.round((matchingTechs.length / safeProject.requiredTech.length) * 100);
  };
  
  // Calculate role match (boolean) for each intern
  const hasRoleMatch = (intern) => {
    return safeProject.requiredRoles.includes(intern.role);
  };

  return (
    <div 
      ref={cardRef}
      className="project-card"
      data-project-id={safeProject.id}
    >
      <div className="project-header">
        <h2 className="project-title">{safeProject.title}</h2>
        <div className="project-status">
          <span className={`status-badge ${safeProject.status.toLowerCase()}`}>
            {safeProject.status}
          </span>
        </div>
      </div>
      
      <p className="project-description">{safeProject.description}</p>
      
      <div className="project-meta">
        <div className="tech-requirements">
          <h3>Required Technologies</h3>
          <div className="tech-tags">
            {safeProject.requiredTech.map((tech, index) => (
              <span key={`${safeProject.id}-tech-${index}`} className="tech-tag">{tech}</span>
            ))}
          </div>
        </div>
        
        <div className="role-requirements">
          <h3>Required Roles</h3>
          <div className="role-tags">
            {safeProject.requiredRoles.map((role, index) => (
              <span key={`${safeProject.id}-role-${index}`} className="role-tag">{role}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Intern Assignment Section */}
      {showAssignedInterns && (
        <>
          <div className="intern-assignment-section">
            <h3>Assign Intern</h3>
            {assignedInterns.length < safeProject.capacity ? (
              <div className="intern-assignment-controls">
                <select 
                  value={selectedInternId} 
                  onChange={handleInternSelect}
                  className="intern-dropdown"
                >
                  <option value="">-- Select an intern --</option>
                  {availableInterns.map(intern => (
                    <option key={`select-${intern.id}`} value={intern.id}>
                      {intern.name} - {intern.role} ({intern.techStack?.join(', ')})
                    </option>
                  ))}
                </select>
                <button 
                  className="assign-button"
                  onClick={handleAssignIntern}
                  disabled={!selectedInternId}
                >
                  Assign to Project
                </button>
              </div>
            ) : (
              <p className="capacity-message">Maximum capacity reached ({safeProject.capacity})</p>
            )}
          </div>
          
          <div className="assigned-interns">
            <h3>Assigned Interns ({assignedInterns.length}/{safeProject.capacity})</h3>
            {assignedInterns.length > 0 ? (
              <ul className="intern-list">
                {assignedInterns.map((intern) => {
                  const techMatch = calculateTechMatch(intern);
                  const roleMatch = hasRoleMatch(intern);
                  
                  return (
                    <li key={`${safeProject.id}-intern-${intern.id}`} className="assigned-intern">
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
              <p className="no-interns">No interns assigned yet. Use the dropdown above to assign interns.</p>
            )}
          </div>
        </>
      )}
      
      <div className="project-footer">
        <span className="deadline">Deadline: {safeProject.deadline}</span>
        <span className="capacity">Team Size: {assignedInterns.length}/{safeProject.capacity}</span>
      </div>
    </div>
  );
};

export default ProjectCard;