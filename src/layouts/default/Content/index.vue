<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:02:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:04:19
-->
<template>
	<div>
		<PageLayout />
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import PageLayout from 'src/layouts/page/index.vue'
	export default defineComponent({
		name: 'LayoutContent',
		components: {
			PageLayout
		},
		setup() {
			
		}
	})
</script>

<style lang="scss" scoped></style>
