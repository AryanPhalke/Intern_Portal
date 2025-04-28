import React, { useState, useEffect, useMemo } from 'react';
import './InternTable.css';

const InternTable = ({ interns = [] }) => {
  // State for table controls
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Get unique roles for the filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(interns.map(intern => intern.role))];
    return roles;
  }, [interns]);

  // Apply search, filter, and sort
  const filteredAndSortedInterns = useMemo(() => {
    // First apply search
    let filteredInterns = interns.filter(intern => 
      intern.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply role filter if selected
    if (roleFilter) {
      filteredInterns = filteredInterns.filter(intern => 
        intern.role === roleFilter
      );
    }
    
    // Then apply sorting
    return [...filteredInterns].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [interns, searchTerm, roleFilter, sortConfig]);

  // Get current page items
  const currentInterns = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedInterns.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedInterns, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedInterns.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get the sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="intern-table-container">
      <div className="table-controls">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-box">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="table-info">
          Showing {currentInterns.length} of {filteredAndSortedInterns.length} interns
        </div>
      </div>

      <div className="table-wrapper">
        <table className="intern-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>
                Name {getSortIndicator('name')}
              </th>
              <th onClick={() => requestSort('role')}>
                Role {getSortIndicator('role')}
              </th>
              <th onClick={() => requestSort('school')}>
                School {getSortIndicator('school')}
              </th>
              <th>Degree</th>
              <th>Tech Stack</th>
            </tr>
          </thead>
          <tbody>
            {currentInterns.length > 0 ? (
              currentInterns.map((intern) => (
                <tr key={intern.id}>
                  <td>
                    <div className="intern-name">
                      <span className="intern-avatar">{intern.initials}</span>
                      {intern.name}
                    </div>
                  </td>
                  <td>{intern.role}</td>
                  <td>{intern.school}</td>
                  <td>{intern.degree}</td>
                  <td>
                    <div className="tech-tags">
                      {intern.techStack.slice(0, 3).map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                      {intern.techStack.length > 3 && (
                        <span className="tech-more">+{intern.techStack.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No interns found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default InternTable;