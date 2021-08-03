/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 13:26:36
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-03 15:31:24
 */
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { is, isSupportCanvas } from 'src/utils/is'
import { ADMIN_ROLE_TYPE, GRID_AREA_TYPE, MARKER_TYPE_ICON } from 'src/common/constant'
const rolezIndex = {
	[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: 100,
	[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: 101
}
const PARENT_GRID_OPACITY = 0.2
const OWN_GRID_OPACITY_DEFAULT = 0.4
const OWN_GRID_OPACITY_CHECKED = 0.6
const POLYGON_MAX_DRAWED_COORDINATE_AMOUNT = 50 // 图形绘制最大坐标数量
export function useMap(el, options = {}) {
	let mapInstance = null // 地图实例
	let district = null // 行政查询工具实例
	let mouseTool = null // 鼠标工具实例
	let polyEditor = null // 多边形编辑器实例
	let heatmap = null // 热力图实例
	let currentRole = '' // 当前用户角色
	const drawedDistrictPolygons = [] // 已经绘制过的行政区域集合边界数据
	let currentUsedDistrictPolygon = null // 当前绘制图形的行政区域多边形边界数据
	let currentUsedParentPolygon = null // 当前绘制图形的父级多边形边界数据
	let currentUsedGridPolygon = null // 当前绘制图形的多边形边界数据
	const drawedParentPolygons = [] // 已经绘制过的父级网格数据
	const drawedOwnPolygons = [] // 已经绘制过自己的网格数据
	const drawedChildrenPolygons = [] // 已经绘制过子集的网格数据
	let currentUsedDistrictCode = '' // 当前正在被使用的行政区code
	let currentUsedParentPolygonId = '' // 当前正在被使用的父级多边形ID
	const isEdit = ref(false) // 是否正在编辑
	let markers = [] // 存储marker点
	let markerClickFn = () => {}
	let textMarkers = [] // 存储文本标记
	let isFirst = true

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

	// 设置当前角色
	function setRole(role) {
		// 赋值用户角色
		currentRole = role
	}

	// 检测坐标点属于哪一个行政区域
	function judgePointerBelongToWhichDistrict(lngLat, polygons, callback) {
		const currentUsedDistrict = polygons.find(({ polygons }) => AMap.GeometryUtil.isPointInRing(lngLat, polygons[0].getPath()))
		if (currentUsedDistrict) {
			// 如果点存在某个行政区域内 则找出该行政区域
			const { code, polygons } = currentUsedDistrict
			currentUsedDistrictCode = code
			currentUsedDistrictPolygon = polygons[0]
		} else {
			resetToolStatus(true)
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
			console.log(districtCode)
			currentUsedDistrictCode = districtCode
			currentUsedParentPolygonId = id
			currentUsedParentPolygon = parentPolygon
		} else {
			resetToolStatus(true)
			callback &&
				callback({
					code: 100001,
					message: '当前绘制点不在所属网格区域内，请在指定网格区域内绘制网格！'
				})
		}
	}

	// 获取当前用户同一区域或同一网格下的兄弟网格(优化对比数据)
	function getBrotherGridPolygons(drawedPolygons) {
		if (currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
			// 如果当前用户角色是ORGANZITION_ADMIN_ROLE 找当前所在的行政区域下的所有被绘制过的多边形
			drawedPolygons = drawedPolygons.filter(polygon => +polygon.getExtData().districtCode === +currentUsedDistrictCode)
		} else if (currentRole === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
			// 如果当前用户角色是BD_ADMIN_ROLE 找当前所在父级网格下的所有被绘制过的多边形
			drawedPolygons = drawedPolygons.filter(polygon => polygon.getExtData().pid === currentUsedParentPolygonId)
		}
		return drawedPolygons
	}

	// 检测父子两个图形的位置关系
	function judgePolygonRelation(polygon1, polygon2) {
		console.log(polygon1, polygon2)
		if (!polygon2) {
			return true
		}
		const polygon1Path = polygon1.getPath()
		const polygon2Path = polygon2.getPath()

		// 绘制图形是否和行政区域相交
		let doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon1Path, polygon2Path)
		console.log('相交', doesRingRingIntersect)
		// 如果相交 判断相交的面积和当前绘制图形面积是否一样 一样则不认为是相交
		if (doesRingRingIntersect) {
			const ringRingClip = AMap.GeometryUtil.ringRingClip(polygon1Path, polygon2Path)
			const ringArea = Math.floor(AMap.GeometryUtil.ringArea(ringRingClip))
			console.log(ringArea, Math.floor(polygon1.getArea()))
			// true 相交 false 不相交
			doesRingRingIntersect = ringArea < Math.floor(polygon1.getArea())
		}
		// 绘制图形是否在行政区域内
		let isRingInRing = true
		// console.log('绘制图形是否在行政区域内', isRingInRing)
		if (!doesRingRingIntersect) {
			isRingInRing = !AMap.GeometryUtil.isRingInRing(polygon1Path, polygon2Path)
		}
		return doesRingRingIntersect || isRingInRing
	}

	function judgeBrotherPolygonRelation(polygon1, polygon2) {
		const polygon1Path = polygon1.getPath()
		const polygon2Path = polygon2.getPath()
		const isRingInRing = AMap.GeometryUtil.isRingInRing(polygon1Path, polygon2Path)
		console.log('brother', isRingInRing)
		let doesRingRingIntersect = true
		if (!isRingInRing) {
			// 判断两个图形是否相交
			doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon1Path, polygon2Path)
			// 如果相交 判断相交的面积和当前绘制图形面积是否一样 一样则不认为是相交
			if (doesRingRingIntersect) {
				const ringRingClip = AMap.GeometryUtil.ringRingClip(polygon1Path, polygon2Path)
				const ringArea = Math.floor(AMap.GeometryUtil.ringArea(ringRingClip))
				console.log(ringArea)
				doesRingRingIntersect = !!ringArea
			}
		}
		console.log(isRingInRing || doesRingRingIntersect)
		return isRingInRing || doesRingRingIntersect
	}

	// 检测绘制图形和同一行政区域或父网格下兄弟图形位置关系 是否存在相交和被包含情况
	function judgePolygonsPositionRelation(currentPolygon, drawedPolygons) {
		if (drawedPolygons.length === 0) {
			return false
		}
		// const currentPolygon = currentPolygonObj.getPath()
		const currentPolygonArea = +currentPolygon.getArea()
		const currentPolygonId = +currentPolygon.getExtData().id
		// 从已绘制的多边形排除当前的多边形(处理编辑时与自己对比)
		drawedPolygons = drawedPolygons.filter(drawedPolygon => drawedPolygon.getExtData().id !== currentPolygonId)
		// 获取当前用户同一区域或同一网格下的兄弟网格
		const drawedBrotherGridPolygons = getBrotherGridPolygons(drawedPolygons)
		// 检测是否被包含或相交
		const isRingInRingOrIntersect = !!drawedBrotherGridPolygons.find(drawedPolygon => {
			if (+drawedPolygon.getExtData().gridArea > currentPolygonArea) {
				return judgeBrotherPolygonRelation(currentPolygon, drawedPolygon)
			} else {
				return judgeBrotherPolygonRelation(drawedPolygon, currentPolygon)
			}
		})

		return isRingInRingOrIntersect
	}

	// 检测绘制图形面积
	function judgePolygonArea(polygon) {
		const polygonArea = Math.round(polygon.getArea())
		const min = GRID_AREA_TYPE[currentRole].MIN
		const max = GRID_AREA_TYPE[currentRole].MAX
		const isInArea = polygonArea >= min && polygonArea <= max

		return {
			isInArea,
			polygonArea,
			min,
			max
		}
	}

	// 检测绘制图形坐标数量
	function judgePolygonCoordinateAmount(polygon) {
		const polygonPaths = polygon.getPath()
		return polygonPaths.length > POLYGON_MAX_DRAWED_COORDINATE_AMOUNT
	}

	// 检测碰撞
	function checkCollide(polygon, callback) {
		// 1.检测网格关系 true相交 false不相交
		const isRingInRingOrIntersectWithDistrictOrParent = judgePolygonRelation(
			polygon,
			currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE ? currentUsedDistrictPolygon : currentUsedParentPolygon
		)
		if (isRingInRingOrIntersectWithDistrictOrParent) {
			const res = {
				code: 10001,
				message: `当前绘制的网格已超出${currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE ? '行政' : '网格'}区域边界！`
			}
			callback && callback(res)
			resetToolStatus(true)
			return callback ? false : res
		}
		// 2.检测绘制图形和其他同级多边形是否存在相交和包含的关系
		const isRingInRingOrIntersectWithOther = judgePolygonsPositionRelation(polygon, drawedOwnPolygons)
		if (isRingInRingOrIntersectWithOther) {
			const res = {
				code: 10002,
				message: '当前绘制的网格与同级网格出现相交或包含关系！'
			}
			callback && callback(res)
			resetToolStatus(true)
			return callback ? false : res
		}
		// 3.检测绘制图形面积是否符合规定面积
		const { isInArea, polygonArea, min, max } = judgePolygonArea(polygon)
		if (!isInArea) {
			const res = {
				code: 10003,
				message: `当前绘制的网格面积为${(polygonArea / 1000000).toFixed(2)}平方千米,不在规定区间${min / 1000000}-${max / 1000000}平方千米之间！`
			}
			callback && callback(res)
			resetToolStatus(true)
			return callback ? false : res
		}
		// 4.检测绘制图形坐标数量
		const isOverMaxAmount = judgePolygonCoordinateAmount(polygon)
		if (isOverMaxAmount) {
			const res = {
				code: 10004,
				message: `当前绘制的网格坐标点已超出最大数量${POLYGON_MAX_DRAWED_COORDINATE_AMOUNT}个！`
			}
			callback && callback(res)
			resetToolStatus(true)
			return callback ? false : res
		}
		return true
	}

	// 重置网格样式
	function resetGridStyle(polygons) {
		polygons = polygons || drawedOwnPolygons
		polygons.forEach(polygon => {
			polygon.setOptions({
				fillOpacity: OWN_GRID_OPACITY_DEFAULT
			})
			polygon.setExtData({
				...polygon.getExtData(),
				isChecked: false
			})
		})
	}

	// 处理不符合图形
	function resetToolStatus(isDeleteGraph = false) {
		// 关闭绘图工具 true 参数为true直接删除图形
		polyEditor?.editable && polyEditor.close()
		isEdit.value = false
		mouseTool && mouseTool.close(isDeleteGraph)
		// 地图设置鼠标样式为default
		mapInstance.setDefaultCursor('default')
	}

	// 自己多边形鼠标移入事件处理函数
	function ownPolygonMouseoverHandle(e, polygon) {
		polygon = polygon || this
		polygon.setOptions({
			cursor: 'pointer',
			fillOpacity: OWN_GRID_OPACITY_CHECKED
		})
	}

	// 自己多边形鼠标移出事件处理函数
	function ownPolygonMouseoutHandle() {
		if (!this.getExtData().isChecked) {
			this.setOptions({
				cursor: 'default',
				fillOpacity: OWN_GRID_OPACITY_DEFAULT
			})
		}
	}

	// 自己多边形点击事件处理函数
	function ownPolygonClickHandle(e, polygon) {
		polygon = polygon || this
		const extData = polygon.getExtData()
		const { isChecked, callback } = extData
		const { role, isDispatchGrid } = extData.state
		// 重置网格样式
		// 如果当前用户不是BD_ADMIN_ROLE或者是BD_ADMIN_ROLE没有在分配网格需要重置样式
		if (role !== ADMIN_ROLE_TYPE.BD_ADMIN_ROLE || !isDispatchGrid) {
			resetGridStyle()
		}
		// 设置当前使用的多边形和透明度
		if (!isChecked) {
			polygon.setOptions({
				fillOpacity: OWN_GRID_OPACITY_CHECKED
			})
			polygon.setExtData({
				...extData,
				isChecked: true
			})
			!isEdit.value && (currentUsedGridPolygon = polygon)
			const { judgeMethod, polygons } = accordRoleMethods[currentRole]
			const { lng, lat } = polygon.getPath()[0]
			// 检测坐标点属于哪一个行政区或父网格
			judgeMethod([lng, lat], polygons)
		} else {
			!isEdit.value && (currentUsedGridPolygon = null)
			polygon.setOptions({
				fillOpacity: OWN_GRID_OPACITY_DEFAULT
			})
			polygon.setExtData({
				...extData,
				isChecked: false
			})
		}
		// 调用回调函数
		callback &&
			callback({
				...polygon.getExtData(),
				eventType: 'click',
				polygon
			})
	}

	// 自己多边形双击事件处理函数
	function ownPolygonDblclickHandle(e, polygon) {
		polygon = polygon || this
		const extData = polygon.getExtData()
		const { callback } = extData
		const { isDispatchGrid } = extData.state
		// 批量分配状态下右键功能禁用
		if (isDispatchGrid) {
			return
		}
		// 重置网格样式
		resetGridStyle()
		// 设置当前使用的多边形和透明度
		polygon.setOptions({
			fillOpacity: OWN_GRID_OPACITY_CHECKED
		})
		polygon.setExtData({
			...extData,
			isChecked: true
		})
		// 调用回调函数
		callback &&
			callback({
				...polygon.getExtData(),
				eventType: 'dblclick'
			})
	}

	// 子集多边形鼠标移入事件
	function childPolygonMouseoverHandle() {
		const { pid } = this.getExtData()
		ownPolygonMouseoverHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === pid)
		)
	}

	// 子集多边形点击事件
	function childPolygonClickHandle() {
		const { pid } = this.getExtData()
		ownPolygonClickHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === pid)
		)
	}

	// 子集多边形双击事件
	function childPolygonDblclickHandle() {
		const { pid } = this.getExtData()
		ownPolygonDblclickHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === pid)
		)
	}

	// 自己的多边形绑定事件
	function ownPolygonBindEvent() {
		drawedOwnPolygons.forEach(polygon => {
			polygon.on('mouseover', ownPolygonMouseoverHandle)

			polygon.on('mouseout', ownPolygonMouseoutHandle)

			polygon.on('click', ownPolygonClickHandle)

			polygon.on('dblclick', ownPolygonDblclickHandle)
		})
	}

	// 子集的多边形绑定事件
	function childrenPolygonBindEvent() {
		drawedChildrenPolygons.forEach(polygon => {
			polygon.on('mouseover', childPolygonMouseoverHandle)

			polygon.on('click', childPolygonClickHandle)

			polygon.on('dblclick', childPolygonDblclickHandle)
		})
	}

	// 解绑事件
	function unbindEvent() {
		drawedOwnPolygons.forEach(polygon => {
			polygon.off('mouseover', ownPolygonMouseoverHandle)

			polygon.off('mouseout', ownPolygonMouseoutHandle)

			polygon.off('click', ownPolygonClickHandle)

			polygon.off('rightclick', ownPolygonDblclickHandle)
		})

		drawedChildrenPolygons.forEach(polygon => {
			polygon.off('mouseover', childPolygonMouseoverHandle)

			polygon.off('click', childPolygonClickHandle)

			polygon.off('dblclick', childPolygonDblclickHandle)
		})
	}
	// 绘制行政区域边界
	function drawAdministrationBoundary(districtCodes, options = {}) {
		// console.log(districtCodes)
		if (!is(districtCodes, 'Array')) {
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
			// console.log(options)
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
								strokeColor: '#0091ea',
								bubble: true
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
			isFirst && mapInstance.setFitView()
			isFirst = false
		})
	}

	// 绘制多边形(根据后端数据绘制多边形)
	function renderPolygons(grids, options, callback) {
		// 清除上次结果
		drawedOwnPolygons.forEach(polygon => mapInstance.remove(polygon))
		drawedParentPolygons.forEach(polygon => mapInstance.remove(polygon))
		currentUsedGridPolygon && mapInstance.remove(currentUsedGridPolygon)
		currentUsedGridPolygon = null
		drawedParentPolygons.length = 0
		drawedOwnPolygons.length = 0
		const defaultParentOptions = {
			fillColor: '#0000ff',
			strokeOpacity: 1,
			fillOpacity: PARENT_GRID_OPACITY,
			strokeColor: '#0000ff',
			strokeWeight: 1,
			strokeStyle: 'solid'
		}
		const defaultOwnOptions = {
			fillColor: '#008000',
			strokeOpacity: 1,
			fillOpacity: OWN_GRID_OPACITY_DEFAULT,
			strokeColor: '#2b8cbe',
			strokeWeight: 0,
			strokeStyle: 'solid'
		}
		const defaultChildrenOptions = {
			fillColor: '#ffeb00',
			strokeOpacity: 1,
			fillOpacity: OWN_GRID_OPACITY_DEFAULT,
			strokeColor: '#2b8cbe',
			strokeWeight: 0,
			strokeStyle: 'solid',
			cursor: 'pointer'
		}
		const parentOptions = Object.assign({}, defaultParentOptions, options?.parentOptions || {})
		const ownOptions = Object.assign({}, defaultOwnOptions, options?.ownOptions || {})
		const childrenOptions = Object.assign({}, defaultChildrenOptions, options?.childrenOptions || {})
		const { parentGridList, gridList, childrenGridList } = grids

		// 绘制父多边形
		parentGridList.length &&
			parentGridList.forEach(({ gridAddress, role, ...rest }) => {
				const parentPolygon = new AMap.Polygon({
					path: gridAddress,
					zIndex: rolezIndex[role],
					extData: {
						role,
						...rest
					},
					...parentOptions
				})
				mapInstance.add(parentPolygon)
				drawedParentPolygons.push(parentPolygon)
			})
		// 绘制自己的多边形
		gridList.length &&
			gridList.forEach(({ gridAddress, role, ...rest }) => {
				const ownPolygon = new AMap.Polygon({
					path: gridAddress,
					zIndex: rolezIndex[role],
					extData: {
						role,
						isChecked: false,
						state: options.state,
						callback,
						...rest
					},
					...ownOptions
				})
				mapInstance.add(ownPolygon)
				drawedOwnPolygons.push(ownPolygon)
			})
		ownPolygonBindEvent()
		// 绘制子多边形
		childrenGridList.length &&
			childrenGridList.forEach(({ gridAddress, role, ...rest }) => {
				const childPolygon = new AMap.Polygon({
					path: gridAddress,
					zIndex: rolezIndex[role],
					extData: {
						role,
						...rest
					},
					...childrenOptions
				})
				mapInstance.add(childPolygon)
				drawedChildrenPolygons.push(childPolygon)
			})
		childrenPolygonBindEvent()
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
			strokeOpacity: 1,
			fillColor: '#1791fc',
			fillOpacity: 0.5,
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

			judgeMethod([lng, lat], polygons, callback)
			mapInstance.off('click', drawPolygonClickHandle)
		}

		// 绘制完成事件处理
		function drawendHandle(event) {
			// 1.检测碰撞
			const checkResult = checkCollide(event.obj, callback)
			if (!checkResult) {
				return
			}
			// 2.处理不符合图形
			resetToolStatus()
			// 3.将绘制好的多边形设置为当前正在被使用的多边形
			currentUsedGridPolygon = event.obj
			// 4.调用回调函数
			callback &&
				callback({
					code: 200,
					data: {
						gridAddress: currentUsedGridPolygon.toString(),
						districtCode: currentUsedDistrictCode,
						gridArea: Math.round(currentUsedGridPolygon.getArea()),
						pid: currentUsedParentPolygonId,
						id: ''
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
			if (currentRole === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
				drawedBrotherGridPolygons.push(currentUsedDistrictPolygon)
			}
			if (currentRole === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
				drawedBrotherGridPolygons.push(currentUsedParentPolygon)
			}
			// 将兄弟和父网格或行政区域添加到吸附网格中
			polyEditor.addAdsorbPolygons([...drawedBrotherGridPolygons])
		}
		polyEditor.open()
		isEdit.value = polyEditor.editable
		polyEditor.on('end', ({ target }) => {
			!target.getArea() && (isEdit.value = false)
		})
	}

	// 关闭多边形编辑器
	function closePolyEditor() {
		polyEditor.close()
		isEdit.value = polyEditor.editable
	}

	// 获取当前多边形的信息
	function getCurrentPolygonInfo() {
		if (!currentUsedGridPolygon) {
			return {
				code: 10006,
				message: '请先选择网格！',
				data: {}
			}
		}

		if (isEdit.value) {
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
			polyEditor && closePolyEditor()
		}

		// 3.返回多边形数据
		return {
			code: 200,
			data: {
				...currentUsedGridPolygon.getExtData(),
				gridAddress: currentUsedGridPolygon.toString(),
				districtCode: currentUsedDistrictCode,
				gridArea: Math.round(currentUsedGridPolygon.getArea()),
				isNOChangeGridAddress: currentUsedGridPolygon.toString() === currentUsedGridPolygon.getExtData()?.originGridAddress
			}
		}
	}

	// marker绑定事件
	function markerBindEvent() {
		markers.forEach(marker => {
			marker.on('click', markerClickFn)
		})
	}

	// marker解绑事件
	function markerUnbindEvent() {
		markers.forEach(marker => {
			marker.off('click', markerClickFn)
		})
	}

	// 设置marker点
	function addMarkers(coordinates, clickHandle) {
		// 清空上次的markers
		removeMarkers()
		markerClickFn = clickHandle
		markers = coordinates.map(item => {
			const { longitude, latitude, stype } = item
			const icon = new AMap.Icon({
				size: new AMap.Size(24, 24),
				image: MARKER_TYPE_ICON[stype],
				imageSize: new AMap.Size(24, 24),
				imageOffset: new AMap.Pixel(0, 0)
			})
			const marker = new AMap.Marker({
				position: new AMap.LngLat(longitude, latitude),
				icon,
				offset: new AMap.Pixel(-12, -24),
				extData: {
					...item
				}
			})

			return marker
		})
		markerBindEvent()
		mapInstance.add([...markers])
	}

	// 移除marker点
	function removeMarkers() {
		markerUnbindEvent()
		markers.length && mapInstance.remove(markers)
	}

	// 纯文本鼠标移入事件
	function textMarkerMouseoverHandle() {
		const id = this.getExtData().id
		ownPolygonMouseoverHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === id)
		)
	}

	// 纯文本鼠标点击事件
	function textMarkerClickHandle() {
		const id = this.getExtData().id
		ownPolygonClickHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === id)
		)
	}

	// 纯文本鼠标双击事件
	function textMarkerDblclickHandle() {
		const id = this.getExtData().id
		ownPolygonDblclickHandle(
			null,
			drawedOwnPolygons.find(ownPolygon => ownPolygon.getExtData().id === id)
		)
	}

	// 纯文本标记绑定事件
	function textMarkerBindEvent() {
		textMarkers.forEach(marker => {
			marker.on('mouseover', textMarkerMouseoverHandle)

			marker.on('click', textMarkerClickHandle)

			marker.on('dblclick', textMarkerDblclickHandle)
		})
	}

	// 纯文本标记解绑事件
	function textMarkerUnbindEvent() {
		textMarkers.forEach(marker => {
			marker.off('mouseover', textMarkerMouseoverHandle)

			marker.off('click', textMarkerClickHandle)

			marker.off('dblclick', textMarkerDblclickHandle)
		})
	}

	// 创建纯文本标记text
	function addTextMarkers(coordinates, options = {}) {
		// 清空上次的markers
		removeTextMarkers()
		textMarkers = coordinates.map(item => {
			const { longitude, latitude, text, ...rest } = item
			const textmarker = new AMap.Text({
				text,
				anchor: 'center', // 设置文本标记锚点
				draggable: false,
				cursor: 'pointer',
				angle: 0,
				style: {
					'background-color': 'transparent',
					'border-width': 0,
					'text-align': 'center',
					'font-size': '14px',
					color: 'blue'
				},
				extData: {
					longitude,
					latitude,
					text,
					...rest
				},
				position: [longitude, latitude],
				...options
			})
			return textmarker
		})
		textMarkerBindEvent()
		mapInstance.add([...textMarkers])
	}

	// 移除TextMarker点
	function removeTextMarkers() {
		textMarkerUnbindEvent()
		textMarkers.length && mapInstance.remove(textMarkers)
	}

	// 初始化热力图
	function initHeatMap(options = {}) {
		if (!isSupportCanvas()) {
			message.warn('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
			return
		}
		if (!heatmap) {
			mapInstance.plugin(['AMap.HeatMap'], function () {
				// 初始化heatmap对象
				heatmap = new AMap.HeatMap(mapInstance, {
					radius: 25, // 给定半径
					opacity: [0, 0.8],
					gradient: {
						0.5: 'blue',
						0.65: 'rgb(117,211,248)',
						0.7: 'rgb(0, 255, 0)',
						0.9: '#ffea00',
						1.0: 'red'
					},
					...options
				})
			})
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
		mapInstance = new AMap.Map(el, options)
		// 初始化热力图
		options?.plugins?.HeatMap && initHeatMap()
	}

	initMap()

	return {
		mapInstance,
		heatmap,
		isEdit,
		initMap,
		setRole,
		drawAdministrationBoundary,
		drawPolygon,
		renderPolygons,
		openPolyEditor,
		closePolyEditor,
		getCurrentPolygonInfo,
		addMarkers,
		removeMarkers,
		addTextMarkers,
		removeTextMarkers,
		initHeatMap,
		resetGridStyle,
		unbindEvent,
		resetToolStatus
	}
}
