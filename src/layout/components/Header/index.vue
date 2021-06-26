<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:04:20
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 17:09:22
-->
<template>
	<div class="header-wrap">
		<div class="header-left">
			<Logo />
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
	import { Logo, Toggle, Breadcrumb, UserDropdown } from './components'
	import { useStore } from 'vuex'
	export default defineComponent({
		name: 'LayoutHeader',
		components: {
			Logo,
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
