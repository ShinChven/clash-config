const path = require('path');
const url = require('url');

const addProxy = async () => {
  const [, , , uri, name] = process.argv;

  if (!uri) {
    console.log('No URI provided');
    return;
  }

  const scheme = url.parse(uri).protocol;

  console.log('scheme', scheme);
}

module.exports = addProxy;
