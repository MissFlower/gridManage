<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-28 18:34:24
-->
<template>
	<RouterView />
	<Loading :loading="loading" />
</template>

<script>
	import { defineComponent, watchEffect, ref } from 'vue'
	import { useTitle } from 'src/hooks/useTitle'
	import { useStore } from 'vuex'
	import Loading from 'src/components/Loading/index.vue'
	export default defineComponent({
		name: 'App',
		components: {
			Loading
		},
		setup() {
			const store = useStore()
			const loading = ref(false)
			useTitle()
			watchEffect(() => {
				loading.value = store.state.common.requestCount > 0
			})

			return {
				loading
			}
		}
	})
</script>
