// utils/seeder.js
const Intern = require('../models/Intern');
const Project = require('../models/Project');
const mockInterns = require('../src/mockData.json');
const { MOCK_PROJECTS } = require('../src/mockProjects');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Intern.deleteMany({});
    await Project.deleteMany({});
    
    console.log('Database cleared');
    
    // Seed interns
    await Intern.insertMany(mockInterns);
    console.log('Interns seeded successfully');
    
    // Seed projects
    await Project.insertMany(MOCK_PROJECTS);
    console.log('Projects seeded successfully');
    
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;