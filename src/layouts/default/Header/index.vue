<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:04:20
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:13:15
-->
<template>
	<div class="header-wrap">
		123
		<Logo />
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	import Logo from './components/Logo.vue'
	export default defineComponent({
		name: 'LayoutHeader',
		components: {
			Logo
		},
		setup() {}
	})
</script>

<style lang="scss" scoped></style>
