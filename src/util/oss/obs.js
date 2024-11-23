// 引入配置文件
import {
	config
} from './config.js';

// 引入policy编码计算方法

import {
	getPolicyEncode
} from './getPolicy.js';
// 引入签名计算方法
import {
	getSignature
} from './getSignature.js';

async function OBSupload(filePath, fileName, onProgressCallback) {
	if (!filePath) {
		uni.showToast({
			title: 'Invalid filePath',
			icon: 'Please re-select path',
		});
	} else {
		const OBSPolicy = { // 设定policy内容，policy规则定义可参考步骤3中的超链接签名计算规则文档
			"expiration": "2024-12-31T12:00:00.000Z",
			"conditions": [{
					"bucket": "testbut"
				}, // 桶名要和配置文件中endpoint中的桶名保持一致
				// { "x-obs-security-token": config.SecurityToken } // 如果是临时访问秘钥鉴权，必须设置该值
				{
					'key': fileName
				}
			]
		}
		const policyEncoded = getPolicyEncode(OBSPolicy); // 计算base64编码后的policy
		const signature = getSignature(policyEncoded, config.SecretKey); // 计算signature
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: config.EndPoint,
				filePath: filePath,
				name: 'file',
				header: {
					'content-type': 'multipart/form-data; boundary=-9431149156168',
				},
				formData: {
					// 从配置文件中获取到的AK信息、计算得到的编码后policy及signature信息
					'AccessKeyID': config.AccessKeyId,
					'policy': policyEncoded,
					'signature': signature,
					'key': fileName,
					// "x-obs-security-token": config.SecurityToken // 如果是临时访问秘钥鉴权，必须设置该值
				},

				success: function(res) {
					console.log(res.statusCode); //打印响应状态码
					if (res.statusCode == '204') {
						resolve({
							success: true,
							data: filePath
						});
					} else {
						reject({
							success: false,
							data: '上传失败'
						});
					}
				},
				fail: function(e) {
					console.log(e);
				},
			});
			uploadTask.onProgressUpdate((res) => {
				onProgressCallback(res.progress);
			});
		});

	}
}

export default OBSupload