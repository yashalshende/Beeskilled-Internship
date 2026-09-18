import mongoose from 'mongoose';

/**
 * Note Mongoose Schema
 * Represents a user-owned note in the BeeSkilled Week 2 Notes Mini Project.
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      minlength: [1, 'Note title cannot be empty'],
      maxlength: [200, 'Note title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
      minlength: [1, 'Note content cannot be empty'],
      maxlength: [5000, 'Note content cannot exceed 5000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to an authenticated user'],
      index: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false,
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

// Compound index to optimize fetching notes for a specific user sorted by latest first
noteSchema.index({ user: 1, createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;
