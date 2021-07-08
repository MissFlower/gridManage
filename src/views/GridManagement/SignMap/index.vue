<!--
 * @Description: 签约地图
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 15:03:27
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-08 20:22:15
-->
<template>
	<!-- 签约地图容器 -->
	<div id="sign-map-wrapper" class="map" />

	<!-- 选择门店类型RadioGroup -->
	<RadioGroup v-model:value="shopType" button-style="solid" class="shop-radio-group">
		<RadioButton v-for="(shopTypeName, key) of SHOP_TYPE_NAME" :key="key" :value="+key" class="radio-shop">{{ shopTypeName }}</RadioButton>
	</RadioGroup>

	<!-- 门店信息 -->
	<ShopInfo :info-data="infoData" />

	<!-- 图例信息 -->
	<LegendInfo />

	<!-- 地图按钮功能 -->
	<MapButtonGroup
		ref="mapButtonGroupRef"
		:is-edit="isEdit"
		:is-dispatch-grid="isDispatchGrid"
		@create-grid="createGridHandle"
		@edit-grid="editGridHandle"
		@save-grid="saveGridHandle"
		@delete-grid="deleteGridHandle"
		@batch-dispatch-grid="batchDispatchGridHandle"
		@cancel-batch-dispatch-grid="cancelBatchDispatchGridHandle"
	/>

	<!-- 网格分配抽屉 -->
	<GridDrawer v-model:visible="gridDrawerVisible" @close="cancelBatchDispatchGridHandle" />

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
		@ok="addSaveGridHandle"
		@cancel="editGridHandle"
	/>
</template>

<script>
	import { defineComponent, onMounted, reactive, ref, toRefs, watchEffect, watch, onUnmounted, createVNode } from 'vue'
	import { message as Message, Modal, RadioGroup, RadioButton } from 'ant-design-vue'
	import ShopInfo from '../components/shopInfo.vue'
	import LegendInfo from '../components/legendInfo.vue'
	import MapButtonGroup from '../components/mapButtonGroup.vue'
	import GridDrawer from '../components/gridDrawer.vue'
	import GridInfoModal from '../components/gridInfoModal.vue'
	import { useMap } from 'src/hooks/useMap'
	import { ADMIN_ROLE_TYPE, SHOP_TYPE, SHOP_TYPE_NAME, MAP_TYPE } from 'src/common/constant'
	import { strTransferLngLat } from 'src/utils'
	import { getUserGridsData, getGridData, addSaveGrid, editSaveGrid, deleteGrid } from 'src/api/GridManagement'
	export default defineComponent({
		name: 'SignMap',
		components: {
			ShopInfo,
			LegendInfo,
			MapButtonGroup,
			GridDrawer,
			GridInfoModal,
			RadioGroup,
			RadioButton
		},
		setup() {
			const infoData = reactive({
				src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
			})
			const state = reactive({
				gridDrawerVisible: false,
				gridModalVisible: false,
				isDispatchGrid: false,
				isEdit: false
			})
			const mapAttrs = reactive({
				center: [],
				zoom: 5,
				shopType: SHOP_TYPE.ALL
			})
			const mapButtonGroupRef = ref(null)
			let map = null
			const ZOOM_DEMARCATION_VALUE = 10 // zoom分界值
			let userGridsData = {} // 用户网格数据
			const gridInfo = ref({}) // 闭环时网格信息

			watch([() => mapAttrs.center, () => mapAttrs.zoom, () => mapAttrs.shopType], ([center, zoom, shopType], [preCenter, preZoom, preShopType]) => {
				console.log(zoom, preZoom, shopType, preShopType)
				if (
					(zoom > ZOOM_DEMARCATION_VALUE && shopType !== preShopType) ||
					(preZoom <= ZOOM_DEMARCATION_VALUE && zoom > ZOOM_DEMARCATION_VALUE) ||
					(zoom > ZOOM_DEMARCATION_VALUE && center.toString() !== preCenter.toString())
				) {
					if (shopType !== preShopType) {
						console.log('门店类型改变调用门店坐标接口')
					}
					if (preZoom <= ZOOM_DEMARCATION_VALUE && zoom > ZOOM_DEMARCATION_VALUE) {
						console.log('zoom改变调用门店坐标接口')
					}
					if (zoom > ZOOM_DEMARCATION_VALUE && center.toString() !== preCenter.toString()) {
						console.log('中心点坐标改变调用门店坐标接口')
					}
					getNearShopCoordinates()
					return
				}

				if (zoom <= ZOOM_DEMARCATION_VALUE && preZoom > ZOOM_DEMARCATION_VALUE) {
					console.log('地图缩放比例小于规定比例')
					removeMarkers()
				}
			})

			// 添加控件
			const addControl = mapInstance => {
				const toolBar = new AMap.ToolBar({
					position: {
						bottom: '10px',
						right: '10px'
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
				console.log(`当前地图zoom为${mapAttrs.zoom}`)
			}

			// 地图拖拽
			const mapDragend = () => {
				const { mapInstance } = map
				mapAttrs.center = mapInstance.getCenter()
				console.log(`地图中心点改变了为${mapAttrs.center.toString()}`)
			}

			// 绑定事件
			const bindEvent = mapInstance => {
				mapInstance.on('zoomend', mapZoomend)
				mapInstance.on('dragend', mapDragend)
			}

			// 解绑事件
			const unbindEvent = () => {
				const { mapInstance } = map
				mapInstance.off('zoomend', mapZoomend)
				mapInstance.off('dragend', mapDragend)
			}

			// 绘制行政区域边界
			const drawAdministrationBoundary = () => {
				const { regionList, role } = userGridsData
				map.drawAdministrationBoundary(regionList, {}, role)
			}

			// 绘制网格
			const drawGrids = () => {
				const { parentGridList, gridList } = userGridsData
				const grids = [...parentGridList, ...gridList]
				grids.length && map.renderPolygons(grids)
			}

			// 创建网格
			const createGridHandle = () => {
				const { drawPolygon } = map
				console.log('开始创建网格')

				drawPolygon(({ code, message, data }) => {
					if (code === 200) {
						getGridInfo(data)
					} else {
						Message.warn(message)
					}
				})

				// 获取绘制好的网格信息
				async function getGridInfo(params) {
					const data = await getGridData(params)
					gridInfo.value = {
						...data,
						...params,
						mapType: MAP_TYPE.SIGN_MAP
					}
					state.gridModalVisible = true
				}
			}

			// 编辑网格
			const editGridHandle = () => {
				const { openPolyEditor } = map
				openPolyEditor()
			}

			// 保存网格
			const saveGridHandle = () => {
				const { getPolygonInfo } = map
				const { code, message, data } = getPolygonInfo()
				if (code === 200) {
					console.log(data)
					gridInfo.value = {
						...gridInfo.value,
						...data
					}
					if (data.id) {
						// 编辑网格
						editSaveGridHandle()
					} else {
						// 新增网格
						addSaveGridHandle()
					}
				} else {
					Message.warn(message)
				}
			}

			// 添加保存网格
			const addSaveGridHandle = async () => {
				await addSaveGrid(gridInfo.value)
				state.gridModalVisible = false
				// 初始化流程
				initProcess()
			}

			// 编辑保存网格
			const editSaveGridHandle = async () => {
				await editSaveGrid(gridInfo.value)
				state.gridModalVisible = false
				// 初始化流程
				initProcess()
			}

			// 删除网格
			const deleteGridHandle = async () => {
				const { getPolygonInfo } = map
				const { code, message, data } = getPolygonInfo()
				if (code === 200) {
					await deleteGrid({ id: data.id, mapType: MAP_TYPE.SIGN_MAP })
					// 初始化流程
					initProcess()
				} else {
					Message.warn(message)
				}
			}

			// 批量分配网格
			const batchDispatchGridHandle = () => {
				const { resetGridStyle } = map
				Modal.confirm({
					content: createVNode('div', {}, [
						createVNode('div', { style: 'font-size: 16px;line-height: 24px;' }, '请确认是否批量分配已选网格？'),
						createVNode('div', { style: 'color:red;margin-top:12px' }, '*已经分配过的网格负责人与维护人将会被覆盖。')
					]),
					okText: '确认',
					cancelText: '取消',
					centered: true,
					width: 400,
					onCancel: () => {
						cancelBatchDispatchGridHandle()
					},
					onOk: () => {
						resetGridStyle()
						state.isDispatchGrid = true
						state.gridDrawerVisible = true
						console.log('批量分配网格')
					}
				})
			}

			// 取消批量分配网格
			const cancelBatchDispatchGridHandle = () => {
				state.isDispatchGrid = false
				state.gridDrawerVisible = false
				mapButtonGroupRef.value.batchDispatchGridFlag = true
				console.log('取消批量分配网格')
			}

			// 获取附近门店坐标
			const getNearShopCoordinates = () => {
				const { addMarkers } = map
				const markers = [
					[116.661113, 39.996551],
					[116.754549, 40.002993],
					[116.750811, 39.901284],
					[116.633083, 39.869738]
				]
				addMarkers(markers)
			}

			// 清除marker点
			const removeMarkers = () => {
				const { removeMarkers } = map
				removeMarkers()
			}

			// 获取用户下的网格数据
			const getUserGrids = async () => {
				const data = await getUserGridsData()
				userGridsData = dealDataHandle(data)
			}

			// 处理网格数据
			const dealDataHandle = data => {
				// 处理行政区域列表
				data.regionList = data.regionList.length && data.regionList.map(region => region.code)
				// 父级的网格角色就是ORGANZITION_ADMIN_ROLE 只有两种角色
				data.parentGridList =
					(data.parentGridList.length &&
						data.parentGridList.map(({ gridAddress, gridArea, ...rest }) => ({
							...rest,
							gridAddress: strTransferLngLat(gridAddress),
							gridArea,
							role: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE
						}))) ||
					[]
				// 自己的网格角色就是当前用户的角色
				data.gridList = data.gridList.map(({ gridAddress, gridArea, ...rest }) => ({
					...rest,
					gridAddress: strTransferLngLat(gridAddress),
					gridArea,
					role: data.role
				}))
				return data
			}

			// 初始化流程
			const initProcess = async () => {
				// 获取用户网格数据
				await getUserGrids()
				// 绘制行政区域边界
				drawAdministrationBoundary()
				// // 绘制网格
				drawGrids()
			}

			onMounted(() => {
				// 渲染地图
				renderMap()
				// 初始化流程
				initProcess()
			})

			onUnmounted(() => {
				unbindEvent()
			})

			return {
				infoData,
				mapButtonGroupRef,
				shopType: toRefs(mapAttrs).shopType,
				SHOP_TYPE_NAME,
				gridInfo,
				...toRefs(state),
				createGridHandle,
				editGridHandle,
				saveGridHandle,
				addSaveGridHandle,
				deleteGridHandle,
				batchDispatchGridHandle,
				cancelBatchDispatchGridHandle
			}
		}
	})
</script>

<style lang="scss" scoped>
	.radio-shop {
		display: block;
		height: 30px;
		line-height: 30px;
	}
</style>
