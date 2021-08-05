<!--
 * @Description: 地图功能按钮组合
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 13:38:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-05 14:01:39
-->
<template>
	<div class="flex flex-col absolute right-14 bottom-3" @contextmenu.prevent>
		<AButton :disabled="isEdit || isDispatchGrid" @click.prevent="createGridHandle">新建网格</AButton>
		<AButton :disabled="isEdit || isDispatchGrid || isCreate" class="mt-0.5" @click.prevent="editGridHandle">编辑已有网格</AButton>
		<AButton :disabled="!isEdit || isDispatchGrid || isCreate" class="mt-0.5" @click.prevent="saveGridHandle">保存</AButton>
		<AButton :disabled="isEdit || isDispatchGrid || isCreate" class="mt-0.5" @click.prevent="deleteGridHandle">删除网格</AButton>
		<AButton :disabled="isEdit || isCreate" class="mt-0.5" @click.prevent="batchDispatchGridHandle">{{
			batchDispatchGridFlag ? '批量分配网格' : '取消批量分配'
		}}</AButton>
	</div>
</template>

<script>
	import { defineComponent, ref } from 'vue'
	export default defineComponent({
		name: 'MapButtonGroup',
		props: {
			isCreate: {
				type: Boolean,
				default: false
			},
			isEdit: {
				type: Boolean,
				default: false
			},
			isDispatchGrid: {
				type: Boolean,
				default: false
			}
		},
		emits: ['createGrid', 'editGrid', 'saveGrid', 'deleteGrid', 'batchDispatchGrid', 'cancelBatchDispatchGrid'],
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
