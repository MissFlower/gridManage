<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 11:01:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-05 11:24:11
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
	import { useRoute } from 'vue-router'
	import { useWatermark } from 'src/hooks/useWatermark'
	import settings from 'src/settings'
	import Loading from 'src/components/Loading/index.vue'
	export default defineComponent({
		name: 'App',
		components: {
			ConfigProvider,
			Loading
		},
		setup() {
			const store = useStore()
			const route = useRoute()
			const loading = ref(false)
			const { title } = settings
			const { setWatermark, clear } = useWatermark()
			useTitle()
			watchEffect(() => {
				const { username, phone } = store.getters.userInfo
				const waterText = username + phone?.slice(-4) || title
				loading.value = store.state.common.requestCount > 0
				setWatermark(waterText)
				route?.meta?.hideWatermark && clear()
			})

			return {
				loading,
				locale: zhCN
			}
		}
	})
</script>
