<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 14:02:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-13 17:55:51
-->
<template>
	<RouterView>
		<template #default="{ Component, route }">
			<transition name="fade-transform" mode="out-in">
				<KeepAlive v-if="false">
					<component :is="Component" :key="route.fullPath" />
				</KeepAlive>

				<component :is="Component" v-else :key="route.fullPath" />
			</transition>
		</template>
	</RouterView>
</template>

<script>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'LayoutContent',
		setup() {}
	})
</script>
