const {decodeBase64String} = require('../utils/string');
const decodeSSUri = (uri, proxy_name) => {
  const [uriString, hash] = uri.split('#');
  const uriPath = uriString.replace('ss://', '');
  const [cipher, passwordAndDomain, port] = decodeBase64String(uriPath).split(':');
  const [password, server] = passwordAndDomain.split('@');
  const name = proxy_name || hash || `ss-${server}-${port}`;
  return {
    name,
    type: 'ss',
    cipher,
    password,
    server,
    port: parseInt(port, 10),
    originalUri: uri,
  };
}

module.exports = {
  decodeSSUri,
}
