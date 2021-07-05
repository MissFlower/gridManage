/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 13:26:36
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-05 20:00:29
 */
import { ref } from 'vue'
import { message } from 'ant-design-vue'
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
	let polyEditor = null // 多边形编辑器实例
	let currentRole = '' // 当前用户角色
	const drawedDistrictPolygons = [] // 已经绘制过的行政区域集合边界数据
	let currentUsedDistrictPolygon = null // 当前绘制图形的行政区域多边形边界数据
	let currentUsedParentPolygon = null // 当前绘制图形的父级多边形边界数据
	let currentUsedGridPolygon = null // 当前绘制图形的多边形边界数据
	const drawedParentPolygons = [] // 已经绘制过的父级网格数据
	const drawedOwnPolygons = [] // 已经绘制过自己的网格数据
	let currentUsedDistrictCode = '' // 当前正在被使用的行政区code
	let currentUsedParentPolygonId = '' // 当前正在被使用的父级多边形ID
	const isEdit = ref(false)

	const accordRoleMethods = {
		[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: {
			judgeMethod: judgePointerBelongToWhichDistrict,
			polygons: drawedDistrictPolygons
		},
		[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: {
			judgeMethod: judgePointerBelongToWhichGrid,
			polygons: drawedParentPolygons
		}
	}

	// 检测坐标点属于哪一个行政区域
	function judgePointerBelongToWhichDistrict(lngLat, polygons, callback) {
		const currentUsedDistrict = polygons.find(({ polygons }) => AMap.GeometryUtil.isPointInRing(lngLat, polygons[0].getPath()))
		if (currentUsedDistrict) {
			// 如果点存在某个行政区域内 则找出该行政区域
			const { code, polygons } = currentUsedDistrict
			currentUsedDistrictCode = code
			currentUsedDistrictPolygon = polygons[0].getPath()
		} else {
			notQualifyGraphHandle(true)
			callback &&
				callback({
					code: 100001,
					message: '当前绘制点不在所属行政区域内，请在指定行政区域内绘制网格！'
				})
		}
	}

	// 检测坐标点属于哪一个网格
	function judgePointerBelongToWhichGrid(lngLat, polygons, callback) {
		const parentPolygon = polygons.find(polygon => AMap.GeometryUtil.isPointInRing(lngLat, polygon.getPath()))
		console.log(parentPolygon)
		if (parentPolygon) {
			// 如果点存在某个行政区域内 则找出该行政区域
			const { districtCode, id } = parentPolygon.getExtData()
			currentUsedDistrictCode = districtCode
			currentUsedParentPolygonId = id
			currentUsedParentPolygon = parentPolygon.getPath()
		} else {
			notQualifyGraphHandle(true)
			callback &&
				callback({
					code: 100001,
					message: '当前绘制点不在所属网格区域内，请在指定网格区域内绘制网格！'
				})
		}
	}

	// 检测绘制图形是否在当前的行政区域或父网格内
	function judgeIsInDistrictOrParentPolygons(currentPolygon, polygons) {
		console.log(currentPolygon)
		console.log(polygons)
		if (!polygons) {
			return true
		}
		// 绘制图形是否在行政区域内
		const isRingInRing = AMap.GeometryUtil.isRingInRing(currentPolygon, polygons)
		return isRingInRing
	}

	// 检测绘制图形和已绘制的图形位置关系 是否存在相交和被包含情况
	function judgePolygonsPositionRelation(currentPolygonObj, drawedPolygons) {
		if (drawedPolygons.length === 0) {
			return false
		}
		const currentPolygon = currentPolygonObj.getPath()
		const currentPolygonArea = +currentPolygonObj.getArea()
		const currentPolygonId = +currentPolygonObj.getExtData().id
		// 从已绘制的多边形排除当前的多边形(处理编辑时与自己对比)
		drawedPolygons = drawedPolygons.filter(drawedPolygon => drawedPolygon.getExtData().id !== currentPolygonId)
		// 获取当前用户同一区域或同一网格下的兄弟网格
		const drawedBrotherGridPolygons = getBrotherGridPolygons(drawedPolygons)
		// 检测是否相交
		const doesRingRingIntersect = !!drawedBrotherGridPolygons.find(drawedPolygon =>
			AMap.GeometryUtil.doesRingRingIntersect(currentPolygon, drawedPolygon.getPath())
		)
		// 检测是否被包含
		const isRingInRing =
			!doesRingRingIntersect &&
			!!drawedBrotherGridPolygons.find(drawedPolygon => {
				if (+drawedPolygon.getExtData().area > currentPolygonArea) {
					return AMap.GeometryUtil.isRingInRing(currentPolygon, drawedPolygon.getPath())
				} else {
					return AMap.GeometryUtil.isRingInRing(drawedPolygon.getPath(), currentPolygon)
				}
			})
		const isRingInRingOrIntersect = doesRingRingIntersect || isRingInRing

		return isRingInRingOrIntersect
	}

	// 检测绘制图形面积
	function judgePolygonsArea(polygon) {
		const polygonsArea = Math.round(polygon.getArea())
		const min = GRID_AREA_TYPE[currentRole].MIN
		const max = GRID_AREA_TYPE[currentRole].MAX
		const isInArea = polygonsArea >= min && polygonsArea <= max

		return {
			isInArea,
			polygonsArea,
			min,
			max
		}
	}

	// 检测碰撞
	function checkCollide(polygon, callback) {
		// 1.检测绘制图形是否在行政区域内
		const currentPolygon = polygon.getPath()
		console.log(currentUsedDistrictPolygon, currentUsedParentPolygon)
		const isRingInRing = judgeIsInDistrictOrParentPolygons(
			currentPolygon,
			currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE ? currentUsedDistrictPolygon : currentUsedParentPolygon
		)
		if (!isRingInRing) {
			const res = {
				code: 10001,
				message: `当前绘制的网格已超出${currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE ? '行政' : '网格'}区域边界！`
			}
			callback && callback(res)
			notQualifyGraphHandle(true)
			return callback ? false : res
		}
		// 2.检测绘制图形和其他同级多边形是否存在相交和包含的关系
		const isRingInRingOrIntersect = judgePolygonsPositionRelation(polygon, drawedOwnPolygons)
		if (isRingInRingOrIntersect) {
			const res = {
				code: 10002,
				message: '当前绘制的网格与同级网格出现相交或包含关系！'
			}
			callback && callback(res)
			notQualifyGraphHandle(true)
			return callback ? false : res
		}
		// 3.检测绘制图形面积是否符合规定面积
		const { isInArea, polygonsArea, min, max } = judgePolygonsArea(polygon)
		if (!isInArea) {
			const res = {
				code: 10002,
				message: `当前绘制的网格面积为${polygonsArea}平方米,不在规定区间${min}-${max}平方米之间！`
			}
			callback && callback(res)
			notQualifyGraphHandle(true)
			return callback ? false : res
		}
		return true
	}

	// 处理不符合图形
	function notQualifyGraphHandle(isDeleteGraph = false) {
		// 关闭绘图工具 true 参数为true直接删除图形
		!polyEditor?.editable && mouseTool.close(isDeleteGraph)
		// 地图设置鼠标样式为default
		mapInstance.setDefaultCursor('default')
	}

	// 获取当前用户同一区域或同一网格下的兄弟网格(优化对比数据)
	function getBrotherGridPolygons(drawedPolygons) {
		if (currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
			// 如果当前用户角色是ORGANZITION_ADMIN_ROLE 找当前所在的行政区域下的所有被绘制过的多边形
			drawedPolygons = drawedPolygons.filter(polygon => +polygon.getExtData().districtCode === +currentUsedDistrictCode)
		} else if (currentRole === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
			// 如果当前用户角色是BD_ADMIN_ROLE 找当前所在父级网格下的所有被绘制过的多边形
			drawedPolygons = drawedPolygons.filter(polygon => polygon.getExtData().parentId === currentUsedParentPolygonId)
		}
		return drawedPolygons
	}

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
			drawedDistrictPolygons.forEach(({ polygons }) => mapInstance.remove(polygons))
			// 添加图形到地图
			polygons.forEach(({ polygons }) => mapInstance.add(polygons))
			// 保存图形
			drawedDistrictPolygons.push(...polygons)
			// 视口自适应
			mapInstance.setFitView()
		})
	}

	// 绘制多边形(根据后端数据绘制多边形)
	function renderPolygons(grids, options = {}) {
		console.log(grids)
		drawedParentPolygons.length = 0
		drawedOwnPolygons.length = 0
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

			// 当前用户角色下得多边形绑定事件
			if (role === currentRole) {
				bindEvent(polygon)
			}

			mapInstance.add(polygon)
		})

		function bindEvent(polygon) {
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
				console.log(123)
				polygon.setOptions({
					fillOpacity: polygon.getOptions().fillOpacity >= 1 ? 0.5 : 1
				})
				// 设置当前使用的多边形
				currentUsedGridPolygon = polygon
				const { judgeMethod, polygons } = accordRoleMethods[currentRole]
				const { lng, lat } = polygon.getPath()[0]
				// 检测坐标点属于哪一个行政区或父网格
				judgeMethod([lng, lat], polygons)
			})
		}
	}

	// 绘制多边形(用户手动绘制)
	function drawPolygon(options = {}, callback) {
		if (is(arguments[0], 'Function')) {
			callback = arguments[0]
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

			mapInstance.off('click', drawPolygonClickHandle)
			judgeMethod([lng, lat], polygons, callback)
		}

		// 绘制完成事件处理
		function drawendHandle(event) {
			// 1.检测碰撞
			const checkResult = checkCollide(event.obj, callback)
			if (!checkResult) {
				return
			}
			// 2.处理不符合图形
			notQualifyGraphHandle()
			// 3.将绘制好的多边形设置为当前正在被使用的多边形
			currentUsedGridPolygon = event.obj
			// 4.调用回调函数
			callback &&
				callback({
					code: 200,
					data: {
						lngLat: currentUsedGridPolygon.toString(),
						districtCode: currentUsedDistrictCode,
						polygonsArea: Math.round(currentUsedGridPolygon.getArea())
					}
				})
		}

		mouseTool.on('draw', drawendHandle)
		mapInstance.on('click', drawPolygonClickHandle)
	}

	// 开启多边形编辑器
	function openPolyEditor(isOpenAdsorb = true, options = {}) {
		if (!currentUsedGridPolygon) {
			message.warn('请先选择要编辑的网格！')
			return
		}
		const defaultOptions = {
			editOptions: {
				cursor: 'pointer',
				fillColor: '#ccebc5',
				strokeOpacity: 1,
				fillOpacity: 0.5,
				strokeColor: '#2b8cbe',
				strokeWeight: 1
			},
			controlPoint: {
				radius: 4
			},
			midControlPoint: {
				radius: 4
			}
		}
		options = Object.assign({}, defaultOptions, options)
		polyEditor = new AMap.PolygonEditor(mapInstance, currentUsedGridPolygon, options)
		if (isOpenAdsorb) {
			// 获取当前用户同一区域或同一网格下的兄弟网格
			const drawedBrotherGridPolygons = getBrotherGridPolygons(drawedOwnPolygons)
			// 将兄弟网格添加到吸附网格中
			polyEditor.addAdsorbPolygons(drawedBrotherGridPolygons)
		}
		polyEditor.open()
		isEdit.value = polyEditor.editable
	}

	// 关闭多边形编辑器
	function closePolyEditor() {
		polyEditor.close()
		isEdit.value = polyEditor.editable
	}

	// 获取当前多边形的信息
	function getPolygonInfo() {
		// 1.检测碰撞
		const checkResult = checkCollide(currentUsedGridPolygon)
		console.log(checkResult)
		if (!checkResult) {
			return
		}
		if (checkResult?.code && checkResult?.code !== 200) {
			return checkResult
		}
		// 2.关闭编辑工具
		closePolyEditor()
		// 3.返回多边形数据
		return {
			code: 200,
			data: {
				lngLat: currentUsedGridPolygon.toString(),
				id: currentUsedGridPolygon.getExtData()?.id,
				districtCode: currentUsedDistrictCode,
				polygonsArea: Math.round(currentUsedGridPolygon.getArea())
			}
		}
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
		isEdit,
		initMap,
		drawAdministrationBoundary,
		drawPolygon,
		renderPolygons,
		openPolyEditor,
		closePolyEditor,
		getPolygonInfo
	}
}
