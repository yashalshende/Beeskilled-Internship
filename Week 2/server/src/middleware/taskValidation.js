import { validateObjectId } from './validateObjectId.js';

/**
 * Validates that the request parameter `:id` is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export const validateTaskId = validateObjectId('id', 'Task');

/**
 * Validates the request body for creating a new Task (POST /api/tasks)
 */
export const validateCreateTask = (req, res, next) => {
  const { title, description, completed } = req.body;

  // Verify body is an object
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
    });
  }

  // Validate Title (Required, string, non-empty after trim)
  if (title === undefined || title === null) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required.',
    });
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Task title must be a non-empty string.',
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Task title cannot exceed 200 characters.',
    });
  }

  // Validate Description (Optional, string if present)
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Task description must be a string.',
    });
  }

  // Validate Completed (Optional, boolean if present)
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Completed status must be a boolean (true or false).',
    });
  }

  next();
};

/**
 * Validates the request body for updating an existing Task (PUT /api/tasks/:id)
 */
export const validateUpdateTask = (req, res, next) => {
  const { title, description, completed } = req.body;

  // Verify body is an object
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
    });
  }

  const allowedFields = ['title', 'description', 'completed'];
  const providedFields = Object.keys(req.body).filter((key) => allowedFields.includes(key));

  if (providedFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain at least one field to update: title, description, or completed.',
    });
  }

  // Validate Title if present
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title must be a non-empty string when provided.',
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 200 characters.',
      });
    }
  }

  // Validate Description if present
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Task description must be a string.',
    });
  }

  // Validate Completed if present
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Completed status must be a boolean (true or false).',
    });
  }

  next();
};
