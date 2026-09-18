import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import {
  validateNoteId,
  validateCreateNote,
  validateUpdateNote,
} from '../middleware/noteValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce JWT authentication on ALL Note routes
router.use(authMiddleware);

/**
 * @route   POST /api/notes
 * @desc    Create a new note for authenticated user
 * @access  Private
 *
 * @route   GET /api/notes
 * @desc    Get all notes for authenticated user
 * @access  Private
 */
router
  .route('/')
  .post(validateCreateNote, createNote)
  .get(getNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get single note by ID (user-scoped)
 * @access  Private
 *
 * @route   PUT /api/notes/:id
 * @desc    Update note by ID (user-scoped)
 * @access  Private
 *
 * @route   DELETE /api/notes/:id
 * @desc    Delete note by ID (user-scoped)
 * @access  Private
 */
router
  .route('/:id')
  .get(validateNoteId, getNoteById)
  .put(validateNoteId, validateUpdateNote, updateNote)
  .delete(validateNoteId, deleteNote);

export default router;
