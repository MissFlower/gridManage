<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-07 13:22:46
-->
<template>
	<ConfigProvider :locale="locale">
		<RouterView />
		<Loading :loading="loading" />
	</ConfigProvider>
</template>

<script>
	import { defineComponent, watchEffect, ref } from 'vue'
	import { ConfigProvider } from 'ant-design-vue'
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
	import { useTitle } from 'src/hooks/useTitle'
	import { useStore } from 'vuex'
	import Loading from 'src/components/Loading/index.vue'
	export default defineComponent({
		name: 'App',
		components: {
			ConfigProvider,
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
				loading,
				locale: zhCN
			}
		}
	})
</script>
