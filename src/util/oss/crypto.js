const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Crypto utilities
export const util = {

  // Bit-wise rotate left
  rotL: (n, b) => (n << b) | (n >>> (32 - b)),

  // Bit-wise rotate right
  rotR: (n, b) => (n << (32 - b)) | (n >>> b),

  // Swap big-endian to little-endian and vice versa
  endian: (n) => {
    // If number given, swap endian
    if (typeof n === 'number') {
      return util.rotL(n, 8) & 0x00FF00FF | util.rotL(n, 24) & 0xFF00FF00;
    }

    // Else, assume array and swap all items
    return n.map(util.endian);
  },

  // Generate an array of any length of random bytes
  randomBytes: (n) => {
    const bytes = [];
    while (n-- > 0) {
      bytes.push(Math.floor(Math.random() * 256));
    }
    return bytes;
  },

  // Convert a string to a byte array
  stringToBytes: (str) => Array.from(str).map(char => char.charCodeAt(0)),

  // Convert a byte array to a string
  bytesToString: (bytes) => String.fromCharCode(...bytes),

  // Convert a string to big-endian 32-bit words
  stringToWords: (str) => {
    const words = [];
    for (let c = 0, b = 0; c < str.length; c++, b += 8) {
      words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
    }
    return words;
  },

  // Convert a byte array to big-endian 32-bit words
  bytesToWords: (bytes) => {
    const words = [];
    for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
      words[b >>> 5] |= bytes[i] << (24 - b % 32);
    }
    return words;
  },

  // Convert big-endian 32-bit words to a byte array
  wordsToBytes: (words) => {
    const bytes = [];
    for (let b = 0; b < words.length * 32; b += 8) {
      bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
    }
    return bytes;
  },

  // Convert a byte array to a hex string
  bytesToHex: (bytes) => bytes.map(byte => byte.toString(16).padStart(2, '0')).join(''),

  // Convert a hex string to a byte array
  hexToBytes: (hex) => {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  },

  // Convert a byte array to a base-64 string
  bytesToBase64: (bytes) => {
    // Use browser-native function if it exists
    if (typeof btoa === "function") return btoa(util.bytesToString(bytes));

    const base64 = [];
    let overflow;

    for (let i = 0; i < bytes.length; i++) {
      switch (i % 3) {
        case 0:
          base64.push(base64map.charAt(bytes[i] >>> 2));
          overflow = (bytes[i] & 0x3) << 4;
          break;
        case 1:
          base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)));
          overflow = (bytes[i] & 0xF) << 2;
          break;
        case 2:
          base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)));
          base64.push(base64map.charAt(bytes[i] & 0x3F));
          overflow = -1;
      }
    }

    // Encode overflow bits, if there are any
    if (overflow !== undefined && overflow !== -1) base64.push(base64map.charAt(overflow));

    // Add padding
    while (base64.length % 4 !== 0) base64.push("=");

    return base64.join("");
  },

  // Convert a base-64 string to a byte array
  base64ToBytes: (base64) => {
    // Use browser-native function if it exists
    if (typeof atob === "function") return util.stringToBytes(atob(base64));

    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    const bytes = [];

    for (let i = 0; i < base64.length; i++) {
      switch (i % 4) {
        case 1:
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) << 2) | (base64map.indexOf(base64.charAt(i)) >>> 4));
          break;
        case 2:
          bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0xF) << 4) | (base64map.indexOf(base64.charAt(i)) >>> 2));
          break;
        case 3:
          bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0x3) << 6) | base64map.indexOf(base64.charAt(i)));
          break;
      }
    }

    return bytes;
  }
};
