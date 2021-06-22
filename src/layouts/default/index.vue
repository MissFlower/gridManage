<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:59:31
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:13:44
-->
<template>
	<Layout>
		123
		<LayoutHeader />

		<Layout>
			<LayoutSiderBar />

			<Layout>
				<LayoutContent />
			</Layout>
		</Layout>
	</Layout>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Layout } from 'ant-design-vue'
	import LayoutHeader from './Header/index.vue'
	import LayoutSiderBar from './Sider/index.vue'
	import LayoutContent from './Content/index.vue'

	export default defineComponent({
		name: 'DefaultLayout',
		components: {
			Layout,
			LayoutHeader,
			LayoutSiderBar,
			LayoutContent
		},
		setup() {}
	})
</script>

<style lang="scss" scoped></style>
