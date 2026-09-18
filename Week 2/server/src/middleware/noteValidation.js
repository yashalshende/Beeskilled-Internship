import { validateObjectId } from './validateObjectId.js';

/**
 * Validates that the request parameter `:id` is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export const validateNoteId = validateObjectId('id', 'Note');

/**
 * Validates the request body for creating a new Note (POST /api/notes)
 */
export const validateCreateNote = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
      data: null,
    });
  }

  const { title, content } = req.body;

  // Validate Title
  if (title === undefined || title === null) {
    return res.status(400).json({
      success: false,
      message: 'Note title is required.',
      data: null,
    });
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Note title must be a non-empty string.',
      data: null,
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Note title cannot exceed 200 characters.',
      data: null,
    });
  }

  // Validate Content
  if (content === undefined || content === null) {
    return res.status(400).json({
      success: false,
      message: 'Note content is required.',
      data: null,
    });
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Note content must be a non-empty string.',
      data: null,
    });
  }

  if (content.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Note content cannot exceed 5000 characters.',
      data: null,
    });
  }

  // Sanitize trimmed strings
  req.body.title = title.trim();
  req.body.content = content.trim();

  next();
};

/**
 * Validates the request body for updating an existing Note (PUT /api/notes/:id)
 */
export const validateUpdateNote = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
      data: null,
    });
  }

  const { title, content } = req.body;
  const allowedFields = ['title', 'content'];
  const providedFields = Object.keys(req.body).filter((k) => allowedFields.includes(k));

  if (providedFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain at least one field to update: title or content.',
      data: null,
    });
  }

  // Validate Title if present
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note title must be a non-empty string when provided.',
        data: null,
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Note title cannot exceed 200 characters.',
        data: null,
      });
    }

    req.body.title = title.trim();
  }

  // Validate Content if present
  if (content !== undefined) {
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note content must be a non-empty string when provided.',
        data: null,
      });
    }

    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot exceed 5000 characters.',
        data: null,
      });
    }

    req.body.content = content.trim();
  }

  next();
};
