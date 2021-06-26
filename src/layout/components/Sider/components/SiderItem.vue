<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 10:42:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 16:44:32
-->
<template>
	<template v-if="!item.hidden">
		<template
			v-if="
				hasOneShowingChild(item.children, item) &&
				(!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
				!item.alwaysShow
			"
		>
			<MenuItem :key="onlyOneChild.fullPath">
				<AppLink v-if="onlyOneChild.meta" :to="onlyOneChild.fullPath">
					<Item
						:icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
						:title="onlyOneChild.meta.title"
					/>
				</AppLink>
			</MenuItem>
		</template>

		<SubMenu v-else ref="subMenu" :key="item.fullPath">
			<template #title>
				<Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
			</template>
			<SiderItem v-for="child in item.children" :key="child.fullPath" :item="child" />
		</SubMenu>
	</template>
</template>

<script>
	import { defineComponent, ref } from 'vue'
	import { Menu } from 'ant-design-vue'
	import AppLink from './Link.vue'
	import Item from './Item.vue'
	export default defineComponent({
		name: 'SiderItem',
		components: {
			AppLink,
			Item,
			MenuItem: Menu.Item,
			SubMenu: Menu.SubMenu
		},
		props: {
			item: {
				type: Object,
				required: true
			}
		},
		setup() {
			const onlyOneChild = ref(null)

			const hasOneShowingChild = function (children = [], parent) {
				const showingChildren = children.filter(item => {
					if (item.hidden) {
						return false
					} else {
						// 收集所有显示的子路由
						onlyOneChild.value = item
						return true
					}
				})
				// console.log(showingChildren)

				// 当只有一个子路由器时，默认显示子路由器
				if (showingChildren.length === 1) {
					return true
				}

				// 如果没有要显示的子路由器，则显示父路由器
				if (showingChildren.length === 0) {
					onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
					return true
				}

				return false
			}

			return {
				hasOneShowingChild,
				onlyOneChild
			}
		}
	})
</script>
