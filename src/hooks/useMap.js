/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 13:26:36
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-03 17:28:02
 */
import { is } from 'src/utils'
import { ADMIN_ROLE_TYPE, GRID_AREA_TYPE } from 'src/common/constant'
const rolezIndex = {
	[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: 100,
	[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: 1000
}

export function useMap(el, options = {}) {
	let mapInstance = null // 地图实例
	let district = null // 行政查询工具实例
	let mouseTool = null // 鼠标工具实例
	let currentRole = '' // 当前用户角色
	const lastDistrictPolygons = [] // 行政区域集合边界数据
	const lastGridPolygons = [] // 多边形区域集合边界数据
	let currentUsedDistrictPolygons = null // 当前绘制图形的行政区域边界数据
	const currentUsedGridPolygons = null // 当前绘制图形的多边形边界数据
	let drawedParentPolygons = [] // 已经绘制过的父级网格数据
	let drawedOwnPolygons = [] // 已经绘制过自己的网格数据

	// 绘制行政区域边界
	function drawAdministrationBoundary(districtCodes, options = {}, role) {
		if (!is(districtCodes, 'Array')) {
			console.error('Administration Code must be Array')
			return
		}
		// 赋值用户角色
		currentRole = role
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
		// 行政区查询 绘制行政区域边界
		const districtPromises = districtCodes.map(code => {
			return new Promise(resolve => {
				district.search(code, (status, result) => {
					const polygonsData = {
						code,
						polygons: []
					}
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
							polygonsData.polygons.push(polygon)
						}
					}
					resolve(polygonsData)
				})
			})
		})
		Promise.all(districtPromises).then(polygons => {
			// 清除上次结果
			lastDistrictPolygons.forEach(({ polygons }) => mapInstance.remove(polygons))
			// 添加图形到地图
			polygons.forEach(({ polygons }) => mapInstance.add(polygons))
			// 保存图形
			lastDistrictPolygons.push(...polygons)
			// 视口自适应
			mapInstance.setFitView()
		})
	}

	// 绘制多边形(根据后端数据绘制多边形)
	function renderPolygons(grids, options = {}) {
		console.log(grids)
		drawedParentPolygons = []
		drawedOwnPolygons = []
		const defaultOptions = {
			cursor: 'pointer',
			fillColor: '#ccebc5',
			strokeOpacity: 1,
			fillOpacity: 0.5,
			strokeColor: '#2b8cbe',
			strokeWeight: 1,
			strokeStyle: 'dashed',
			strokeDasharray: [5, 5]
		}
		options = Object.assign({}, defaultOptions, options)
		grids.forEach(({ path, role, ...rest }) => {
			const polygon = new AMap.Polygon({
				path,
				zIndex: rolezIndex[role],
				extData: {
					role,
					...rest
				},
				...options
			})

			polygon.on('mouseover', () => {
				polygon.setOptions({
					cursor: 'pointer',
					strokeColor: '#f00'
				})
			})

			polygon.on('mouseout', () => {
				polygon.setOptions({
					cursor: 'default',
					strokeColor: '#2b8cbe'
				})
			})

			polygon.on('click', () => {
				polygon.setOptions({
					fillOpacity: polygon.getOptions().fillOpacity >= 1 ? 0.5 : 1
				})
			})

			mapInstance.add(polygon)

			// 收集父级图形和自己的图形数据
			if (currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
				drawedOwnPolygons.push(polygon)
			} else if (currentRole === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
				if (role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
					drawedParentPolygons.push(polygon)
				} else if (role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
					drawedOwnPolygons.push(polygon)
				}
			}
		})
	}

	// 绘制多边形(用户手动绘制)
	function drawPolygon(options = {}, callback) {
		if (is(arguments[0], 'Function')) {
			callback = arguments[0]
		}
		let currentUsedDistrictCode = '' // 当前正在被使用的行政区code
		const currentUsedParentGridId = '' // 当前正在被使用的父网格ID
		const accordRoleMethods = {
			[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: {
				judgeMethod: judgePointerBelongToWhichDistrict,
				polygons: lastDistrictPolygons
			},
			[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: {
				judgeMethod: judgePointerBelongToWhichGrid,
				polygons: lastGridPolygons
			}
		}
		// 创建绘图工具
		mouseTool = new AMap.MouseTool(mapInstance)
		const defaultOptions = {
			strokeColor: '#FF33FF',
			strokeWeight: 1,
			strokeOpacity: 0.2,
			fillColor: '#1791fc',
			fillOpacity: 0.4,
			// 线样式还支持 'dashed'
			strokeStyle: 'solid',
			zIndex: rolezIndex[currentRole]
			// strokeStyle是dashed时有效
			// strokeDasharray: [30,10],
		}
		options = Object.assign({}, defaultOptions, options)
		mouseTool.polygon(options)

		// 地图设置鼠标样式为crosshair
		mapInstance.setDefaultCursor('crosshair')

		// 获取多边形的第一个顶点坐标
		function drawPolygonClickHandle(e) {
			const { lng, lat } = e.lnglat

			const { judgeMethod, polygons } = accordRoleMethods[currentRole]
			judgeMethod([lng, lat], polygons)

			mapInstance.off('click', drawPolygonClickHandle)
		}

		// 判断坐标点属于哪一个行政区域
		function judgePointerBelongToWhichDistrict(lngLat, polygons) {
			const currentUsedDistrict = polygons.find(({ polygons }) => AMap.GeometryUtil.isPointInRing(lngLat, polygons[0].getPath()))
			if (currentUsedDistrict) {
				// 如果点存在某个行政区域内 则找出该行政区域
				const { code, polygons } = currentUsedDistrict
				currentUsedDistrictCode = code
				currentUsedDistrictPolygons = polygons[0].getPath()
			} else {
				notQualifyGraphHandle(true)
				invokeCallBack(null, {
					code: 10001,
					message: '当前绘制点不在所属行政区域内，请在指定行政区域内绘制网格！'
				})
			}
		}

		// 判断坐标点属于哪一个网格
		function judgePointerBelongToWhichGrid(lngLat, polygons) {
			console.log(lngLat, polygons)
		}

		// 判断绘制图形是否在当前的行政区域内
		function judgeIsInDistrictPolygons(currentPolygons, districtPolygons) {
			// 绘制图形是否在行政区域内
			const isRingInRing = AMap.GeometryUtil.isRingInRing(currentPolygons, districtPolygons)
			if (!isRingInRing) {
				notQualifyGraphHandle(true)
				invokeCallBack(null, {
					code: 10002,
					message: '当前绘制的网格已超出行政区域边界！'
				})
			}
			return isRingInRing
		}

		// 判断绘制图形和已绘制的图形位置关系 是否存在相交和被包含情况
		function judgePolygonsPositionRelation(currentPolygonObj, drawedPolygons) {
			const currentPolygon = currentPolygonObj.getPath()
			const currentPolygonArea = +currentPolygonObj.getArea()
			if (currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
				// 如果当前用户角色是ORGANZITION_ADMIN_ROLE 找当前所在的行政区域下的所有被绘制过的多边形
				drawedPolygons = drawedPolygons.filter(polygon => +polygon.getExtData().districtCode === +currentUsedDistrictCode)
			} else if (currentRole === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
				// 如果当前用户角色是BD_ADMIN_ROLE 找当前所在父级网格下的所有被绘制过的多边形
				drawedPolygons = drawedPolygons.filter(polygon => polygon.getExtData().parentId === currentUsedParentGridId)
			}
			// 判断是否相交
			const doesRingRingIntersect = !!drawedPolygons.find(drawedPolygon =>
				AMap.GeometryUtil.doesRingRingIntersect(currentPolygon, drawedPolygon.getPath())
			)
			// 判断是否被包含
			const isRingInRing =
				!doesRingRingIntersect &&
				!!drawedPolygons.find(drawedPolygon => {
					if (+drawedPolygon.getExtData().area > currentPolygonArea) {
						return AMap.GeometryUtil.isRingInRing(currentPolygon, drawedPolygon.getPath())
					} else {
						return AMap.GeometryUtil.isRingInRing(drawedPolygon.getPath(), currentPolygon)
					}
				})
			const isRingInRingOrIntersect = doesRingRingIntersect || isRingInRing

			if (isRingInRingOrIntersect) {
				notQualifyGraphHandle(true)
				invokeCallBack(null, {
					code: 10003,
					message: '当前绘制的网格与同级网格出现相交或包含关系！'
				})
			}
			return isRingInRingOrIntersect
		}

		// 获取绘制图形面积
		function judgePolygonsArea(event) {
			const polygonsArea = Math.round(event.obj.getArea())
			const min = GRID_AREA_TYPE[currentRole].MIN
			const max = GRID_AREA_TYPE[currentRole].MAX
			const isInArea = polygonsArea >= min && polygonsArea <= max
			if (!isInArea) {
				notQualifyGraphHandle(true)
				invokeCallBack(null, {
					code: 10004,
					message: `当前绘制的网格面积为${polygonsArea}平方米,不在规定区间${min}-${max}平方米之间！`
				})
			}
			return {
				isInArea,
				polygonsArea
			}
		}

		// 绘制完成事件处理
		function drawendHandle(event) {
			const currentPolygons = event.obj.getPath()
			// 1.判断绘制图形是否在行政区域内
			const isRingInRing = judgeIsInDistrictPolygons(currentPolygons, currentUsedDistrictPolygons)
			if (!isRingInRing) {
				return
			}
			// 2.判断绘制图形和其他同级多边形是否存在相交和包含的关系
			const isRingInRingOrIntersect = judgePolygonsPositionRelation(event.obj, drawedOwnPolygons)
			if (isRingInRingOrIntersect) {
				return
			}
			// 3.获取绘制图形面积
			const { isInArea, polygonsArea } = judgePolygonsArea(event)
			if (!isInArea) {
				return
			}
			notQualifyGraphHandle()
			// event.obj 为绘制出来的覆盖物对象
			invokeCallBack(event, {
				code: 200,
				data: {
					districtCode: currentUsedDistrictCode,
					polygonsArea
				}
			})
		}

		// 处理不符合图形
		function notQualifyGraphHandle(isDeleteGraph = false) {
			// 关闭绘图工具 true 参数为true直接删除图形
			mouseTool.close(isDeleteGraph)
			// 地图设置鼠标样式为default
			mapInstance.setDefaultCursor('default')
		}

		// 调用回调函数
		function invokeCallBack(event = null, data) {
			callback && callback(event, data)
		}

		mouseTool.on('draw', drawendHandle)
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
		options = Object.assign({}, defaultOptions, options)
		console.log(options)
		mapInstance = new AMap.Map(el, options)
	}

	initMap()

	return {
		mapInstance,
		initMap,
		drawAdministrationBoundary,
		drawPolygon,
		renderPolygons
	}
}
