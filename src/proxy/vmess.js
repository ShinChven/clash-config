const {decodeBase64String} = require('../utils/string');
const decodeVmessUri = (uri, proxy_name) => {
  const [uriString, hash] = uri.split('#');
  const uriPath = uriString.replace('vmess://', '');
  const decoded = decodeBase64String(uriPath);
  const data = JSON.parse(decoded);
  const {id, port, add} = data;
  const name = proxy_name || hash || `vmess-${add}-${port}`;
  return {
    name,
    type: 'vmess',
    server: add,
    port: parseInt(port, 10),
    uuid: id,
    alterId: 0,
    cipher: 'auto',
    tls: false,
    originalUri: uri,
  };
}

module.exports = {
  decodeVmessUri,
}
