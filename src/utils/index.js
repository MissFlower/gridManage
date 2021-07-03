/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-01 15:51:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-03 14:02:26
 */
export function is(val, type) {
	return Object.prototype.toString.call(val).slice(8, -1) === type
}

// 高德多边形字符串转经纬度数据
export function strTransferLngLat(path) {
	console.log(path)
	return path.split(';').map(lngLat => {
		const [lng, lat] = lngLat.split(',')
		return [+lng, +lat]
	})
}
