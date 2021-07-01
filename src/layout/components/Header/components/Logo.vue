<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:43:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-28 09:45:55
-->
<template>
	<div class="logo-wrap">
		<Image v-if="logo" :width="50" :height="50" :src="logo" />
		<div>{{ title }}</div>
	</div>
</template>

<script>
	import { defineComponent, ref } from 'vue'
	import { Image } from 'ant-design-vue'
	export default defineComponent({
		name: 'LogoWrapper',
		components: {
			Image
		},
		setup() {
			const logo = ref('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png')
			const title = ref('Vue3-Antd-Admin')
			return {
				logo,
				title
			}
		}
	})
</script>
