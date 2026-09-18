/**
 * Escapes special regular expression characters in a string to prevent ReDoS
 * and unwanted regular expression injection attacks in MongoDB queries.
 *
 * @param {string} string - The raw search input string
 * @returns {string} - Escaped string safe for new RegExp or Mongoose $regex
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default {
  escapeRegex,
};
