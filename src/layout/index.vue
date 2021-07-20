<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 13:59:31
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 12:33:07
-->
<template>
	<Layout class="app-wrapper">
		<LayoutSider v-model:collapsed="collapsed" :collapsed-width="48" :width="sideBarWidth" :trigger="null" collapsible>
			<Sider />
		</LayoutSider>

		<Layout>
			<LayoutHeader class="header">
				<Header />
			</LayoutHeader>

			<Layout>
				<LayoutContent class="content-wrapper">
					<Content />
				</LayoutContent>
			</Layout>
		</Layout>
	</Layout>
</template>

<script>
	import { defineComponent, computed } from 'vue'
	import { useStore } from 'vuex'
	import { Layout } from 'ant-design-vue'
	import { Header, Sider, Content } from './components'
	import { sideBarWidth } from 'src/styles/variables.module.scss'

	export default defineComponent({
		name: 'DefaultLayout',
		components: {
			Layout,
			LayoutHeader: Layout.Header,
			LayoutSider: Layout.Sider,
			LayoutContent: Layout.Content,
			Header,
			Sider,
			Content
		},
		setup() {
			const store = useStore()
			const collapsed = computed(() => store.state.app.sidebar.collapsed)
			return {
				collapsed,
				sideBarWidth
			}
		}
	})
</script>

<style lang="scss" scoped></style>
