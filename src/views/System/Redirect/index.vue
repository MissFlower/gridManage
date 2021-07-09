<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-26 21:27:25
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-09 11:51:38
-->
<template>
	<div />
</template>
<script>
	import { defineComponent, unref } from 'vue'
	import { useRouter } from 'vue-router'

	export default defineComponent({
		name: 'Redirect',
		setup() {
			const { currentRoute, replace } = useRouter()

			const { params, query } = unref(currentRoute)
			const { path } = params

			const _path = Array.isArray(path) ? path.join('/') : path

			replace({
				path: '/' + _path,
				query
			})

			return {}
		}
	})
</script>
