// server.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';
import connectDB from './db/connection.js';
import apiRoutes from './routes/api.js';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', apiRoutes);

// Catch-all handler to serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Data seeding (optional)
if (process.env.SEED_DB === 'true') {
  // Dynamic import for the seeder module
  const seedModule = await import('./utils/seeder.js');
  const seedDatabase = seedModule.default;
  seedDatabase();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});