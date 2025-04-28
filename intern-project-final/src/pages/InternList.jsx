import React, { useState, useEffect } from 'react';
import { fetchInterns } from '../services/api';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import InternTable from './InternTable';
import AddIntern from './AddIntern';
import Dashboard from './Dashboard';
import './InternList.css';

const InternList = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Fetch interns when component mounts
    loadInterns();
  }, []);

  const loadInterns = async () => {
    try {
      setLoading(true);
      const data = await fetchInterns();
      setInterns(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interns. Please try again later.');
      setLoading(false);
      console.error('Error fetching interns:', err);
    }
  };

  const handleInternAdded = (newIntern) => {
    // Update the local state with the new intern
    setInterns(prevInterns => [...prevInterns, { ...newIntern}]);
    // Hide the form after successful submission
    setShowAddForm(false);
  };

  const toggleAddForm = () => {
    setShowAddForm(prev => !prev);
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'cards' ? 'table' : 'cards');
  };

  const toggleDashboard = () => {
    setShowDashboard(prev => !prev);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="intern-directory">
      <div className="directory-header">
        <h1 className="directory-title">Intern Directory</h1>
        
        <div className="directory-actions">
          <button 
            className={`view-button ${showDashboard ? '' : 'active'}`}
            onClick={() => setShowDashboard(false)}
          >
            Directory
          </button>
          
          <button 
            className={`view-button ${showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(true)}
          >
            Dashboard
          </button>
        </div>
        
        {!showDashboard && (
          <div className="directory-subactions">
            <button 
              className="view-toggle-button"
              onClick={toggleViewMode}
            >
              {viewMode === 'cards' ? 'Table View' : 'Card View'}
            </button>
            
            <button 
              className="toggle-form-button"
              onClick={toggleAddForm}
            >
              {showAddForm ? 'Hide Form' : 'Add New Intern'}
            </button>
          </div>
        )}
      </div>
      
      {showDashboard ? (
        <Dashboard interns={interns} />
      ) : (
        <>
          {showAddForm && (
            <div className="add-form-section">
              <AddIntern onInternAdded={handleInternAdded} allInterns={interns} />
            </div>
          )}
          
          {viewMode === 'table' ? (
            <InternTable interns={interns} />
          ) : (
            <div className="interns-grid">
              {interns.map((intern) => (
                <div key={intern.id} className="intern-card-wrapper">
                  <ProfileCard
                    name={intern.name}
                    role={intern.role}
                    school={intern.school}
                    degree={intern.degree}
                    initials={intern.initials}
                    techStack={intern.techStack}
                    funFacts={intern.funFacts}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InternList;