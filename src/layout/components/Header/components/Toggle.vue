<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 16:06:59
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-13 14:49:14
-->
<template>
	<div class="toggle-container" @click="toggleClick">
		<svg :class="{ 'is-active': isActive }" class="toggle" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
			<path
				d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
			/>
		</svg>
	</div>
</template>

<script>
	import { defineComponent } from 'vue'
	export default defineComponent({
		name: 'Toggle',
		props: {
			isActive: {
				type: Boolean,
				default: false
			}
		},
		emits: ['toggleClick'],
		setup(props, { emit }) {
			function toggleClick() {
				emit('toggleClick')
			}

			return {
				toggleClick
			}
		}
	})
</script>
