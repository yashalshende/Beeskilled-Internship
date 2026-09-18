import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import {
  validateTaskId,
  validateCreateTask,
  validateUpdateTask,
} from '../middleware/taskValidation.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply optional authentication to capture req.user if a token is passed
router.use(optionalAuth);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public / Authenticated
 *
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public
 */
router
  .route('/')
  .post(validateCreateTask, createTask)
  .get(getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Public
 *
 * @route   PUT /api/tasks/:id
 * @desc    Update a task by ID
 * @access  Public
 *
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task by ID
 * @access  Public
 */
router
  .route('/:id')
  .get(validateTaskId, getTaskById)
  .put(validateTaskId, validateUpdateTask, updateTask)
  .delete(validateTaskId, deleteTask);

export default router;
