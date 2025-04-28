// ProfileCard.jsx
import React, { useState } from 'react';
import './ProfileCard.css';

// ProfileCard component that displays user information with expandable sections
const ProfileCard = ({ 
  // Default props for user information
  name = "Alex Smith",
  role = "Frontend Development Intern",
  school = "MIT",
  degree = "BS in Computer Science, Senior",
  initials = "AS",
  techStack = ["React", "TypeScript", "Tailwind CSS", "Node.js", "Git"],
  funFacts = ["Chess player", "Dog lover", "Hiking enthusiast", "Jazz musician"],
}) => {
  // State to manage which sections are expanded/collapsed
  const [expandedSections, setExpandedSections] = useState({
    techStack: false,
    funFacts: false,
  });

  // Function to toggle the expansion state of a section
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="profile-card">
      {/* Header section with user's basic information */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="profile-initials">{initials}</span>
        </div>
        
        <h1 className="profile-name">{name}</h1>
        <p className="profile-role">{role}</p>
        
        <p className="profile-school">{school}</p>
        <p className="profile-degree">{degree}</p>
      </div>

      {/* Expandable sections for tech stack and fun facts */}
      <div className="profile-sections">
        {/* Tech Stack section toggle button */}
        <button 
          className="section-toggle"
          onClick={() => toggleSection('techStack')}
        >
          Tech Stack{expandedSections.techStack ? '−' : '+'}
        </button>
        
        {/* Conditional rendering of tech stack list */}
        {expandedSections.techStack && (
          <div className="section-content">
            <ul>
              {techStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Fun Facts section toggle button */}
        <button 
          className="section-toggle"
          onClick={() => toggleSection('funFacts')}
        >
          Fun Facts{expandedSections.funFacts ? '−' : '+'}
        </button>
        
        {/* Conditional rendering of fun facts list */}
        {expandedSections.funFacts && (
          <div className="section-content">
            <ul>
              {funFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;