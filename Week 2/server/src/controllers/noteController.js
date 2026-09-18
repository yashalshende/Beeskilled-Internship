import Note from '../models/Note.js';
import { escapeRegex } from '../utils/sanitize.js';

/**
 * @desc    Create a new note for the authenticated user
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all notes belonging to the authenticated user
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Filter strictly scoped to the authenticated user
    const filter = {
      user: req.user._id,
    };

    // Optional text search sanitized against ReDoS attacks
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const safeSearch = escapeRegex(search.trim().slice(0, 100));
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { content: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const sortOption = sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    const notes = await Note.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single note by ID (user-scoped)
 * @route   GET /api/notes/:id
 * @access  Private
 */
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with ID: ${id}`,
        data: null,
      });
    }

    // Security: Check user ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to access this note.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a note by ID (user-scoped)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with ID: ${id}`,
        data: null,
      });
    }

    // Security: Check user ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to update this note.',
        data: null,
      });
    }

    if (title !== undefined) {
      note.title = title;
    }

    if (content !== undefined) {
      note.content = content;
    }

    const updatedNote = await note.save();

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a note by ID (user-scoped)
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note not found with ID: ${id}`,
        data: null,
      });
    }

    // Security: Check user ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to delete this note.',
        data: null,
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};
