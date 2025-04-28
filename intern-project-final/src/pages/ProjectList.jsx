import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/Project Card/ProjectCard';
import { getProjects, saveProjectAssignments, getProjectAssignments } from '../services/api';
import './ProjectList.css';

const ProjectList = ({ interns = [] }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [assignments, setAssignments] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);

  // Load projects and assignments on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load projects
        const projectData = await getProjects();
        setProjects(projectData);
        
        // Load assignments
        const assignmentData = await getProjectAssignments();
        setAssignments(assignmentData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load projects or assignments');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save assignments to localStorage whenever they change
  useEffect(() => {
    const saveData = async () => {
      if (Object.keys(assignments).length > 0) {
        try {
          await saveProjectAssignments(assignments);
          // Show save message briefly
          setSaveMessage('Assignments saved successfully');
          setTimeout(() => setSaveMessage(null), 2000);
        } catch (err) {
          console.error('Error saving assignments:', err);
        }
      }
    };
    
    // Only save if assignments have been loaded (not on initial mount)
    if (!loading && Object.keys(assignments).length > 0) {
      saveData();
    }
  }, [assignments, loading]);

  // Get unique tech stacks and roles from projects for filters
  const uniqueTechs = [...new Set(projects.flatMap(project => project.requiredTech))].sort();
  const uniqueRoles = [...new Set(projects.flatMap(project => project.requiredRoles))].sort();
  const statusOptions = ['all', 'active', 'pending', 'completed'];

  // Filter projects based on filters
  const filteredProjects = projects.filter(project => {
    const statusMatch = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
    const techMatch = !techFilter || project.requiredTech.includes(techFilter);
    const roleMatch = !roleFilter || project.requiredRoles.includes(roleFilter);
    return statusMatch && techMatch && roleMatch;
  });

  // Handle dropping an intern onto a project
  const handleInternDrop = (projectId, internId) => {
    const parsedInternId = parseInt(internId);
    
    // Find the intern
    const intern = interns.find(i => i.id === parsedInternId);
    if (!intern) return;

    // Find the project
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Check if the project is at capacity
    const currentAssignees = assignments[projectId] || [];
    if (currentAssignees.length >= project.capacity) {
      alert(`This project is at maximum capacity (${project.capacity} interns).`);
      return;
    }
    
    // Check if intern is already assigned to this project
    if (currentAssignees.includes(parsedInternId)) {
      return; // Intern already assigned to this project
    }
    
    // Update assignments
    setAssignments(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), parsedInternId]
    }));
  };

  // Handle removing an intern from a project
  const handleRemoveIntern = (projectId, internId) => {
    setAssignments(prev => {
      const updatedAssignments = { ...prev };
      updatedAssignments[projectId] = updatedAssignments[projectId].filter(id => id !== internId);
      
      // If no interns left in project, clean up the empty array
      if (updatedAssignments[projectId].length === 0) {
        delete updatedAssignments[projectId];
      }
      
      return updatedAssignments;
    });
  };

  // Get assigned interns for a project
  const getAssignedInterns = (projectId) => {
    const assignedIds = assignments[projectId] || [];
    return interns.filter(intern => assignedIds.includes(intern.id));
  };

  // Get project utilization percentage
  const getProjectUtilization = () => {
    const totalAssigned = Object.values(assignments).flat().length;
    const totalCapacity = projects.reduce((sum, project) => sum + project.capacity, 0);
    return totalCapacity ? Math.round((totalAssigned / totalCapacity) * 100) : 0;
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h2>Available Projects</h2>
        <p>Drag and drop interns to assign them to projects based on their skills and tech preferences.</p>
        
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-label">Total Projects:</span>
            <span className="stat-value">{projects.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Assigned Interns:</span>
            <span className="stat-value">{Object.values(assignments).flat().length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overall Utilization:</span>
            <span className="stat-value">{getProjectUtilization()}%</span>
          </div>
        </div>
        
        {saveMessage && (
          <div className="save-message">{saveMessage}</div>
        )}
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="status-filter">Project Status</label>
            <select 
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="tech-filter">Technology</label>
            <select 
              id="tech-filter"
              className="filter-select"
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
            >
              <option value="">All Technologies</option>
              {uniqueTechs.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="role-filter">Role</label>
            <select 
              id="role-filter"
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard 
              key={project.id}
              project={project}
              assignedInterns={getAssignedInterns(project.id)}
              onDrop={handleInternDrop}
              onRemoveIntern={(internId) => handleRemoveIntern(project.id, internId)}
            />
          ))
        ) : (
          <div className="no-projects">
            No projects match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;