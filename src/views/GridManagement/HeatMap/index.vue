<!--
 * @Description:热力图
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-29 15:06:08
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-08 11:43:22
-->
<template>
	<!-- 热力图容器 -->
	<div v-bind="$attrs" id="heat-map-wrapper" class="map" />

	<!-- 选择门店类型RadioGroup -->
	<RadioGroup v-model:value="shopType" button-style="solid" class="shop-radio-group">
		<RadioButton v-for="(shopTypeName, key) of SHOP_TYPE_NAME" :key="key" :value="+key" class="radio-shop">{{ shopTypeName }}</RadioButton>
	</RadioGroup>

	<div class="legend-wrap">
		<span class="min">稀疏</span>
		<span class="max">密集</span>
	</div>
</template>

<script>
	import { defineComponent, onMounted, toRefs, reactive, watch, onUnmounted } from 'vue'
	import { useMap } from 'src/hooks/useMap'
	import { RadioGroup, RadioButton } from 'ant-design-vue'
	import { SHOP_TYPE, SHOP_TYPE_NAME } from 'src/common/constant'
	import { getHeatMapList } from 'src/api/GridManagement'
	export default defineComponent({
		name: 'HeatMap',
		components: {
			RadioGroup,
			RadioButton
		},
		setup() {
			let map = null
			const ZOOM_DEMARCATION_VALUE = 9 // zoom分界值
			const HEAT_MAP_DEMARCATION_TYPE = {
				ONE_LEVEL: 1,
				TWO_LEVEL: 2
			}
			const state = reactive({
				zoom: 5,
				center: [103.800566, 36.124537],
				northEast: '',
				southWest: '',
				shopType: SHOP_TYPE.ALL,
				mapZoom: HEAT_MAP_DEMARCATION_TYPE.ONE_LEVEL
			})

			watch(
				() => state.zoom,
				(newVal, preVal) => {
					if (newVal <= ZOOM_DEMARCATION_VALUE && preVal > ZOOM_DEMARCATION_VALUE) {
						// 调用一级热力图数据
						state.mapZoom = HEAT_MAP_DEMARCATION_TYPE.ONE_LEVEL
						getHeatMapData()
						return
					}
					if (newVal > ZOOM_DEMARCATION_VALUE && preVal <= ZOOM_DEMARCATION_VALUE) {
						// 调用二级热力图数据
						state.mapZoom = HEAT_MAP_DEMARCATION_TYPE.TWO_LEVEL
						getHeatMapData()
					}
				}
			)
			watch([() => state.shopType, () => state.center], () => {
				// 获取地图的边界范围坐标
				getMapBounds()
				// 获取热力图数据
				getHeatMapData()
			})

			// 渲染地图
			const renderMap = async () => {
				const { zoom, center } = state
				map = useMap('heat-map-wrapper', {
					zoom,
					center,
					zooms: [5, 20],
					plugins: {
						HeatMap: true
					}
				})
				// 添加控件
				addControl()
				// 绑定事件
				bindEvent()
			}

			// 添加控件
			const addControl = () => {
				const { mapInstance } = map
				const toolBar = new AMap.ToolBar({
					position: {
						bottom: '10px',
						right: '10px'
					}
				})
				mapInstance.addControl(toolBar)
			}

			// 获取地图的边界范围坐标
			const getMapBounds = () => {
				const bounds = map.mapInstance.getBounds()
				state.northEast = bounds.northEast.toString()
				state.southWest = bounds.southWest.toString()
			}

			// 获取热力图数据
			const getHeatMapData = async () => {
				const data = await getHeatMapList(state)

				// 设置数据集
				map.heatmap.setDataSet({
					data
					// ...options
				})
			}

			// 地图缩放
			const mapZoomend = () => {
				const { mapInstance } = map
				state.zoom = mapInstance.getZoom()
				console.log(`当前地图zoom为${state.zoom}`)
			}

			// 地图拖拽
			const mapDragend = () => {
				const { mapInstance } = map
				state.center = mapInstance.getCenter()
				console.log(`当前地图zoom为${state.center.toString()}`)
			}

			// 绑定事件
			const bindEvent = () => {
				const { mapInstance } = map
				mapInstance.on('zoomend', mapZoomend)
				mapInstance.on('dragend', mapDragend)
			}

			// 解绑事件
			const unbindEvent = () => {
				const { mapInstance } = map
				mapInstance.off('zoomend', mapZoomend)
				mapInstance.off('dragend', mapDragend)
			}

			onMounted(() => {
				// 渲染地图
				renderMap()
				// 获取地图的边界范围坐标
				getMapBounds()
				// 获取热力图数据
				getHeatMapData()
			})

			onUnmounted(() => {
				unbindEvent()
			})

			return {
				...toRefs(state),
				SHOP_TYPE_NAME
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

	.legend-wrap {
		position: absolute;
		bottom: 30px;
		left: 10px;
		width: 200px;
		height: 32px;
		font-size: 12px;
		background: linear-gradient(to right, blue, #75d3f8 25%, #0f0 50%, #ffea00 75%, red);

		.min {
			position: absolute;
			bottom: -20px;
			left: 0;
			line-height: 20px;
		}

		.max {
			position: absolute;
			right: 0;
			bottom: -20px;
			line-height: 20px;
		}
	}
</style>
