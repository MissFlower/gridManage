<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:43:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-20 12:26:53
-->
<template>
	<div class="logo-wrap" :class="{ collapse: collapse }">
		<Image v-if="Logo" :src="Logo" class="logo" />
		<h1 v-show="!collapse" class="title ellipsis">{{ title }} </h1>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Image } from 'ant-design-vue'
	import Logo from 'src/assets/images/logo.jpg'
	export default defineComponent({
		name: 'LogoWrapper',
		components: {
			Image
		},
		props: {
			collapse: {
				type: Boolean,
				required: true
			}
		},
		setup() {
			const title = import.meta.env.VITE_GLOB_APP_TITLE
			return {
				title,
				Logo
			}
		}
	})
</script>
