const {decodeBase64String} = require('../utils/string');

const decodeSSRUri = (uri, proxy_name) => {
  const [uriString, hash] = uri.split('#');
  const uriPath = uriString.replace('ssr://', '');
  const [server, port, protocol, method, obfs, passwordAndParams] = decodeBase64String(uriPath).split(':');
  const [password, params] = passwordAndParams.split('/?');
  const paramsObj = {};
  params.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    paramsObj[key] = value;
  });
  const name = proxy_name || hash || `ssr-${server}-${port}`;
  return {
    name,
    type: 'ssr',
    server,
    port: parseInt(port, 10),
    cipher: method,
    password,
    protocol,
    obfs,
    "obfs-host": paramsObj.obfsparam,
    "udp": true,
    originalUri: uri,
  };
}

module.exports = {
  decodeSSRUri,
};
