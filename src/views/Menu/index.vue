<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-01-26 10:44:39
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-23 18:17:59
-->
<template>
	<Card class="about">
		<p>title: {{ title }}</p>
		<p>path: {{ path }}</p>
	</Card>
</template>
<script>
	import { defineComponent, ref } from 'vue'
	import { useRoute } from 'vue-router'
	import { Card } from 'ant-design-vue'
	export default defineComponent({
		components: {
			Card
		},
		setup() {
			const route = useRoute()
			const title = ref(route.meta.title)
			const path = ref(route.path)
			return {
				path,
				title
			}
		}
	})
</script>
