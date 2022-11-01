/**
 * Convert a string to camel case
 * @param string
 * @returns {string}
 */
const stringToSafeFilename = (string) => {
  return string.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
}



module.exports = {
  stringToSafeFilename,
}
