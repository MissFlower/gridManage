<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-22 11:01:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-26 15:57:26
-->
<template>
	<Dropdown :trigger="['contextmenu']" @visibleChange="visible => dropdownChangeHandle(visible, tabItem)">
		<div class="tab-title">{{ tabItem.title }}</div>
		<template #overlay>
			<Menu>
				<template v-for="{ title, value, disabled = false, divider = false } of TAB_MENU_LIST" :key="value">
					<MenuItem :disabled="disabled" @click="tabItemClick(value)">{{ title }}</MenuItem>
					<MenuDivider v-if="divider" />
				</template>
			</Menu>
		</template>
	</Dropdown>
</template>

<script>
	import { defineComponent, nextTick, computed, reactive } from 'vue'
	import { Dropdown, Menu } from 'ant-design-vue'
	import { useStore } from 'vuex'
	import { useRoute } from 'vue-router'
	import { useGo, useRedo } from 'src/hooks/usePage'
	const [REFLESH, CLOSE_TAB, CLOSE_LEFT_TAB, CLOSE_RIGHT_TAB, CLOSE_OTHERS_TAB, CLOSE_ALL_TAB] = [1, 2, 3, 4, 5, 6]

	export default defineComponent({
		name: 'TabContent',
		components: {
			Dropdown,
			Menu,
			MenuItem: Menu.Item,
			MenuDivider: Menu.Divider
		},
		props: {
			tabItem: {
				type: Object,
				default: null
			},
			affixTabs: {
				type: Array,
				default: () => []
			}
		},
		setup(props) {
			const store = useStore()
			const route = useRoute()
			const go = useGo()
			const redo = useRedo()
			const visitedViews = computed(() => store.state.tabsView.visitedViews)
			const state = reactive({
				current: null,
				currentIndex: 0
			})
			const TAB_MENU_LIST = computed(() => {
				const curItem = state.current
				const index = state.currentIndex
				const refleshDisabled = curItem ? curItem.fullPath !== route.fullPath : true
				const leftDisabled = index === 0
				const rightDisabled = index === store.getters.visitedViews.length - 1 && store.state.tabsView.lastDragEndIndex >= 0
				const disabled = store.getters.visitedViews.length === 1
				const { meta } = visitedViews.value.find(view => view.fullPath === props.tabItem.fullPath)
				const dropMenuList = [
					{
						title: '刷新',
						value: REFLESH,
						disabled: refleshDisabled
					},
					{
						title: '关闭标签页',
						value: CLOSE_TAB,
						disabled: !!meta?.affix || disabled,
						divider: true
					},
					{
						title: '关闭左侧标签页',
						value: CLOSE_LEFT_TAB,
						disabled: leftDisabled
					},
					{
						title: '关闭右侧标签页',
						value: CLOSE_RIGHT_TAB,
						disabled: rightDisabled,
						divider: true
					},
					{
						title: '关闭其它标签页',
						value: CLOSE_OTHERS_TAB,
						disabled: disabled
					},
					{
						title: '关闭全部标签页',
						value: CLOSE_ALL_TAB,
						disabled: disabled
					}
				]
				return dropMenuList
			})

			const toCurrentTab = () => visitedViews.value.find(view => view.fullPath === route.fullPath)

			const toLastView = (visitedViews, view) => {
				const latestView = visitedViews.slice(-1)[0]
				if (latestView) {
					go(latestView.fullPath, false)
				} else {
					if (view.name === 'GridManagement') {
						redo(view)
					} else {
						go('/')
					}
				}
			}
			// 刷新tab
			const refleshTabHandle = () => {
				store.dispatch('tabsView/delCachedView', toCurrentTab()).then(() => {
					nextTick(() => {
						redo()
					})
				})
			}

			// 关闭标签页
			const closeTabHandle = () => {
				const view = visitedViews.value.find(view => view.fullPath === props.tabItem.fullPath)
				store.dispatch('tabsView/delView', view).then(({ visitedViews }) => {
					if (props.tabItem.fullPath === route.path) {
						toLastView(visitedViews, view)
					}
				})
			}

			// 关闭左侧标签页
			const closeLeftTabHandle = () => {
				store.dispatch('tabsView/delLeftViews', toCurrentTab())
			}

			// 关闭右侧标签页
			const closeRightTabHandle = () => {
				store.dispatch('tabsView/delRightViews', toCurrentTab())
			}

			// 关闭其它标签页
			const closeOthersTabHandle = () => {
				store.dispatch('tabsView/delOthersViews', toCurrentTab())
			}

			// 关闭全部标签页
			const closeAllTabHandle = () => {
				store.dispatch('tabsView/delAllViews').then(({ visitedViews }) => {
					if (props.affixTabs.some(tab => tab.fullPath === toCurrentTab().fullPath)) {
						return
					}
					toLastView(visitedViews, view)
				})
			}

			const TAB_ITEM_METHODS = {
				[REFLESH]: refleshTabHandle,
				[CLOSE_TAB]: closeTabHandle,
				[CLOSE_LEFT_TAB]: closeLeftTabHandle,
				[CLOSE_RIGHT_TAB]: closeRightTabHandle,
				[CLOSE_OTHERS_TAB]: closeOthersTabHandle,
				[CLOSE_ALL_TAB]: closeAllTabHandle
			}
			const tabItemClick = type => {
				TAB_ITEM_METHODS[type]()
			}
			const dropdownChangeHandle = (visible, tabItem) => {
				if (!visible) {
					return
				}
				console.log(tabItem.fullPath)
				state.current = tabItem
				state.currentIndex = visitedViews.value.findIndex(view => view.fullPath === route.fullPath)
			}
			return {
				REFLESH,
				TAB_MENU_LIST,
				tabItemClick,
				dropdownChangeHandle
			}
		}
	})
</script>

<style lang="scss" scoped>
	.tab-title {
		padding-left: 8px;
		font-size: 12px;
	}
</style>
