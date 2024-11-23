import {
	http,
	toast
} from '@/uni_modules/uview-plus'
const requestInterceptors = (vm) => {
	http.interceptors.request.use((config) => {
		config.data = config.data || {};
		// 检查是否有needToken
		if (config.custom?.needToken) {
			const token = uni.getStorageSync('token');
			if (token) {
				config.header.Authorization = `${token}`;
			}
		}
		return config;
	}, (config) => Promise.reject(config));
}
const responseInterceptors = (vm) => {
	/**
	 * 响应拦截
	 * @param {Object} http 
	 */
	http.interceptors.response.use((response) => {
		/* 对响应成功可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom
		if (data.success===false) { // success为fasle，则reject()
			uni.clearStorageSync('token');
			if (custom.toast !== false) {
				toast(data.message)
			}
			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise
				return new Promise(() => {})
			}
		}
		return data
	}, (response) => {
		const res = response.data
		if (res.success === false) {
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
			if (res.exceptionClazz === "AuthException") {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		}
		return Promise.reject(res)
	})
}


export {
	requestInterceptors,
	responseInterceptors
}