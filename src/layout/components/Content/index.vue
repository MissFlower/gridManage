<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:02:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-23 15:16:17
-->
<template>
	<RouterView>
		<template #default="{ Component, route }">
			<transition name="fade-transform" mode="out-in" appear>
				<KeepAlive :include="cachedViews">
					<component :is="Component" :key="route.fullPath" />
				</KeepAlive>
			</transition>
		</template>
	</RouterView>
</template>

<script>
	import { computed, defineComponent } from 'vue'
	import { useStore } from 'vuex'
	export default defineComponent({
		name: 'LayoutContent',
		setup() {
			const store = useStore()
			const cachedViews = computed(() => [...store.getters.cachedViews])

			return {
				cachedViews
			}
		}
	})

	// export default {
	// 	name: 'LayoutContent',
	// 	computed: {
	// 		cachedViews() {
	// 			console.log(this.$store.state.tabsView.cachedViews)
	// 			return this.$store.state.tabsView.cachedViews
	// 		},
	// 		key() {
	// 			return this.$route.path
	// 		}
	// 	}
	// }
</script>
