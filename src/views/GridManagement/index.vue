<!--
 * @Description: 网格化管理
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 14:31:46
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 17:23:13
-->
<template>
	<div class="grid-container">
		<!-- 签约、维护、热力图组件 -->
		<KeepAlive>
			<component :is="currentMap" />
		</KeepAlive>

		<!-- 选择地图RadioGroup -->
		<RadioGroup v-model:value="mapType" button-style="solid" class="map-radio-group">
			<RadioButton value="SignMap">签约地图</RadioButton>
			<RadioButton value="MaintainMap">维护地图</RadioButton>
			<RadioButton value="HeatMap">热力图</RadioButton>
		</RadioGroup>
	</div>
</template>

<script>
	import { defineComponent, ref, watchEffect, shallowRef } from 'vue'
	import { Radio } from 'ant-design-vue'
	import SignMap from './SignMap/index.vue'
	import MaintainMap from './MaintainMap/index.vue'
	import HeatMap from './HeatMap/index.vue'

	export default defineComponent({
		name: 'GridManagement',
		components: {
			SignMap,
			MaintainMap,
			HeatMap,
			RadioGroup: Radio.Group,
			RadioButton: Radio.Button
		},
		setup() {
			const mapComp = {
				SignMap,
				MaintainMap,
				HeatMap
			}
			const mapType = ref('SignMap')
			const currentMap = shallowRef(null)

			watchEffect(() => {
				currentMap.value = mapComp[mapType.value]
			})

			return {
				currentMap,
				mapType
			}
		}
	})
</script>
<style lang="scss" scoped>
	.grid-container :deep {
		position: relative;
		width: 100%;
		height: 100%;

		.map-radio-group {
			position: absolute;
			top: 10px;
			right: 10px;
		}

		.shop-radio-group {
			position: absolute;
			top: 60px;
			right: 10px;

			.ant-radio-button-wrapper {
				border-top: 0;
				border-left: 1px solid #d9d9d9;

				&:first-child {
					border-top: 1px solid #d9d9d9;
					border-radius: 2px 2px 0 0;
				}

				&:last-child {
					border-radius: 0 0 2px 2px;
				}
			}
		}

		.map {
			width: 100%;
			height: 100%;
		}
	}
</style>
