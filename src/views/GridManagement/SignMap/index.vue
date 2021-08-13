<!--
 * @Description: 签约地图
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 15:03:27
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-13 10:42:08
-->
<template>
	<!-- 签约地图容器 -->
	<div id="sign-map-wrapper" class="w-full h-full" />

	<!-- 选择门店类型RadioGroup -->
	<RadioGroup v-model:value="shopType" button-style="solid" class="shop-radio-group">
		<RadioButton v-for="(shopTypeName, key) of SHOP_TYPE_NAME" :key="key" :value="+key" class="radio-block-item">{{ shopTypeName }}</RadioButton>
	</RadioGroup>

	<!-- 门店信息 -->
	<ShopInfo :is-show="isShowShopInfo" :info-data="infoData" />

	<!-- 图例信息 -->
	<LegendInfo />

	<!-- 地图按钮功能 -->
	<MapButtonGroup
		ref="mapButtonGroupRef"
		:is-edit="isEdit"
		:is-create="isCreate"
		:is-dispatch-grid="isDispatchGrid"
		@create-grid="createGridHandle"
		@edit-grid="editGridHandle"
		@save-grid="saveGridHandle"
		@delete-grid="deleteGridHandle"
		@batch-dispatch-grid="batchDispatchGridHandle"
		@cancel-batch-dispatch-grid="cancelBatchDispatchGridHandle"
	/>

	<!-- 网格分配抽屉 -->
	<GridDrawer
		v-model:visible="isShowDispatchDrawer"
		:role="role"
		:map-type="MAP_TYPE.SIGN_MAP"
		:org-orbd-list="orgOrbdList"
		:grid-info-list="gridInfoList"
		:is-dispatch-grid="isDispatchGrid"
		@close="cancelBatchDispatchGridHandle"
		@dispatched="dispatchedHandle"
	/>

	<!-- 网格信息弹窗 -->
	<GridInfoModal
		v-model:visible="gridModalVisible"
		title="网格信息"
		centered
		:mask-closable="false"
		:closable="false"
		:grid-info="gridInfo"
		cancel-text="取消"
		ok-text="保存"
		@ok="modalSaveGridHandle"
		@cancel="editGridHandle"
	/>
</template>

<script>
	import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect, watch, onUnmounted, createVNode, onActivated, onDeactivated } from 'vue'
	import { message as Message, Modal, Radio } from 'ant-design-vue'
	import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
	import ShopInfo from '../components/shopInfo.vue'
	import LegendInfo from '../components/legendInfo.vue'
	import MapButtonGroup from '../components/mapButtonGroup.vue'
	import GridDrawer from '../components/gridDrawer.vue'
	import GridInfoModal from '../components/gridInfoModal.vue'
	import { useMap } from 'src/hooks/useMap'
	import { ADMIN_ROLE_TYPE, SHOP_TYPE, SHOP_TYPE_NAME, MAP_TYPE, SHOP_ICON_TYPE } from 'src/common/constant'
	import { strTransferLngLat } from 'src/utils'
	import {
		getUserGridsData,
		getAddGridData,
		getEditGridData,
		addSaveGrid,
		editSaveGrid,
		deleteGrid,
		getNearbyShopForGrid,
		getDispatchOrganization,
		getDispatchBd
	} from 'src/api/GridManagement'
	export default defineComponent({
		name: 'SignMap',
		components: {
			ShopInfo,
			LegendInfo,
			MapButtonGroup,
			GridDrawer,
			GridInfoModal,
			RadioGroup: Radio.Group,
			RadioButton: Radio.Button
		},
		setup() {
			const infoData = ref({})
			const mapAttrs = reactive({
				center: [],
				zoom: 5,
				shopType: SHOP_TYPE.ALL
			})
			const mapButtonGroupRef = ref(null)
			let map = null
			const SHOP_ZOOM_DEMARCATION_VALUE = 10 // 门店展示zoom分界值
			const TEXT_MARKER_ZOOM_DEMARCATION_VALUE = 12 // 文本标记zoom分界值
			let userGridsData = {} // 用户网格数据
			const gridInfo = ref({}) // 闭环时网格信息
			const state = reactive({
				gridModalVisible: false,
				isShowDispatchDrawer: false,
				isDispatchGrid: false,
				isCreate: false,
				isEdit: false,
				isShowShopInfo: false,
				role: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE,
				orgOrbdList: [], // 机构或者bd列表
				gridInfoList: [] // 网格信息列表 用于批量分配网格展示信息
			})

			watch([() => mapAttrs.center, () => mapAttrs.zoom, () => mapAttrs.shopType], ([center, zoom, shopType], [preCenter, preZoom, preShopType]) => {
				console.log(zoom, preZoom, shopType, preShopType)
				if (
					(zoom > SHOP_ZOOM_DEMARCATION_VALUE && shopType !== preShopType) ||
					(preZoom <= SHOP_ZOOM_DEMARCATION_VALUE && zoom > SHOP_ZOOM_DEMARCATION_VALUE) ||
					(zoom > SHOP_ZOOM_DEMARCATION_VALUE && center.toString() !== preCenter.toString())
				) {
					if (shopType !== preShopType) {
						console.log('门店类型改变调用门店坐标接口')
					}
					if (preZoom <= SHOP_ZOOM_DEMARCATION_VALUE && zoom > SHOP_ZOOM_DEMARCATION_VALUE) {
						console.log('zoom改变调用门店坐标接口')
					}
					if (zoom > SHOP_ZOOM_DEMARCATION_VALUE && center.toString() !== preCenter.toString()) {
						console.log('中心点坐标改变调用门店坐标接口')
					}
					getNearShopCoordinates()
					return
				}

				if (zoom <= SHOP_ZOOM_DEMARCATION_VALUE && preZoom > SHOP_ZOOM_DEMARCATION_VALUE) {
					console.log('地图缩放比例小于规定比例')
					removeMarkers()
				}
			})

			watch(
				() => mapAttrs.zoom,
				(zoom, preZoom) => {
					if (zoom > TEXT_MARKER_ZOOM_DEMARCATION_VALUE && preZoom <= TEXT_MARKER_ZOOM_DEMARCATION_VALUE) {
						addTextMarkers()
						return
					}
					if (zoom <= TEXT_MARKER_ZOOM_DEMARCATION_VALUE) {
						removeTextMarkers()
					}
				}
			)

			// 添加控件
			const addControl = mapInstance => {
				const toolBar = new AMap.ToolBar({
					position: {
						bottom: '12px',
						right: '12px'
					}
				})
				mapInstance.addControl(toolBar)
			}

			// 渲染地图
			const renderMap = () => {
				map = useMap('sign-map-wrapper', {
					zoom: 5,
					center: [103.800566, 36.124537],
					zooms: [5, 20]
				})
				const { mapInstance } = map

				watchEffect(() => {
					state.isEdit = map?.isEdit.value
				})
				// 添加控件
				addControl(mapInstance)

				// 绑定事件
				bindEvent(mapInstance)
			}

			// 地图缩放
			const mapZoomend = () => {
				const { mapInstance } = map
				mapAttrs.zoom = mapInstance.getZoom()
				mapDragend()
				console.log(`当前地图zoom为${mapAttrs.zoom}`)
			}

			// 地图拖拽
			const mapDragend = () => {
				const { mapInstance } = map
				mapAttrs.center = mapInstance.getCenter()
				console.log(`地图中心点改变了为${mapAttrs.center.toString()}`)
			}

			// 点击地图
			const mapClickHandle = () => {
				state.isShowShopInfo = false
			}

			// 绑定事件
			const bindEvent = mapInstance => {
				mapInstance.on('zoomend', mapZoomend)
				mapInstance.on('dragend', mapDragend)
				mapInstance.on('click', mapClickHandle)
			}

			// 解绑事件
			const unbindEvent = () => {
				const { mapInstance } = map
				mapInstance.off('zoomend', mapZoomend)
				mapInstance.off('dragend', mapDragend)
				mapInstance.off('click', mapClickHandle)
			}

			// 绘制行政区域边界
			const drawAdministrationBoundary = () => {
				const { regionList, role } = userGridsData
				map.setRole(role)
				regionList.length && map.drawAdministrationBoundary(regionList, {})
			}

			// 绘制网格
			const drawGrids = () => {
				const { parentGridList, gridList, childrenGridList } = userGridsData
				map.renderPolygons({ parentGridList, gridList, childrenGridList }, { state }, gridClickHandle)
			}

			// 添加文本标记
			const addTextMarkers = () => {
				const { gridList, role } = userGridsData
				const textMarkerList = []
				gridList.forEach(grid => {
					if (role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE && grid.orgId && grid.centerPoint) {
						const [longitude, latitude] = grid.centerPoint?.split(',')
						textMarkerList.push({
							longitude,
							latitude,
							text: grid.gridOrg,
							...grid
						})
					}
					if (role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE && grid.sellerId && grid.centerPoint) {
						const [longitude, latitude] = grid.centerPoint?.split(',')
						textMarkerList.push({
							longitude,
							latitude,
							text: grid.sellerName,
							...grid
						})
					}
				})
				map.addTextMarkers(textMarkerList)
			}

			// 清除text marker点
			const removeTextMarkers = () => {
				map.removeTextMarkers()
			}

			// 网格点击事件
			const gridClickHandle = async gridInfo => {
				// 关闭门店信息弹窗
				state.isShowShopInfo = false
				// 双击查看网格信息
				if (userGridsData.role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
					if (gridInfo.eventType === 'dblclick' || state.isDispatchGrid) {
						state.orgOrbdList = (await getDispatchOrganization({ regionCode: gridInfo.districtCode })) || []
						state.gridInfoList = [gridInfo]
					}

					if (gridInfo.eventType === 'dblclick') {
						state.isShowDispatchDrawer = true
					}
					return
				}

				if (userGridsData.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
					if (gridInfo.eventType === 'dblclick') {
						// 双击展示该网格信息为单选
						state.gridInfoList = [gridInfo]
						state.isShowDispatchDrawer = true
						return
					}
					// 批量分配
					if (state.isDispatchGrid) {
						const index = state.gridInfoList.findIndex(grid => grid.id === gridInfo.id)
						if (gridInfo.isChecked) {
							// 添加
							if (state.gridInfoList.length >= 50) {
								map.resetGridStyle([gridInfo.polygon])
								Message.warn('批量分配最多选择50个网格!')
								return
							}
							!~index && state.gridInfoList.push(gridInfo)
						} else {
							// 删除
							state.gridInfoList.splice(index, 1)
						}
					}
				}
			}

			// 获取bdm角色下的用户数据 用于批量分配网格
			const getBdUserList = async () => {
				if (userGridsData.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
					state.orgOrbdList = (await getDispatchBd()) || []
				}
			}

			// 获取绘制好的网格信息(闭环查询网格信息)
			const getGridInfo = async info => {
				const { id, gridArea, gridAddress, districtCode, pid } = info
				console.log(info)
				let data = {}
				if (!id) {
					// 新增
					data = await getAddGridData({
						gridAddress,
						gridArea,
						pid
					})
				} else {
					// 编辑时候坐标变化调用闭环网格信息接口
					data = await getEditGridData({
						gridAddress,
						gridArea,
						districtCode,
						id
					})
				}
				gridInfo.value = {
					...info,
					...data,
					mapType: MAP_TYPE.SIGN_MAP
				}
				state.gridModalVisible = true
			}

			// 创建网格
			const createGridHandle = () => {
				const { drawPolygon } = map
				console.log('开始创建网格')
				state.isCreate = true
				drawPolygon(({ code, message, data }) => {
					state.isCreate = false
					if (code === 200) {
						getGridInfo(data)
					} else {
						Message.warn(message)
					}
				})
			}

			// 编辑网格
			const editGridHandle = () => {
				const { openPolyEditor } = map
				openPolyEditor()
			}

			// 保存网格(页面保存按钮)
			const saveGridHandle = async () => {
				const { getCurrentPolygonInfo } = map
				const { code, message, data } = getCurrentPolygonInfo()
				// console.log(data)
				if (code === 200) {
					gridInfo.value = {
						...gridInfo.value,
						...data
					}
					// 获取网格信息(调用闭环接口)
					if (!data.id || (data.id && !data.isNOChangeGridAddress)) {
						// 新增
						getGridInfo(gridInfo.value)
					} else {
						Message.warn('当前网格未改变！')
					}
				} else {
					Message.warn(message)
					await initProcess()
					addTextMarkers()
				}
			}

			// 保存网格(弹窗保存按钮)
			const modalSaveGridHandle = async () => {
				let flag = false
				if (flag) {
					return
				}
				flag = true
				if (gridInfo.value.id) {
					// 编辑网格
					await editSaveGridHandle()
				} else {
					// 新增网格
					await addSaveGridHandle()
				}
				flag = false
				state.gridModalVisible = false
				// 初始化流程
				await initProcess()
				addTextMarkers()
			}

			// 编辑保存网格
			const editSaveGridHandle = async () => {
				await editSaveGrid(gridInfo.value)
			}

			// 新增保存网格
			const addSaveGridHandle = async () => {
				await addSaveGrid(gridInfo.value)
			}

			// 删除网格
			const deleteGridHandle = () => {
				const { getCurrentPolygonInfo } = map
				const { code, message, data } = getCurrentPolygonInfo()
				if (code !== 200) {
					Message.warn(message)
					return
				}

				Modal.confirm({
					title: '是否确认删除该网格？',
					icon: createVNode(ExclamationCircleOutlined),
					okText: '确认',
					cancelText: '取消',
					centered: true,
					width: 400,
					onOk: async () => {
						await deleteGrid({ id: data.id, mapType: MAP_TYPE.SIGN_MAP })
						// 初始化流程
						await initProcess()
						addTextMarkers()
					}
				})
			}

			// 批量分配网格
			const batchDispatchGridHandle = () => {
				Modal.confirm({
					content: createVNode('div', {}, [
						createVNode('div', { style: 'font-size: 16px;line-height: 24px;' }, '请确认是否批量分配已选网格？'),
						createVNode('div', { style: 'color:red;margin-top:12px' }, '*已经分配过的网格负责人与维护人将会被覆盖。')
					]),
					okText: '确认',
					cancelText: '取消',
					centered: true,
					width: 400,
					onCancel: cancelBatchDispatchGridHandle,
					onOk: sureBatchDispatchGridHandle
				})
			}

			// 确定批量分配网格
			const sureBatchDispatchGridHandle = () => {
				map.resetGridStyle()
				state.isShowDispatchDrawer = true
				state.isDispatchGrid = true
				console.log('批量分配网格')
			}

			// 取消批量分配网格
			const cancelBatchDispatchGridHandle = () => {
				map.resetGridStyle()
				state.isShowDispatchDrawer = false
				state.isDispatchGrid = false
				mapButtonGroupRef.value.batchDispatchGridFlag = true
				// 重置选中的网格信息列表
				state.gridInfoList = []
				console.log('取消批量分配网格')
			}

			// 分配完成
			const dispatchedHandle = async () => {
				await initProcess()
				addTextMarkers()
			}

			// 获取附近门店坐标
			const getNearShopCoordinates = async () => {
				const { addMarkers } = map
				const { lng, lat } = mapAttrs.center
				state.isShowShopInfo = false
				try {
					const data =
						(await getNearbyShopForGrid({
							longitude: lng,
							latitude: lat,
							type: mapAttrs.shopType
						})) || []
					mapAttrs.zoom > SHOP_ZOOM_DEMARCATION_VALUE && addMarkers(data, getShopInfo)
				} catch (error) {
					console.log(error)
				}
			}

			// 点击门店获取门店信息
			const getShopInfo = e => {
				const {
					stype,
					id,
					name,
					locate,
					sTypeStr,
					typeStr,
					sellerName,
					maintainName,
					phone,
					starLevelStr,
					commentsNum,
					goodComm,
					averageNum,
					cost,
					sourceStr,
					avgProfit
				} = e.target.getExtData()

				const shopInfoConfig = {
					[SHOP_ICON_TYPE.SELF_SUPPORT_SHOP]: {
						name,
						id,
						locate,
						otherInfo: [
							{
								title: '门店来源',
								text: sTypeStr
							},
							{
								title: '业态',
								text: typeStr
							},
							{
								title: '门店负责人',
								text: sellerName
							},
							{
								title: '门店维护人',
								text: maintainName
							},
							{
								title: '门店电话',
								text: phone
							},
							{
								title: '近30天日均流水',
								text: avgProfit
							}
						]
					},
					[SHOP_ICON_TYPE.DIRECT_SUPPORT_SHOP]: {
						name,
						id,
						locate,
						otherInfo: [
							{
								title: '门店来源',
								text: sTypeStr
							},
							{
								title: '业态',
								text: typeStr
							},
							{
								title: '门店负责人',
								text: sellerName
							},
							{
								title: '门店维护人',
								text: maintainName
							},
							{
								title: '门店电话',
								text: phone
							}
						]
					},
					[SHOP_ICON_TYPE.SEAS_RECOMMEND_SHOP]: {
						name,
						id,
						locate,
						otherInfo: [
							{
								title: '门店来源',
								text: sTypeStr
							},
							{
								title: '业态',
								text: typeStr
							},
							{
								title: '门店负责人',
								text: sellerName
							},
							{
								title: '门店维护人',
								text: maintainName
							},
							{
								title: '门店电话',
								text: phone
							},
							{
								title: '星级',
								text: starLevelStr
							},
							{
								title: '人均消费',
								text: cost
							},
							{
								title: '评价数',
								text: commentsNum
							},
							{
								title: '好评数',
								text: goodComm
							},
							{
								title: '平均分',
								text: averageNum
							}
						]
					},
					[SHOP_ICON_TYPE.SEAS_MAP_SHOP]: {
						name,
						id,
						locate,
						otherInfo: [
							{
								title: '门店来源',
								text: sTypeStr
							},
							{
								title: '分类',
								text: sourceStr
							},
							{
								title: '门店负责人',
								text: sellerName
							},
							{
								title: '门店维护人',
								text: maintainName
							}
						]
					}
				}
				infoData.value = shopInfoConfig[stype]
				state.isShowShopInfo = true
			}

			// 清除marker点
			const removeMarkers = () => {
				map.removeMarkers()
			}

			// 获取用户下的网格数据
			const getUserGrids = async () => {
				const data = await getUserGridsData()
				userGridsData = dealDataHandle(data)
				state.role = userGridsData.role
			}

			// 处理网格数据
			const dealDataHandle = data => {
				// 处理行政区域列表
				data.regionList = (data.regionList?.length && data.regionList.map(region => region.code)) || []
				// 父级的网格角色就是ORGANZITION_ADMIN_ROLE 只有两种角色
				data.parentGridList =
					(data.parentGridList?.length &&
						data.parentGridList.map(({ gridAddress, gridArea, ...rest }) => ({
							...rest,
							gridAddress: strTransferLngLat(gridAddress),
							originGridAddress: gridAddress,
							gridArea,
							role: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE
						}))) ||
					[]
				// 自己的网格角色就是当前用户的角色
				data.gridList = data.gridList.map(({ gridAddress, gridArea, ...rest }) => ({
					...rest,
					gridAddress: strTransferLngLat(gridAddress),
					originGridAddress: gridAddress,
					gridArea,
					role: data.role
				}))
				// 子网格角色就是BD_ADMIN_ROLE
				data.childrenGridList =
					(data.childrenGridList?.length &&
						data.childrenGridList.map(({ gridAddress, gridArea, ...rest }) => ({
							...rest,
							gridAddress: strTransferLngLat(gridAddress),
							originGridAddress: gridAddress,
							gridArea,
							role: ADMIN_ROLE_TYPE.BD_ADMIN_ROLE
						}))) ||
					[]
				return data
			}

			// 初始化流程
			const initProcess = async () => {
				// 获取用户网格数据
				await getUserGrids()
				// 绘制行政区域边界
				drawAdministrationBoundary()
				// 绘制网格
				drawGrids()
			}

			onMounted(() => {
				// 渲染地图
				renderMap()
			})

			onActivated(async () => {
				// 初始化流程
				await initProcess()
				// 若当前用户为bdm则获取bdm下的得bd人员用于分配网格(ADMIN_ROLE_TYPE.BD_ADMIN_ROLE角色固定列表只拉取一次 ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE及以上点击网格获取)
				!state.orgOrbdList.length && getBdUserList()
			})

			onDeactivated(() => {
				state.isShowDispatchDrawer = false
				map.resetToolStatus(true)
			})

			onUnmounted(() => {
				map.unbindEvent()
				unbindEvent()
			})

			return {
				infoData,
				mapButtonGroupRef,
				shopType: toRefs(mapAttrs).shopType,
				SHOP_TYPE_NAME,
				gridInfo,
				MAP_TYPE,
				...toRefs(state),
				createGridHandle,
				editGridHandle,
				saveGridHandle,
				modalSaveGridHandle,
				deleteGridHandle,
				batchDispatchGridHandle,
				cancelBatchDispatchGridHandle,
				dispatchedHandle
			}
		}
	})
</script>
