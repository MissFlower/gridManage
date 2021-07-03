<!--
 * @Description: 网格信息弹窗
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-03 17:01:55
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-03 17:05:53
-->
<template>
	<Modal v-bind="$attrs" @ok="handleOk">
		<div>123</div>
	</Modal>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Modal } from 'ant-design-vue'
	export default defineComponent({
		name: 'GridInfoModal',
		components: {
			Modal
		},
		emits: ['addSave'],
		setup(_, { emit }) {
			const handleOk = () => {
				emit('addSave')
			}

			return {
				handleOk
			}
		}
	})
</script>

<style lang="scss" scoped></style>
