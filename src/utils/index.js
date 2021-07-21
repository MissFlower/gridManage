/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-01 15:51:26
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-21 11:20:15
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

export function openWindow(url, opt) {
	const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
	const feature = []

	noopener && feature.push('noopener=yes')
	noreferrer && feature.push('noreferrer=yes')

	window.open(url, target, feature.join(','))
}
