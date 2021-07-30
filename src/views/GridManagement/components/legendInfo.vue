<!--
 * @Description:图例信息
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 11:33:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 14:29:16
-->
<template>
	<div class="absolute bottom-3 left-3 flex flex-wrap bg-white w-60">
		<div v-for="({ color, name }, key) of legendData" :key="key" class="w-1/2 flex justify-center items-center">
			<IconFont type="icon-map-thumbtack-full" :style="{ color }" class="mt-0.5" />
			<span class="ml-0.5">{{ name }}</span>
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
