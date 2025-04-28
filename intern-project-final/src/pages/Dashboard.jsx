import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  XAxis, YAxis, 
  Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import './Dashboard.css';

const COLORS = [
  '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
  '#d0ed57', '#ffc658', '#ff8042', '#ff5252', '#e57373',
  '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6'
];

const Dashboard = ({ interns = [] }) => {
  // Count tech stacks for pie chart
  const techStackData = useMemo(() => {
    const techCounts = {};
    
    interns.forEach(intern => {
      if (intern.techStack && Array.isArray(intern.techStack)) {
        intern.techStack.forEach(tech => {
          const techName = tech.trim();
          techCounts[techName] = (techCounts[techName] || 0) + 1;
        });
      }
    });
    
    return Object.entries(techCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [interns]);

  // Get interns per role for bar chart
  const roleData = useMemo(() => {
    const roleCounts = {};
    
    interns.forEach(intern => {
      if (intern.role) {
        roleCounts[intern.role] = (roleCounts[intern.role] || 0) + 1;
      }
    });
    
    return Object.entries(roleCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [interns]);

  // Get school representation
  const schoolData = useMemo(() => {
    const schoolCounts = {};
    
    interns.forEach(intern => {
      if (intern.school) {
        schoolCounts[intern.school] = (schoolCounts[intern.school] || 0) + 1;
      }
    });
    
    return Object.entries(schoolCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [interns]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Intern Analytics Dashboard</h1>
        <p>Visualizing intern data and technology distributions</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Interns</h3>
          <p className="stat-value">{interns.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Unique Technologies</h3>
          <p className="stat-value">{techStackData.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Different Roles</h3>
          <p className="stat-value">{roleData.length}</p>
        </div>
        
        <div className="stat-card">
          <h3>Schools Represented</h3>
          <p className="stat-value">{schoolData.length}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Technology Distribution</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={techStackData.slice(0, 10)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {techStackData.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interns`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-note">Top 10 technologies used by interns</p>
        </div>

        <div className="chart-container">
          <h2>Interns by Role</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={roleData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Interns" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container full-width">
          <h2>School Representation</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={schoolData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 150,
                  bottom: 5,
                }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Interns" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;