/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 14:20:09
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-26 15:40:12
 */
import Cookies from 'js-cookie'
import settings from 'src/settings'
const { tokenKey } = settings

export function getToken() {
	return Cookies.get(tokenKey)
}

export function setToken(token) {
	return Cookies.set(tokenKey, token)
}

export function removeToken() {
	return Cookies.remove(tokenKey)
}
