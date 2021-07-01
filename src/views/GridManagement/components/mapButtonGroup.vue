<!--
 * @Description: 地图功能按钮组合
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 13:38:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-01 15:48:29
-->
<template>
	<div class="button-group-wrapper">
		<AButton @click.prevent="createGridHandle">新建网格</AButton>
		<AButton @click.prevent="editGridHandle">编辑已有网格</AButton>
		<AButton @click.prevent="saveGridHandle">保存</AButton>
		<AButton @click.prevent="deleteGridHandle">删除网格</AButton>
		<AButton @click.prevent="batchDispatchGridHandle">{{ batchDispatchGridFlag ? '批量分配网格' : '取消批量分配' }}</AButton>
	</div>
</template>

<script>
	import { defineComponent, ref } from 'vue'
	export default defineComponent({
		name: 'MapButtonGroup',
		emits: ['createGrid', 'editGrid', 'saveGrid', 'deleteGrid', 'batchDispatchGrid'],
		setup(_, { emit }) {
			const batchDispatchGridFlag = ref(true)
			const createGridHandle = () => {
				emit('createGrid')
			}

			const editGridHandle = () => {
				emit('editGrid')
			}

			const saveGridHandle = () => {
				emit('saveGrid')
			}

			const deleteGridHandle = () => {
				emit('deleteGrid')
			}

			const batchDispatchGridHandle = () => {
				emit(batchDispatchGridFlag.value ? 'batchDispatchGrid' : 'cancelBatchDispatchGrid')
				batchDispatchGridFlag.value = !batchDispatchGridFlag.value
			}

			return {
				batchDispatchGridFlag,
				createGridHandle,
				editGridHandle,
				saveGridHandle,
				deleteGridHandle,
				batchDispatchGridHandle
			}
		}
	})
</script>

<style lang="scss" scoped>
	.button-group-wrapper :deep {
		position: absolute;
		right: 50px;
		bottom: 10px;
		display: flex;
		flex-direction: column;

		.ant-btn {
			margin-top: 2px;
		}
	}
</style>
