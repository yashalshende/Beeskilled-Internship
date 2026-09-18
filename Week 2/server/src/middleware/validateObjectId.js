import mongoose from 'mongoose';

/**
 * Higher-order middleware generator to validate 24-character hexadecimal MongoDB ObjectId parameters.
 *
 * @param {string} [paramName='id'] - The request param to validate (e.g. 'id')
 * @param {string} [entityName='Resource'] - Entity name for descriptive client error messages
 */
export const validateObjectId = (paramName = 'id', entityName = 'Resource') => {
  return (req, res, next) => {
    const value = req.params[paramName];

    const isValid = mongoose.Types.ObjectId.isValid(value) && /^[0-9a-fA-F]{24}$/.test(value);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${entityName} ID format: '${value}'. Must be a 24-character hex string.`,
        data: null,
      });
    }

    next();
  };
};

export default validateObjectId;
