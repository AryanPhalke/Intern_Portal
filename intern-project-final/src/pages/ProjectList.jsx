import React, { useState, useEffect } from 'react';
import { fetchProjects, getProjectAssignments, saveProjectAssignments } from '../services/api';
import ProjectCard from '../components/Project Card/ProjectCard';
import './ProjectList.css';

const ProjectList = ({ interns = [] }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [statusFilter, setStatusFilter] = useState('');

  // Load projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await fetchProjects();
        
        // Ensure each project has a unique id
        const projectsWithIds = projectsData.map(project => ({
          ...project,
          id: project._id || project.id
        }));
        
        setProjects(projectsWithIds);
        
        // Load assignments for each project
        const assignmentsData = {};
        for (const project of projectsWithIds) {
          try {
            const assignment = await getProjectAssignments(project.id);
            assignmentsData[project.id] = assignment.internIds || [];
          } catch (err) {
            console.error(`Error loading assignments for project ${project.id}:`, err);
            assignmentsData[project.id] = [];
          }
        }
        
        setAssignments(assignmentsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };
    
    loadProjects();
  }, []);

  // Handle assigning an intern to a project
  const handleAssignIntern = async (projectId, internId) => {
    try {
      // Update local state first for immediate UI feedback
      const currentAssignments = assignments[projectId] || [];
      const updatedAssignments = [...currentAssignments, internId];
      
      setAssignments(prev => ({
        ...prev,
        [projectId]: updatedAssignments
      }));
      
      // Save to the server
      await saveProjectAssignments(projectId, updatedAssignments);
    } catch (err) {
      console.error('Error assigning intern to project:', err);
      // Revert to previous state if save failed
      setAssignments(prev => ({
        ...prev,
        [projectId]: assignments[projectId] || []
      }));
      
      // Show error toast or notification here
    }
  };

  // Handle removing an intern from a project
  const handleRemoveIntern = async (projectId, internId) => {
    try {
      // Update local state first
      const currentAssignments = assignments[projectId] || [];
      const updatedAssignments = currentAssignments.filter(id => id !== internId);
      
      setAssignments(prev => ({
        ...prev,
        [projectId]: updatedAssignments
      }));
      
      // Save to the server
      await saveProjectAssignments(projectId, updatedAssignments);
    } catch (err) {
      console.error('Error removing intern from project:', err);
      // Revert on failure
      setAssignments(prev => ({
        ...prev,
        [projectId]: assignments[projectId] || []
      }));
      
      // Show error toast or notification here
    }
  };

  // Filter projects by status
  const filteredProjects = statusFilter 
    ? projects.filter(project => project.status === statusFilter)
    : projects;

  // Get assigned interns for each project
  const getAssignedInterns = (projectId) => {
    const assignedIds = assignments[projectId] || [];
    return interns.filter(intern => assignedIds.includes(intern.id || intern._id));
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h2>Projects</h2>
        <div className="project-filter">
          <label>Filter by Status:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              assignedInterns={getAssignedInterns(project.id)}
              onDrop={handleAssignIntern}
              onRemoveIntern={(internId) => handleRemoveIntern(project.id, internId)}
              allInterns={interns}
            />
          ))}
        </div>
      ) : (
        <div className="no-projects">
          <p>No projects found with the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;