<!--
 * @Description: 网格分配抽屉
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 15:30:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-13 16:26:33
-->
<template>
	<Drawer v-bind="$attrs" title="网格分配" :mask="false" :closable="false" @save="saveHandle" @close="closeHandle">
		<Form>
			<div class="grid-name-wrap">
				<p>网格名:</p>
				<FormItem v-bind="validateInfos.gridIds">
					<div v-show="gridInfoList.length" class="grid-name-content">
						<span v-for="{ id, gridName } of gridInfoList" :key="id" class="grid-name-item">{{ gridName }}</span>
					</div>
				</FormItem>
			</div>

			<div class="grid-info-wrap">
				<div class="grid-info-item">自营团队门店数: {{ selfSupportShopCount }}</div>
				<div class="grid-info-item">店日均流水总和: {{ averageFlows }}</div>
				<div class="grid-info-item">直营创建门店数: {{ redictSupportShopCount }}</div>
				<div class="grid-info-item">公海推荐门店数: {{ seasRecommendShopCount }}</div>
				<div class="grid-info-item">公海地图门店数: {{ seasMapShopCount }}</div>
			</div>
			<div v-if="role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE" class="org-radio-wrapper">
				<span>机构分配</span>
				<FormItem v-bind="validateInfos.orgId">
					<RadioGroup v-model:value="orgId" class="org-radio-group">
						<Radio v-for="{ id, orgName } of orgOrbdList" :key="id" :value="id" class="radio-item">{{ orgName }}</Radio>
					</RadioGroup>
				</FormItem>
			</div>

			<div v-if="role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE">
				<FormItem v-bind="validateInfos.orgId">
					<Select v-model:value="orgId" placeholder="请选择机构" class="group-select">
						<SelectOption v-for="{ orgName, orgId } of orgOrbdList" :key="orgId" :value="orgId">{{ orgName }}</SelectOption>
					</Select>
				</FormItem>

				<div class="radio-wrapper">
					<div class="duty-radio-group">
						<span>负责人选择</span>

						<FormItem v-bind="validateInfos.sellerId">
							<RadioGroup v-model:value="sellerId">
								<Radio v-for="{ userId, userName } of currentBdList" :key="userId" :value="userId" class="radio-item">{{ userName }}</Radio>
							</RadioGroup>
						</FormItem>
					</div>
					<div class="maintain-radio-group">
						<span>维护人选择</span>
						<FormItem v-bind="validateInfos.maintainId">
							<RadioGroup v-model:value="maintainId">
								<Radio v-for="{ userId, userName } of currentBdList" :key="userId" :value="userId" class="radio-item">{{ userName }}</Radio>
							</RadioGroup>
						</FormItem>
					</div>
				</div>
			</div>
		</Form>
	</Drawer>
</template>

<script>
	import { defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
	import { Form, Select, Radio } from 'ant-design-vue'
	import Drawer from 'src/components/Drawer/index.vue'
	import { ADMIN_ROLE_TYPE } from 'src/common/constant'
	import { dispatchGrid } from 'src/api/GridManagement'

	const DISPATCH_ROLE = {
		[ADMIN_ROLE_TYPE.BD_ADMIN_ROLE]: 0, // 给用户分配
		[ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE]: 1 // 给机构分配
	}
	export default defineComponent({
		name: 'GridDrawer',
		components: {
			Drawer,
			Select,
			SelectOption: Select.Option,
			Radio,
			RadioGroup: Radio.Group,
			Form,
			FormItem: Form.Item
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
			},
			orgOrbdList: {
				type: Object,
				required: true
			},
			gridInfoList: {
				type: Object,
				required: true
			}
		},
		emits: ['close', 'dispatched'],
		setup(props, { emit }) {
			let state = reactive({
				orgId: undefined, // 机构id
				sellerId: '', // 负责人id
				maintainId: '', // 维护人id
				gridIds: [], // 网格id
				currentBdList: [],
				selfSupportShopCount: 0, // 自营门店数
				averageFlows: 0, // 日均门店流水总和
				redictSupportShopCount: 0, // 自营门店数
				seasRecommendShopCount: 0, // 公海推荐门店数
				seasMapShopCount: 0 // 公海地图门店数
			})
			const useForm = Form.useForm

			const checkGridIds = async (rule, value) => {
				if (!value.length) {
					return Promise.reject('请选择网格！')
				} else {
					return Promise.resolve()
				}
			}
			const rulesRef = reactive({
				orgId: [{ required: true, message: '请选择机构' }],
				sellerId: [{ required: true, message: '请选择负责人' }],
				maintainId: [{ required: true, message: '请选择维护人' }],
				gridIds: [{ validator: checkGridIds, message: '请选择网格' }]
			})

			watch(
				() => state.orgId,
				newVal => {
					if (props.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE && newVal !== undefined) {
						state.currentBdList = props.orgOrbdList.find(item => newVal === item.orgId).userList
					}
				}
			)

			watch(
				() => props.gridInfoList,
				newVal => {
					if (newVal.length === 0) {
						state.selfSupportShopCount = 0
						state.averageFlows = 0
						state.redictSupportShopCount = 0
						state.seasRecommendShopCount = 0
						state.seasMapShopCount = 0
					}
					state = newVal.reduce((prev, cur, index) => {
						if (index === 0) {
							prev.selfSupportShopCount = 0
							prev.averageFlows = 0
							prev.redictSupportShopCount = 0
							prev.seasRecommendShopCount = 0
							prev.seasMapShopCount = 0
						}
						prev.selfSupportShopCount += cur.selfShopNum
						prev.averageFlows += cur.averageFlow
						prev.redictSupportShopCount += cur.directShopNum
						prev.seasRecommendShopCount += cur.publicRecommendNum
						prev.seasMapShopCount += cur.publicMapNum
						return prev
					}, state)
				},
				{
					deep: true
				}
			)

			const { resetFields, validate, validateInfos } = useForm(state, rulesRef)

			// 保存
			const saveHandle = async () => {
				state.gridIds = props.gridInfoList.map(grid => grid.id)

				const { orgId, sellerId, maintainId, gridIds } = state

				await nextTick()
				if (props.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE) {
					await validate()
				}
				if (props.role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE) {
					await validate(['orgId', 'gridIds'])
				}
				await dispatchGrid({
					orgId,
					sellerId,
					maintainId,
					gridIds,
					operation: DISPATCH_ROLE[props.role],
					mapType: props.mapType
				})
				state.currentBdList = []
				resetFields()
				emit('close')
				emit('dispatched')
			}

			// 取消
			const closeHandle = () => {
				state.currentBdList = []
				resetFields()
				emit('close')
			}

			return {
				...toRefs(state),
				ADMIN_ROLE_TYPE,
				validateInfos,
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

	.grid-name-item {
		font-weight: 600;
	}

	.grid-info-item {
		height: 24px;
		margin-top: 12px;
		line-height: 24px;

		&:first-child {
			margin-top: 0;
		}
	}

	.group-select {
		width: 100%;
		margin-top: 24px;
		margin-bottom: 12px;
	}

	.org-radio-wrapper {
		display: flex;
		flex-direction: column;
		margin-top: 24px;
	}

	.radio-wrapper {
		display: flex;

		.duty-radio-group,
		.maintain-radio-group {
			flex: 1;
		}
	}

	.radio-item {
		display: block;
		height: 30px;
		line-height: 30px;
	}
</style>
