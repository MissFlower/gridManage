<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 15:07:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-30 11:40:42
-->
<template>
	<div class="relative w-full h-full">
		<div class="absolute top-1/4 w-1/2 h-1/2 left-0 right-0 m-auto transform -translate-y-1/4">
			<Image :src="errorPage" width="100%" :preview="false" />
		</div>
		<div class="w-auto absolute top-2/3 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2">
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

<style lang="scss" scoped>
	.no-fount-wrapper :deep {
		position: relative;
		width: 100%;
		height: 100%;
		transform: translate(0, 0);

		.ant-image {
			position: absolute;
			top: -24%;
			right: 0;
			bottom: 0;
			left: 0;
			width: 50%;
			height: 50%;
			margin: auto;
		}

		.tips-container {
			position: absolute;
			top: 65%;
			left: 50%;
			width: 400px;
			text-align: center;
			transform: translate(-50%);

			.image {
				width: 300px;
				height: 300px;
				margin-top: 10vh;
			}

			.tip-text {
				height: 36px;
				font-size: 14px;
				line-height: 36px;
				color: #333;
			}

			.back-index {
				margin-top: 12px;
			}
		}
	}
</style>
