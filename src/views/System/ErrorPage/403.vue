<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 17:59:33
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-02 10:50:44
-->
<template>
	<div class="relative w-full h-full">
		<div class="absolute top-1/4 w-1/2 h-1/2 left-0 right-0 m-auto transform -translate-y-1/4">
			<Image :src="errorPage" width="100%" :preview="false" />
		</div>
		<div class="w-auto absolute top-2/3 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/3">
			<div class="py-2 text-xl text-gray-600">暂无访问权限</div>
			<div class="text-sm text-gray-600">很抱歉，您访问的页面暂无权限，请联系管理员获取权限后访问</div>
			<Button v-if="addRoutes.length && false" type="primary" class="mt-3" @click="backHome">返回首页</Button>
		</div>
	</div>
</template>

<script>
	import { defineComponent, watchEffect } from 'vue'
	import { Image, Button } from 'ant-design-vue'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import errorPage from 'src/assets/svg/403.svg'
	export default defineComponent({
		name: 'ErrorPage403',
		components: {
			Image,
			Button
		},
		setup() {
			const router = useRouter()
			const store = useStore()
			let addRoutes = []

			watchEffect(() => {
				addRoutes = store.getters.addRoutes
				if (!addRoutes.length) {
					store.dispatch('user/resetToken')
				}
			})
			const backHome = () => {
				router.replace({
					path: '/grid'
				})
			}

			return {
				errorPage,
				addRoutes,
				backHome
			}
		}
	})
</script>
