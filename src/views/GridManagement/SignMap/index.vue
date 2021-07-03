<!--
 * @Description: 签约地图
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 15:03:27
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-03 17:42:18
-->
<template>
	<!-- 签约地图容器 -->
	<div id="sign-map-wrapper" class="map" />

	<!-- 门店信息 -->
	<ShopInfo :info-data="infoData" />

	<!-- 图例信息 -->
	<LegendInfo />

	<!-- 地图按钮功能 -->
	<MapButtonGroup
		@create-grid="createGridHandle"
		@edit-grid="editGridHandle"
		@save-grid="saveGridHandle"
		@delete-grid="deleteGridHandle"
		@batch-dispatch-grid="batchDispatchGridHandle"
		@cancel-batch-dispatch-grid="cancelBatchDispatchGridHandle"
	/>

	<!-- 网格分配抽屉 -->
	<GridDrawer v-model:visible="gridDrawerVisible" />

	<!-- 网格信息弹窗 -->
	<GridInfoModal
		v-model:visible="gridModalVisible"
		title="网格信息"
		centered
		:mask-closable="false"
		:closable="false"
		cancel-text="取消"
		ok-text="保存"
	/>
</template>

<script>
	import { defineComponent, onMounted, reactive, ref } from 'vue'
	import { message as Message } from 'ant-design-vue'
	import ShopInfo from '../components/shopInfo.vue'
	import LegendInfo from '../components/legendInfo.vue'
	import MapButtonGroup from '../components/mapButtonGroup.vue'
	import GridDrawer from '../components/gridDrawer.vue'
	import GridInfoModal from '../components/gridInfoModal.vue'
	import { useMap } from 'src/hooks/useMap'
	import { ADMIN_ROLE_TYPE } from 'src/common/constant'
	import { strTransferLngLat } from 'src/utils'
	export default defineComponent({
		name: 'SignMap',
		components: {
			ShopInfo,
			LegendInfo,
			MapButtonGroup,
			GridDrawer,
			GridInfoModal
		},
		setup() {
			const infoData = reactive({
				src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
			})
			const gridDrawerVisible = ref(false)
			const gridModalVisible = ref(false)
			let map = null
			let userGridsData = {} // 用户网格数据

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
				// 添加控件
				addControl(mapInstance)
			}

			// 绘制行政区域边界
			const drawAdministrationBoundary = () => {
				const { districtCode, role } = userGridsData
				map.drawAdministrationBoundary(districtCode, {}, role)
			}

			// 绘制网格
			const drawGrids = () => {
				const { ownGridPaths } = userGridsData
				map.renderPolygons(ownGridPaths)
			}

			// 创建网格
			const createGridHandle = () => {
				console.log('开始创建网格')
				const { drawPolygon } = map
				// cursor.value = 'crosshair'

				drawPolygon((event, { code, message, data }) => {
					// cursor.value = 'default'
					if (code === 200) {
						// event.obj 为绘制出来的覆盖物对象
						const { obj } = event
						const params = {
							lngLat: obj.toString(),
							code: data.districtCode,
							area: data.polygonsArea
						}
						getGridInfo(params)
						console.log(params)
					} else {
						Message.warn(message)
					}
				})

				// 获取绘制好的网格信息
				async function getGridInfo(params) {
					console.log(params)
					gridModalVisible.value = true
				}
			}

			// 编辑网格
			const editGridHandle = () => {}

			// 保存网格
			const saveGridHandle = () => {}

			// 删除网格
			const deleteGridHandle = () => {}

			// 批量分配网格
			const batchDispatchGridHandle = () => {
				console.log('批量分配网格')
			}

			// 取消批量分配网格
			const cancelBatchDispatchGridHandle = () => {
				console.log('取消批量分配网格')
			}

			// 获取用户下的网格数据
			const getUserGrids = () => {
				const data = {
					role: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE,
					districtCode: ['654321', '654322'],
					parentGridPaths: [],
					ownGridPaths: [
						{
							id: 1,
							path: '88.728894,46.378336;89.830638,46.415792;89.00045,45.921459',
							area: 2193538097,
							parentId: '',
							districtCode: '654322'
						},
						{
							id: 2,
							path: '89.00045,47.170069;89.923743,47.038041;88.705618,46.415792;88.635789,46.698555',
							area: 3679792104,
							parentId: '',
							districtCode: '654322'
						}
					]
				}
				userGridsData = dealDataHandle(data)
			}

			// 处理网格数据
			const dealDataHandle = data => {
				// 父级的网格角色就是ORGANZITION_ADMIN_ROLE 只有两种角色
				data.parentGridPaths =
					(data.parentGridPaths.length &&
						data.parentGridPaths.map(({ path, area, ...rest }) => ({
							...rest,
							path: strTransferLngLat(path),
							area,
							role: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE
						}))) ||
					[]
				// 自己的网格角色就是当前用户的角色
				data.ownGridPaths = data.ownGridPaths.map(({ path, area, ...rest }) => ({
					...rest,
					path: strTransferLngLat(path),
					area,
					role: data.role
				}))
				return data
			}

			onMounted(() => {
				// 渲染地图
				renderMap()
				// 获取用户网格数据
				getUserGrids()
				// 绘制行政区域边界
				drawAdministrationBoundary()
				// 绘制网格
				drawGrids()
			})

			return {
				infoData,
				gridDrawerVisible,
				gridModalVisible,
				createGridHandle,
				editGridHandle,
				saveGridHandle,
				deleteGridHandle,
				batchDispatchGridHandle,
				cancelBatchDispatchGridHandle
			}
		}
	})
</script>

<style lang="scss" scoped></style>
