import mongoose from 'mongoose';

/**
 * Task Mongoose Schema
 * Represents a single to-do item in the BeeSkilled Week 2 To-Do REST API.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Task title cannot be empty'],
      maxlength: [200, 'Task title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Task description cannot exceed 2000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds and manages createdAt and updatedAt fields
    versionKey: false, // Cleaner JSON output without __v
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

// Index to optimize listing tasks by creation timestamp
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
