<!--
 * @Description:图例信息
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 11:33:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 18:39:34
-->
<template>
	<div class="legend-wrapper">
		<div v-for="({ color, name }, key) of legendData" :key="key" class="legend-item">
			<IconFont type="icon-map-thumbtack-full" :style="{ color }" class="legend-icon" />
			<span class="legend-name">{{ name }}</span>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'LegendInfo',
		setup() {
			const legendData = [
				{
					color: '#04D919',
					name: '自营团队门店'
				},
				{
					color: '#02A7F0',
					name: '直营创建门店'
				},
				{
					color: '#F59A24',
					name: '公海推荐门店'
				},
				{
					color: '#8400FF',
					name: '公海地图门店'
				}
			]

			return {
				legendData
			}
		}
	})
</script>

<style lang="scss" scoped>
	.legend-wrapper {
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		width: 240px;
		flex-wrap: wrap;
		background-color: #fff;

		.legend-item {
			flex: 0 1 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.legend-icon {
				margin-top: 3px;
			}

			.legend-name {
				margin-left: 2px;
			}
		}
	}
</style>
