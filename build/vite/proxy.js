/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:46:48
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:50:55
 */
/**
 * 生成proxy
 * @param list
 */
const httpsRE = /^https:\/\//
export function createProxy(list = []) {
	const ret = {}
	for (const [prefix, target] of list) {
		const isHttps = httpsRE.test(target)

		ret[prefix] = {
			target,
			changeOrigin: true,
			ws: true,
			rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
			// https is require secure=false
			...(isHttps ? { secure: false } : {})
		}
	}
	return ret
}
