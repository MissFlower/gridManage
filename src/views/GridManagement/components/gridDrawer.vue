<!--
 * @Description: 网格分配抽屉
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 15:30:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:32:16
-->
<template>
	<Drawer v-bind="$attrs" title="网格分配" :mask="false" :closable="false" @save="saveHandle" @close="closeHandle">
		<div class="grid-name-wrap">
			<p>网格名:</p>
			<div class="grid-name-content">
				<span class="grid-name-item">苏州市一组001</span>
				<span class="grid-name-item">苏州市一组001</span>
				<span class="grid-name-item">苏州市一组001</span>
			</div>
		</div>

		<div class="grid-info-wrap">
			<div class="grid-info-item">自营团队门店数: {{ 1 }}</div>
			<div class="grid-info-item">店日均流水总和: {{ 1 }}</div>
			<div class="grid-info-item">直营创建门店数: {{ 1 }}</div>
			<div class="grid-info-item">公海推荐门店数: {{ 1 }}</div>
			<div class="grid-info-item">公海地图门店数: {{ 1 }}</div>
		</div>

		<div v-if="role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE" class="org-radio-wrapper">
			<span>机构分配</span>
			<RadioGroup v-model:value="orgId" class="org-radio-group">
				<Radio v-for="{ id, orgName } of orgList" :key="id" :value="id" class="radio-item">{{ orgName }}</Radio>
			</RadioGroup>
		</div>

		<div v-if="role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE" class="radio-wrapper">
			<Select v-model:value="orgId" class="group-select">
				<SelectOption v-for="{ orgName, orgId } of bdList" :key="orgId" :value="orgId">{{ orgName }}</SelectOption>
			</Select>

			<div class="duty-radio-group">
				<span>负责人选择</span>
				<RadioGroup v-model:value="sellerId">
					<Radio v-for="{ userId, userName } of currentBdList" :key="userId" :value="userId" class="radio-item">{{ userName }}</Radio>
				</RadioGroup>
			</div>
			<div class="maintain-radio-group">
				<span>维护人选择</span>
				<RadioGroup v-model:value="maintainId">
					<Radio v-for="{ userId, userName } of currentBdList" :key="userId" :value="userId" class="radio-item">{{ userName }}</Radio>
				</RadioGroup>
			</div>
		</div>
	</Drawer>
</template>

<script>
	import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
	import { Select, Radio } from 'ant-design-vue'
	import Drawer from 'src/components/Drawer/index.vue'
	import { ADMIN_ROLE_TYPE } from 'src/common/constant'
	import { getDispatchOrganization, getDispatchBd, dispatchGrid } from 'src/api/GridManagement'
	export default defineComponent({
		name: 'GridDrawer',
		components: {
			Drawer,
			Select,
			SelectOption: Select.Option,
			Radio,
			RadioGroup: Radio.Group
		},
		props: {
			role: {
				type: Number,
				default: ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE,
				validator: v => [ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE, ADMIN_ROLE_TYPE.BD_ADMIN_ROLE].includes(v)
			},
			mapType: {
				type: Number,
				required: true
			}
		},
		setup(props) {
			const state = reactive({
				orgId: '1', // 机构id
				groupName: '1',
				sellerId: '1', // 负责人id
				maintainId: '', // 维护人id
				orgList: [],
				bdList: []
			})
			let currentBdList = []
			let gridIds = [] // 网格id
			const batchDispatchGridMethods = {
				[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: getDispatchOrganization,
				[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: getDispatchBd
			}

			props.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE &&
				watch(
					() => state.orgId,
					newVal => {
						currentBdList = bdList.find(item => newVal === item.orgId).userList
					}
				)

			const getDispatchGridTarget = async () => {
				const data = await batchDispatchGridMethods[props.role]()
				if (role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
					state.orgList = data
				} else {
					state.bdList = data
				}
			}

			// 保存
			const saveHandle = async () => {
				console.log('save drawer')
				// const { orgId, sellerId, maintainId } = state
				// await dispatchGrid({
				// 	orgId,
				// 	sellerId,
				// 	maintainId,
				// 	gridIds,
				// 	operation: props.role,
				// 	mapType: props.mapType
				// })
				// gridIds = []
			}

			// 取消
			const closeHandle = () => {
				gridIds = []
			}

			onMounted(() => {
				getDispatchGridTarget()
			})
			return {
				...toRefs(state),
				ADMIN_ROLE_TYPE,
				currentBdList,
				saveHandle,
				closeHandle
			}
		}
	})
</script>

<style lang="scss" scoped>
	.grid-name-content,
	.grid-info-wrap {
		display: flex;
		flex-direction: column;
	}

	.grid-info-item {
		height: 24px;
		margin-top: 12px;
		line-height: 24px;
	}

	.group-select {
		width: 100%;
		margin-top: 24px;
		margin-bottom: 12px;
	}

	.org-radio-wrapper {
		display: flex;
		flex-direction: column;
	}

	.radio-wrapper {
		display: flex;
	}

	.radio-item {
		display: block;
		height: 30px;
		line-height: 30px;
	}
</style>
