<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:04:20
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 10:55:45
-->
<template>
	<div class="header-wrap">
		<div class="header-left">
			<Toggle :is-active="isCollapsed" @toggleClick="toggleHandle" />
			<Breadcrumb />
		</div>
		<div class="header-right">
			<UserDropdown />
		</div>
	</div>
</template>

<script>
	import { defineComponent, computed } from 'vue'
	import { Toggle, Breadcrumb, UserDropdown } from './components'
	import { useStore } from 'vuex'
	export default defineComponent({
		name: 'LayoutHeader',
		components: {
			Toggle,
			Breadcrumb,
			UserDropdown
		},
		setup() {
			const store = useStore()
			const isCollapsed = computed(() => store.getters.sidebar.collapsed)
			const toggleHandle = () => {
				store.dispatch('app/toggleSideBar')
			}

			return {
				isCollapsed,
				toggleHandle
			}
		}
	})
</script>
