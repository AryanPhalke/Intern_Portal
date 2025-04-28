const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to get all interns
app.get('/api/interns', (req, res) => {
  try {
    // Read the mock data file
    const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData.json'), 'utf8'));
    
    // Simulate a slight delay (like a real API would have)
    setTimeout(() => {
      res.json(mockData.interns);
    }, 300);
  } catch (error) {
    console.error('Error reading mock data:', error);
    res.status(500).json({ error: 'Failed to fetch interns' });
  }
});

// API endpoint to get a specific intern by ID
app.get('/api/interns/:id', (req, res) => {
  try {
    const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData.json'), 'utf8'));
    const intern = mockData.interns.find(intern => intern.id === parseInt(req.params.id));
    
    if (!intern) {
      return res.status(404).json({ error: 'Intern not found' });
    }
    
    // Simulate a slight delay
    setTimeout(() => {
      res.json(intern);
    }, 200);
  } catch (error) {
    console.error(`Error fetching intern with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch intern' });
  }
});

// Catch-all handler to serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});