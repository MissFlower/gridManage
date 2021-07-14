<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 15:07:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-13 16:23:58
-->
<template>
	<div class="no-fount-wrapper">
		<Image src="src/assets/svg/404.svg" class="img" />
		<div class="tips-container">
			<div class="tip-text">您的访问出错了</div>
			<div class="tip-text">很抱歉，您访问的页面不存在，请检查您输入的地址是否正确</div>
			<Button type="primary" class="back-index" @click="backHome">返回首页</Button>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Image, Button } from 'ant-design-vue'
	import { useRouter } from 'vue-router'
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

		.ant-image {
			position: absolute;
			top: -20%;
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
