<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 15:07:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-02 09:51:48
-->
<template>
	<div class="relative w-full h-full">
		<div class="absolute top-1/4 w-1/2 h-1/2 left-0 right-0 m-auto transform -translate-y-1/4">
			<Image :src="errorPage" width="100%" :preview="false" />
		</div>
		<div class="w-auto absolute top-2/3 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/3">
			<div class="py-2 text-xl text-gray-600">您的访问出错了</div>
			<div class="text-sm text-gray-600">很抱歉，您访问的页面不存在，请检查您输入的地址是否正确</div>
			<Button type="primary" class="mt-3" @click="backHome">返回首页</Button>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Image, Button } from 'ant-design-vue'
	import { useRouter } from 'vue-router'
	import errorPage from 'src/assets/svg/404.svg'
	export default defineComponent({
		name: 'ErrorPage404',
		components: {
			Image,
			Button
		},
		setup() {
			const router = useRouter()
			const backHome = () => {
				router.replace({
					path: '/grid'
				})
			}

			return {
				errorPage,
				backHome
			}
		}
	})
</script>
