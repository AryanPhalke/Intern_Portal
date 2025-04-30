// routes/api.js
import express from 'express';
import * as internController from '../controllers/internController.js';
import * as projectController from '../controllers/projectController.js';
import * as assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

// Intern routes
router.get('/interns', internController.getAllInterns);
router.get('/interns/:id', internController.getInternById);
router.post('/interns', internController.createIntern);
router.put('/interns/:id', internController.updateIntern);
router.delete('/interns/:id', internController.deleteIntern);

// Project routes
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Assignment routes
router.get('/assignments', assignmentController.getAllAssignments);
router.get('/assignments/project/:projectId', assignmentController.getAssignmentByProject);
router.post('/assignments', assignmentController.saveAssignment);
router.delete('/assignments/project/:projectId', assignmentController.deleteAssignment);

export default router;