import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Mongoose Schema
 * Represents an authenticated user in the BeeSkilled Week 2 Authentication API.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [72, 'Password cannot exceed 72 characters'],
      select: false, // Prevents password hash from being selected by default in queries
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // Ensure password hash is NEVER returned in JSON outputs
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

/**
 * Pre-save Mongoose Hook
 * Automatically generates a salt and hashes the password if it was modified.
 */
userSchema.pre('save', async function () {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare entered password with hashed password stored in DB
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
