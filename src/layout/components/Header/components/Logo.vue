<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:43:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-14 15:45:21
-->
<template>
	<div :class="['logo-wrap', isActive ? 'logo-wrap-hide' : '']">
		<Image :width="60" :height="60" :src="LogoImg" />
		<div class="title">{{ title }}</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Image } from 'ant-design-vue'
	import LogoImg from 'src/assets/images/logo.jpg'
	export default defineComponent({
		name: 'LogoWrapper',
		components: {
			Image
		},
		props: {
			isActive: {
				type: Boolean,
				default: false
			}
		},
		setup() {
			const title = import.meta.env.VITE_GLOB_APP_TITLE
			return {
				title,
				LogoImg
			}
		}
	})
</script>
