<!--
 * @Description: 网格化管理
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 14:31:46
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-29 17:44:09
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
			<RadioButton value="HeatMap">热地图</RadioButton>
		</RadioGroup>

		<!-- 选择门店类型RadioGroup -->
		<RadioGroup v-model:value="shopType" button-style="solid" class="shop-radio-group">
			<RadioButton v-for="(shopTypeName, key) of SHOP_TYPE_NAME" :key="key" :value="+key" :style="shopRadioStyle">{{ shopTypeName }}</RadioButton>
		</RadioGroup>
	</div>
</template>

<script>
	import { defineComponent, ref, watchEffect, shallowRef, reactive } from 'vue'
	import SignMap from './SignMap/index.vue'
	import MaintainMap from './MaintainMap/index.vue'
	import HeatMap from './HeatMap/index.vue'
	import { RadioGroup, RadioButton } from 'ant-design-vue'
	import { SHOP_TYPE, SHOP_TYPE_NAME } from 'src/common/constant'

	export default defineComponent({
		name: 'GridManagement',
		components: {
			SignMap,
			MaintainMap,
			HeatMap,
			RadioGroup,
			RadioButton
		},
		setup() {
			const mapComp = {
				SignMap,
				MaintainMap,
				HeatMap
			}
			const mapType = ref('SignMap')
			const currentMap = shallowRef(null)
			const shopType = ref(SHOP_TYPE.ALL)
			const shopRadioStyle = reactive({
				display: 'block',
				height: '30px',
				lineHeight: '30px'
			})

			watchEffect(() => {
				currentMap.value = mapComp[mapType.value]
			})

			return {
				currentMap,
				mapType,
				SHOP_TYPE_NAME,
				shopType,
				shopRadioStyle
			}
		}
	})
</script>
<style lang="scss" scoped>
	.grid-container {
		position: relative;
		width: 100%;
		height: 100%;

		.map-radio-group {
			position: absolute;
			top: 10px;
			right: 10px;
		}

		.shop-radio-group :deep {
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

		:deep .map {
			width: 100%;
			height: 100%;
		}
	}
</style>
