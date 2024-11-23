import {util} from './crypto.js'

export function HMAC(hasher, message, key, options) {
  const blockSize = 16;
  // Allow arbitrary length keys
  key = key.length > blockSize * 4
    ? hasher(key, {asBytes: true})
    : util.stringToBytes(key);

  // XOR keys with pad constants
  let oKey = key.slice(0);
  let iKey = key.slice(0);
  for (let i = 0; i < blockSize * 4; i++) {
    oKey[i] ^= 0x5C;
    iKey[i] ^= 0x36;
  }

  const hmacBytes = hasher(
    util.bytesToString(oKey) + hasher(util.bytesToString(iKey) + message, {asString: true}),
    {asBytes: true}
  );

  if (options && options.asBytes) {
    return hmacBytes;
  } else if (options && options.asString) {
    return util.bytesToString(hmacBytes);
  } else {
    return util.bytesToHex(hmacBytes);
  }
}