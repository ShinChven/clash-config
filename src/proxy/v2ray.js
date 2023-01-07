const {decodeVmessUri} = require('./vmess');
const {decodeSSUri} = require('./ss');
const {decodeSSRUri} = require('./ssr');
const decodeV2raySubscription = (text) => {
  const uris = Buffer.from(text, 'base64').toString().split('\n');
  return uris.map((uri) => {
    if (uri.startsWith('vmess://')) {
      return decodeVmessUri(uri);
    } else if (uri.startsWith('ss://')) {
      return decodeSSUri(uri);
    } else if (uri.startsWith('ssr://')) {
      return decodeSSRUri(uri);
    }
  });
}

module.exports = {
  decodeV2raySubscription,
}
