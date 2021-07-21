/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-21 11:22:44
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-21 11:22:55
 */
const projectName = import.meta.env.VITE_GLOB_APP_TITLE

export function warn(message) {
	console.warn(`[${projectName} warn]:${message}`)
}

export function error(message) {
	throw new Error(`[${projectName} error]:${message}`)
}
