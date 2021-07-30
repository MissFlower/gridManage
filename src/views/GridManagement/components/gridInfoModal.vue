<!--
 * @Description: 网格信息弹窗
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-03 17:01:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 14:06:58
-->
<template>
	<Modal v-bind="$attrs">
		<div class="flex flex-wrap">
			<p class="w-1/2">网格名：{{ gridInfo.gridName }}</p>
			<p class="w-1/2">店日均流水总和：{{ gridInfo.averageFlow }}</p>
			<p class="w-1/2">自营团队门店数：{{ gridInfo.selfShopNum }}</p>
			<p class="w-1/2">直营创建门店数：{{ gridInfo.directShopNum }}</p>
			<p class="w-1/2">公海推荐门店数：{{ gridInfo.publicRecommendNum }}</p>
			<p class="w-1/2">公海地图门店数：{{ gridInfo.publicMapNum }}</p>
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
