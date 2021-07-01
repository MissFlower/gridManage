<!--
 * @Description: 签约地图
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 15:03:27
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 16:37:55
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
</template>

<script>
	import { defineComponent, onMounted, reactive, ref } from 'vue'
	import ShopInfo from '../components/shopInfo.vue'
	import LegendInfo from '../components/legendInfo.vue'
	import MapButtonGroup from '../components/mapButtonGroup.vue'
	import GridDrawer from '../components/gridDrawer.vue'
	import { useMap } from 'src/hooks/useMap'
	export default defineComponent({
		name: 'SignMap',
		components: {
			ShopInfo,
			LegendInfo,
			MapButtonGroup,
			GridDrawer
		},
		setup() {
			const infoData = reactive({
				src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
			})
			const gridDrawerVisible = ref(false)
			let map = null

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
				const { mapInstance, drawAdministrationBoundary } = map
				addControl(mapInstance)
				drawAdministrationBoundary(['654321', '654322'])
			}

			// 创建网格
			const createGridHandle = () => {
				console.log('开始创建网格')
				const { drawPolygon } = map
				drawPolygon()
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

			onMounted(() => {
				renderMap()
			})

			return {
				infoData,
				gridDrawerVisible,
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
