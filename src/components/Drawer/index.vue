<!--
 * @Description: 抽屉
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 15:53:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-29 18:36:24
-->
<template>
	<Drawer v-bind="$attrs" class="drawer">
		<div class="drawer-content">
			<slot />
		</div>

		<div class="absolute bottom-0 right-0 z-10 px-4 py-3 text-right bg-white border-gray-200 border-t border-solid w-full space-x-3">
			<slot name="footer">
				<AButton @click="cancelHandle">取消</AButton>
				<AButton type="primary" @click="saveHandle">保存</AButton>
			</slot>
		</div>
	</Drawer>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Drawer } from 'ant-design-vue'

	export default defineComponent({
		name: 'DrawerWrapper',
		components: {
			Drawer
		},
		emits: ['update:visible', 'save', 'close'],
		setup(_, { emit }) {
			const cancelHandle = () => {
				emit('update:visible', false)
				emit('close')
			}

			const saveHandle = () => {
				emit('save')
			}

			return {
				cancelHandle,
				saveHandle
			}
		}
	})
</script>
<style lang="scss" scoped>
	:deep .ant-drawer-header {
		padding: 24px 12px;
	}
</style>
