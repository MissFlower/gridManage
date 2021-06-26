<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 10:46:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-23 10:49:36
-->

<template>
	<IconFont v-if="icon" :type="icon" />
	<span>{{ title }}</span>
	<!-- <a-tag :color="tag.color" v-if="tag.value"> {{ tag.value }} </a-tag> -->
</template>
<script>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'MenuItem',
		props: {
			icon: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			}
		},
		setup() {}
	})
</script>
