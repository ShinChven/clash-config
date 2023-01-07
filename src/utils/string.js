/**
 * Convert a string to camel case
 * @param string
 * @returns {string}
 */
const stringToSafeFilename = (string) => {
  return string.replace(/[^a-z0-9\-]/gi, '_').toLowerCase();
}

/**
 * Decode base64 string.
 * @param str
 * @returns {string}
 */
const decodeBase64String = (str) => {
  return Buffer.from(str, 'base64').toString();
}



module.exports = {
  stringToSafeFilename,
  decodeBase64String,
}
