import { API_CONFIG } from './api.js'
import { http, toast} from '@/uni_modules/uview-plus'


// GET请求
export async function get(apiName, params = {}, config = {}) {
    const api = API_CONFIG[apiName];
    if (!api || !api.url) {
        throw new Error(`API ${apiName} not found.`);
    }
    try {
        const response = await http.get(api.url, {
            params,
            header: api.needToken ? { Authorization: uni.getStorageSync('token') || '' } : {},
			config
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// POST请求
export async function post(apiName, data = {}, config = {}) {
    const api = API_CONFIG[apiName];
    if (!api || !api.url) {
        throw new Error(`API ${apiName} not found.`);
    }
    try {
        const response = await http.post(api.url, data, {
            header: api.needToken ? { Authorization: uni.getStorageSync('token') || '' } : {},
			config
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// put请求
export async function put(apiName,params={},config={}) {
	const api = API_CONFIG[apiName];
	if (!api || !api.url) {
	    throw new Error(`API ${apiName} not found.`);
	}
	try {
	    const response = await http.put(api.url, data, {
	        header: api.needToken ? { Authorization: getApp().globalData.token || '' } : {},
			config
	    });
	    return response.data;
	} catch (error) {
	    throw error;
	}
}