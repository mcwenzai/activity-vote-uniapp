import {
	Base64
} from './base64.js';
import {
	util
} from './crypto.js';
import {
	HMAC
} from './hmac.js';
import {
	SHA1
} from './sha1.js';

class AliOSS {
	constructor(config) {
		this.url = 'https://hn-vote.oss-cn-wuhan-lr.aliyuncs.com/';
		this.accessKeyId = config.accessKeyId || '';
		this.accessKeySecret = config.accessKeySecret || '';
		this.securityToken = config.securityToken || '';

		const policyText = {
			"expiration": config.expiration,
			"conditions": [
				["content-length-range", 0, 209715200]
			]
		}
		this.policy = Base64.encode(JSON.stringify(policyText));
	}

	async ossUpload(filePath, name, dir, onProgressCallback) {
		const key = dir + this.random_string(10) + this.get_suffix(name);
		const bytes = HMAC(SHA1, this.policy, this.accessKeySecret, {
			asBytes: true
		});
		const signature = util.bytesToBase64(bytes);
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: this.url,
				filePath: filePath,
				name: 'file',
				formData: {
					name,
					key,
					policy: this.policy,
					OSSAccessKeyId: this.accessKeyId,
					success_action_status: '200',
					signature,
					'x-oss-security-token': this.securityToken
				},
				success: (res) => {
					resolve({
						success: true,
						data: this.url + key
					});
				},
				fail: () => {
					reject({
						success: false,
						data: '上传失败'
					});
				}
			});
			uploadTask.onProgressUpdate((res) => {
				onProgressCallback(res.progress);
			});
		});
	}

	random_string(len) {
		const strLength = len || 32;
		const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		const maxPos = chars.length;
		let pwd = '';
		for (let i = 0; i < strLength; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}

	get_suffix(filename) {
		const pos = filename.lastIndexOf('.');
		let suffix = '';
		if (pos != -1) {
			suffix = filename.substring(pos);
		}
		return suffix;
	}
}

export default AliOSS;