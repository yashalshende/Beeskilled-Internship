import Task from '../models/Task.js';
import { escapeRegex } from '../utils/sanitize.js';

/**
 * @desc    Create a new Task
 * @route   POST /api/tasks
 * @access  Public / Optional Auth
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const taskData = {
      title: title.trim(),
    };

    if (description !== undefined) {
      taskData.description = description.trim();
    }

    if (completed !== undefined) {
      taskData.completed = completed;
    }

    // Attach authenticated user if available
    if (req.user && req.user._id) {
      taskData.user = req.user._id;
    }

    const newTask = await Task.create(taskData);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all Tasks (with optional filtering by status and search query)
 * @route   GET /api/tasks
 * @access  Public
 */
export const getTasks = async (req, res, next) => {
  try {
    const { completed, search, sort } = req.query;
    const filter = {};

    // Filter by completed status if query parameter provided
    if (completed !== undefined) {
      if (completed === 'true' || completed === true) {
        filter.completed = true;
      } else if (completed === 'false' || completed === false) {
        filter.completed = false;
      }
    }

    // Optional text search sanitized against ReDoS attacks
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const safeSearch = escapeRegex(search.trim().slice(0, 100));
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // Sorting: default newest first (-createdAt)
    const sortOption = sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single Task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a Task by ID
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updateFields = {};

    if (title !== undefined) {
      updateFields.title = title.trim();
    }

    if (description !== undefined) {
      updateFields.description = description.trim();
    }

    if (completed !== undefined) {
      updateFields.completed = completed;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Task by ID
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID: ${id}`,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};
