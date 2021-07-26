<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-21 16:58:25
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-26 10:44:23
-->
<template>
	<div class="tabs-view-container">
		<Tabs
			type="editable-card"
			size="small"
			:animated="false"
			:hide-add="true"
			:tab-bar-gutter="3"
			:active-key="activeKeyRef"
			@change="handleChange"
			@edit="handleEdit"
		>
			<template v-for="tab in visitedViews" :key="tab.path">
				<TabPane :closable="!(tab && tab.meta && tab.meta.affix)">
					<template #tab>
						<TabContent :tab-item="tab" :affix-tabs="affixTabs" class="tab" />
					</template>
				</TabPane>
			</template>
		</Tabs>
	</div>
</template>

<script>
	import { computed, defineComponent, onMounted, ref, watch } from 'vue'
	import { Tabs } from 'ant-design-vue'
	import { useRoute } from 'vue-router'
	import { useStore } from 'vuex'
	import TabContent from './components/TabContent.vue'
	import { useGo, useRedo } from 'src/hooks/usePage'
	export default defineComponent({
		name: 'MultipleTabs',
		components: {
			Tabs,
			TabPane: Tabs.TabPane,
			TabContent
		},
		setup() {
			const route = useRoute()
			const store = useStore()
			const go = useGo()
			const redo = useRedo()
			const activeKeyRef = ref('')
			const affixTabs = ref([])
			const routes = computed(() => store.getters.routes)
			const visitedViews = computed(() => store.state.tabsView.visitedViews)
			watch(
				() => route.fullPath,
				() => {
					if (route?.meta?.hideTab) return
					addTabs()
					moveToCurrentTab()
				}
			)
			// 获取固定的tabs
			const filterAffixTabs = routes => {
				let tabs = []
				routes.forEach(route => {
					if (route.meta && route.meta.affix) {
						tabs.push(route)
					}
					if (route.children) {
						const tempTabs = filterAffixTabs(route.children)
						if (tempTabs.length >= 1) {
							tabs = [...tabs, ...tempTabs]
						}
					}
				})
				return tabs
			}
			const initTabs = () => {
				affixTabs.value = filterAffixTabs(routes.value)
				activeKeyRef.value = route.path
				for (const tab of affixTabs.value) {
					// Must have tag name
					if (tab.name) {
						store.dispatch('tabsView/addVisitedView', tab)
					}
				}
			}
			const addTabs = () => {
				const { name } = route
				name && store.dispatch('tabsView/addView', route)
				return false
			}
			const moveToCurrentTab = () => {
				activeKeyRef.value = route.path
			}
			const handleChange = activeKey => {
				activeKeyRef.value = activeKey
				go(activeKey, false)
			}
			// 关闭当前的tab
			const handleEdit = targetKey => {
				// 添加了要隐藏的操作，当前仅使用删除操作
				const view = visitedViews.value.find(view => view.fullPath === targetKey)
				store.dispatch('tabsView/delView', view).then(({ visitedViews }) => {
					if (targetKey === route.path) {
						toLastView(visitedViews, view)
					}
				})
			}

			const toLastView = (visitedViews, view) => {
				const latestView = visitedViews.slice(-1)[0]
				if (latestView) {
					go(latestView.fullPath, false)
				} else {
					// now the default is to redirect to the home page if there is no tags-view,
					// you can adjust it according to your needs.
					if (view.name === 'GridManagement') {
						// to reload home page
						redo(view)
						// router.replace({ path: '/redirect' + view.fullPath })
					} else {
						go('/')
						// router.push('/')
					}
				}
			}

			onMounted(() => {
				initTabs()
				addTabs()
			})
			return {
				activeKeyRef,
				visitedViews,
				affixTabs,
				handleChange,
				handleEdit
			}
		}
	})
</script>

<style lang="scss" scoped>
	.tabs-view-container :deep {
		display: flex;
		height: 32px;
		padding: 0 8px;
		line-height: 32px;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		align-items: center;

		.ant-tabs.ant-tabs-card .ant-tabs-card-bar {
			margin-bottom: 0;
			border-bottom: none;

			.ant-tabs-nav-container {
				height: 28px;
				margin-bottom: 0;
			}

			.ant-tabs-tab {
				height: 28px;
				padding: 0 8px 0 0;
				line-height: 28px;
				background-color: #fff;
				border: 1px solid #d9d9d9;

				& > div {
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>
