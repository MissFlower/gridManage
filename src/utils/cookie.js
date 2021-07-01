/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 14:20:09
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 18:38:55
 */
import Cookies from 'js-cookie'
import settings from 'src/settings'
const { hasToken } = settings

export function getToken() {
	return Cookies.get(hasToken)
}

export function setToken(token) {
	return Cookies.set(hasToken, token)
}

export function removeToken() {
	return Cookies.remove(hasToken)
}
