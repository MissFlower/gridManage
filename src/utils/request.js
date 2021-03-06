/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-25 13:47:47
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-13 11:20:53
 */
import axios from 'axios'
import qs from 'qs'
import { store } from 'src/store'
import { router } from 'src/router'
import { message, Modal } from 'ant-design-vue'
import { getToken, removeToken } from 'src/utils/cookie'
import { UPDATE_REQUEST_COUNT } from 'src/store/modules/common/types'
import { addRequest, removeRequest } from './cancelRequest'

// 请求超时时间
const TIMEOUT = 100000
const BASE_URL = import.meta.env.VITE_GLOB_API_URL
// const BASE_URL = import.meta.env.VITE_GLOB_LOCAL_URL_BSD
// const BASE_URL = import.meta.env.VITE_GLOB_LOCAL_URL_LHQ
// const BASE_URL = import.meta.env.VITE_GLOB_LOCAL_URL_HW

const http = axios.create({
	baseURL: BASE_URL,
	timeout: TIMEOUT,
	headers: {
		common: {
			'X-Requested-with': 'XMLHttpRequest'
		},
		post: {
			'Content-Type': 'application/json; charset=UTF-8'
		}
	},
	loading: true,
	showMessage: true,
	cancelRequest: false
})

// http 请求拦截
http.interceptors.request.use(
	config => {
		if (config.cancelRequest) {
			removeRequest(config)
			addRequest(config)
		}

		if (config.loading) {
			store.commit(UPDATE_REQUEST_COUNT, 1)
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// http 相应拦截器
http.interceptors.response.use(
	response => {
		const result = response.data
		let data = null

		if (response.config.cancelRequest) {
			removeRequest(response.config)
		}

		if (response.config.loading) {
			store.commit(UPDATE_REQUEST_COUNT, -1)
		}

		// 处理流文件
		if (response.request.responseType === 'blob') {
			data = response
		}

		// 请求失败
		if (result?.code !== 0) {
			const msg = result.msg || '服务器内部错误!'
			if (response.config.showMessage) {
				message.error(`${msg}`)
			}
			// throw new Error(msg)
			return Promise.reject(msg)
		}

		// 请求成功
		return result.data || data
	},
	error => {
		if (error.config.loading) {
			store.commit(UPDATE_REQUEST_COUNT, -1)
		}

		if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
			message.error('当前网络不佳,请检查你的网络!')
			return
		}

		// TODO 统一处理全部的错误代码
		if (error.response) {
			switch (error.response.status) {
				case 401:
					if (!getToken()) {
						return Promise.reject(error.response)
					}
					removeToken()

					Modal.warning({
						title: '该账号登录已过期，请重新登录!',
						centered: true,
						okText: '重新登录',
						onOk: () => {
							router.push(`/login?redirect=${window.location.hash.slice(1)}`)
						}
					})
					break

				case 403:
					// 无权限
					router.push('/system/403')
					// message.warning(`${error.response.data.msg || '操作暂无权限!'}`)
					break

				case 500:
					message.error(`${error.response.data.msg || '服务器内部故障!'}`)
					break
				default:
			}
		}
		return Promise.reject(error)
	}
)

const request = {}
request.postByFormData = (url, data, config) => {
	return http({
		url,
		method: 'post',
		data: qs.stringify(data),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data'
		},
		...config
	})
}

request.post2Upload = (url, data, config) => {
	return http({
		url,
		method: 'post',
		data,
		headers: {
			'Content-Type': 'charset=UTF-8; multipart/form-data'
		},
		...config
	})
}

request.postByURL = (url, params, config) => {
	return http({
		url,
		method: 'post',
		params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		...config
	})
}

request.postByBodyAndURL = (url, { data, params }, config) => {
	return http({
		url,
		method: 'post',
		data: qs.stringify(data),
		params,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		...config
	})
}
;['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
	if (method === 'get' || method === 'delete') {
		request[method] = (url, params, config) => {
			return http({
				url,
				params,
				method,
				...config
			})
		}
		return
	}

	request[method] = (url, data, config) => {
		return http({
			url,
			method,
			data,
			...config
		})
	}
})

export default request
