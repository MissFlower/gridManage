<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 17:59:33
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-29 18:39:14
-->
<template>
	<div class="no-fount-wrapper relative w-full h-full">
		<Image :src="errorPage" :preview="false" class="img" />
		<div class="tips-container">
			<div class="tip-text">您暂无访问权限</div>
			<div class="tip-text">很抱歉，您访问的页面暂无权限，请联系管理员获取权限后访问</div>
			<Button v-if="addRoutes.length" type="primary" class="back-index" @click="backHome">返回首页</Button>
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

<style lang="scss" scoped>
	.no-fount-wrapper :deep {
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
