<!--
 * @Description: 网格信息弹窗
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-03 17:01:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-08 15:33:04
-->
<template>
	<Modal v-bind="$attrs">
		<div class="grid-info-wrap">
			<p>网格名：{{ gridInfo.gridName }}</p>
			<p>店日均流水总和：{{ gridInfo.averageFlow }}</p>
			<p>自营团队门店数：{{ gridInfo.selfShopNum }}</p>
			<p>直营创建门店数：{{ gridInfo.directShopNum }}</p>
			<p>公海推荐门店数：{{ gridInfo.publicRecommendNum }}</p>
			<p>公海地图门店数：{{ gridInfo.publicMapNum }}</p>
		</div>
	</Modal>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Modal } from 'ant-design-vue'
	export default defineComponent({
		name: 'GridInfoModal',
		components: {
			Modal
		},
		props: {
			gridInfo: {
				type: Object,
				required: true
			}
		}
	})
</script>

<style lang="scss" scoped>
	.grid-info-wrap {
		display: flex;
		flex-wrap: wrap;

		p {
			flex: 1 1 50%;
		}
	}
</style>
