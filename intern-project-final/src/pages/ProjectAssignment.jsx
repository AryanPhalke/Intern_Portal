import React, { useState, useEffect } from 'react';
import { fetchInterns } from '../services/api';
import ProjectList from './ProjectList';
import './ProjectAssignment.css';

const ProjectAssignment = () => {
  // States for data and UI control
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Load interns on component mount
  useEffect(() => {
    const loadInterns = async () => {
      try {
        setLoading(true);
        const data = await fetchInterns();
        setInterns(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch interns data');
        setLoading(false);
        console.error('Error fetching interns:', err);
      }
    };
    
    loadInterns();
  }, []);
  
  // Get unique tech stacks and roles for filters
  const uniqueTechs = [...new Set(
    interns.flatMap(intern => 
      intern.techStack && Array.isArray(intern.techStack) ? intern.techStack : []
    )
  )].sort();
  
  const uniqueRoles = [...new Set(
    interns.map(intern => intern.role)
  )].sort();
  
  // Filter interns based on search and filters
  const filteredInterns = interns.filter(intern => {
    const nameMatch = intern.name.toLowerCase().includes(searchTerm.toLowerCase());
    const techMatch = !techFilter || (intern.techStack && intern.techStack.includes(techFilter));
    const roleMatch = !roleFilter || intern.role === roleFilter;
    return nameMatch && techMatch && roleMatch;
  });

  // Handle drag start for an intern
  const handleDragStart = (e, internId) => {
    e.dataTransfer.setData('intern', internId);
    // Add a dragging class to visualize the dragged item
    e.currentTarget.classList.add('dragging');
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading interns and projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="project-assignment-container">
      <div className="project-assignment-header">
        <h1>Project Assignment</h1>
        <p className="instructions">
          Drag and drop interns onto projects to assign them based on their skills and tech stack preferences.
        </p>
      </div>
      
      <div className="project-assignment-layout">
        <div className="assignment-sidebar">
          <div className="sidebar-header">
            <h3>Available Interns</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-section">
              <div className="filter-group">
                <label>Filter by Tech:</label>
                <select 
                  value={techFilter} 
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Technologies</option>
                  {uniqueTechs.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Filter by Role:</label>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="intern-list-sidebar">
            {filteredInterns.length > 0 ? (
              filteredInterns.map(intern => (
                <div 
                  key={intern.id} 
                  className="draggable-intern-card"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, intern.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="intern-avatar">{intern.initials}</div>
                  <div className="intern-details">
                    <h4>{intern.name}</h4>
                    <p className="intern-role-sidebar">{intern.role}</p>
                    <div className="tech-tags-sidebar">
                      {intern.techStack && intern.techStack.slice(0, 3).map((tech, index) => (
                        <span key={index} className="tech-tag-sidebar">{tech}</span>
                      ))}
                      {intern.techStack && intern.techStack.length > 3 && (
                        <span className="tech-count">+{intern.techStack.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-interns-message">
                No interns match your filters.
              </div>
            )}
          </div>
        </div>
        
        <div className="projects-main-content">
          <ProjectList interns={interns} />
        </div>
      </div>
    </div>
  );
};

export default ProjectAssignment;