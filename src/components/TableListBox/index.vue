<!--
 * @Description:table容器组件
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-06 18:24:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 09:54:22
-->
<template>
	<div class="table-list-box">
		<div v-if="showFunctionBtn" class="clearfix">
			<div v-if="showLeft" class="fl">
				<slot name="left" />
			</div>

			<div v-if="showRight" class="fr right">
				<slot name="right" />
			</div>
		</div>

		<slot />

		<div v-if="showFooter" class="mt-6 text-right">
			<slot name="footer" />
		</div>
	</div>
</template>

<script>
	import { defineComponent, computed } from 'vue'
	export default defineComponent({
		name: 'TableListBox',
		setup(_, { slots }) {
			const showFunctionBtn = computed(() => {
				const { left = [], right = [] } = slots
				return left.length + right.length
			})
			const showLeft = computed(() => slots?.left?.length)
			const showRight = computed(() => slots?.right?.length)
			const showFooter = computed(() => slots?.footer?.length)

			return {
				showFunctionBtn,
				showLeft,
				showRight,
				showFooter
			}
		}
	})
</script>

<style lang="scss" scoped>
	.table-list-box :deep {
		.ant-table {
			margin-top: 24px;
		}

		.ant-dropdown {
			margin-left: 12px;
		}
	}
</style>
