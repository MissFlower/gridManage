/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-01 15:51:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 15:28:05
 */
// 高德多边形字符串转经纬度数据
export function strTransferLngLat(path) {
	return path.split(';').map(lngLat => {
		const [lng, lat] = lngLat.split(',')
		return [+lng, +lat]
	})
}

export const withInstall = (component, alias) => {
	const comp = component
	comp.install = app => {
		app.component(comp.name || comp.displayName, component)
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}
	return component
}
