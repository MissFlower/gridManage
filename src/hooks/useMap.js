/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 13:26:36
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 19:50:33
 */
import { is } from 'src/utils'
export function useMap(el, options = {}) {
	let mapInstance = null // 地图实例
	let district = null // 行政查询工具实例
	let mouseTool = null // 鼠标工具实例
	const lastPolygons = []

	// 绘制行政区域边界
	function drawAdministrationBoundary(codes, options = {}) {
		if (!is(codes, 'Array')) {
			console.error('Administration Code must be Array')
			return
		}
		if (!district) {
			// 实例化DistrictSearch
			const defaultOptions = {
				subdistrict: 0, // 获取边界不需要返回下级行政区
				extensions: 'all', // 返回行政区边界坐标组等具体信息
				level: 'district' // 查询行政级别为 市
			}
			options = Object.assign({}, defaultOptions, options)
			console.log(options)
			district = new AMap.DistrictSearch(options)
		}
		// 行政区查询
		const districtPromises = codes.map(code => {
			return new Promise(resolve => {
				district.search(code, (status, result) => {
					const polygons = []
					const bounds = result.districtList[0].boundaries
					if (bounds) {
						for (var i = 0, l = bounds.length; i < l; i++) {
							// 生成行政区划polygon
							const polygon = new AMap.Polygon({
								strokeWeight: 1,
								path: bounds[i],
								fillOpacity: 0.3,
								fillColor: '#80d8ff',
								strokeColor: '#0091ea'
							})
							polygons.push(polygon)
						}
					}
					resolve(polygons)
				})
			})
		})
		Promise.all(districtPromises).then(polygons => {
			console.log(polygons)
			// 清除上次结果
			lastPolygons.forEach(polygon => mapInstance.remove(polygon))
			// 添加图形到地图
			polygons.forEach(polygon => mapInstance.add(polygon))
			// 保存图形
			lastPolygons.push(...polygons)
			// 视口自适应
			mapInstance.setFitView()
		})
	}

	// 绘制多边形
	function drawPolygon(options = {}, callback) {
		mouseTool = new AMap.MouseTool(mapInstance)

		const defaultOptions = {
			strokeColor: '#FF33FF',
			strokeWeight: 6,
			strokeOpacity: 0.2,
			fillColor: '#1791fc',
			fillOpacity: 0.4,
			// 线样式还支持 'dashed'
			strokeStyle: 'solid'
			// strokeStyle是dashed时有效
			// strokeDasharray: [30,10],
		}
		options = Object.assign({}, defaultOptions, options)

		mouseTool.polygon(options)
		mouseTool.on('draw', event => {
			// event.obj 为绘制出来的覆盖物对象
			mouseTool.close() // true 参数为true直接删除图形
			callback && callback(event)
		})

		function drawPolygonClickHandle(e) {
			console.log(e)
			mapInstance.off('click', drawPolygonClickHandle)
		}

		mapInstance.on('click', drawPolygonClickHandle)
	}

	// 地图初始化
	function initMap() {
		if (!el) {
			console.error('AMap container div must be exist')
			return
		}
		if (mapInstance) {
			return mapInstance
		}
		const defaultOptions = {
			viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D',
			zoom: 11, // 初始化地图层级
			center: [116.397428, 39.90923] // 初始化地图中心点
		}
		console.log(options)
		options = Object.assign({}, defaultOptions, options)
		console.log(options)
		mapInstance = new AMap.Map(el, options)
	}

	initMap()

	return {
		mapInstance,
		initMap,
		drawAdministrationBoundary,
		drawPolygon
	}
}
