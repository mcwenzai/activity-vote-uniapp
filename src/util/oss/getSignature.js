import {
	util
} from './crypto.js';

import {
	HMAC
} from './hmac.js';
import {
	SHA1
} from './sha1.js';

function getSignature(policyEncoded, SecretKey) {
	// 利用SK对Base64编码后的policy结果进行HMAC-SHA1签名计算
	const bytes = HMAC(SHA1, policyEncoded, SecretKey, {
		asBytes: true
	});
	// 对计算结果进行Base64编码，得到最终的签名信息
	const signature = util.bytesToBase64(bytes);
	return signature;
}

export {
	getSignature
}
