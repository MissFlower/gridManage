<!--
 * @Description: 网格分配抽屉
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 15:30:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-08-03 11:26:48
-->
<template>
	<Drawer v-bind="$attrs" title="网格分配" :mask="false" :closable="false">
		<Form>
			<div>
				<p>网格名:</p>
				<FormItem v-bind="validateInfos.gridIds">
					<div v-show="gridInfoList.length" class="flex flex-col">
						<span v-for="{ id, gridName } of gridInfoList" :key="id" class="font-semibold">{{ gridName }}</span>
					</div>
				</FormItem>
			</div>

			<div class="flex flex-col mb-4">
				<div class="py-1">自营团队门店数: {{ selfSupportShopCount }}</div>
				<div class="py-1">店日均流水总和: {{ averageFlows }}</div>
				<div class="py-1">直营创建门店数: {{ redictSupportShopCount }}</div>
				<div class="py-1">公海推荐门店数: {{ seasRecommendShopCount }}</div>
				<div class="py-1">公海地图门店数: {{ seasMapShopCount }}</div>
			</div>
			<div v-if="role === ADMIN_ROLE_TYPE.ORGANZITION_ADMIN_ROLE" class="flex flex-col mt-6">
				<span>机构分配</span>
				<FormItem v-bind="validateInfos.orgId">
					<RadioGroup v-model:value="orgId">
						<Radio v-for="{ id, orgName } of orgOrbdList" :key="id" :value="id" :disabled="!isDispatchGrid" class="radio-block-item">
							{{ orgName }}
						</Radio>
					</RadioGroup>
				</FormItem>
			</div>

			<div v-if="role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE">
				<FormItem v-bind="validateInfos.orgId">
					<Select v-model:value="orgId" placeholder="请选择机构" class="w-full mt-6 mb-3">
						<SelectOption v-for="{ orgName, orgId } of orgOrbdList" :key="orgId" :value="orgId">{{ orgName }}</SelectOption>
					</Select>
				</FormItem>

				<FormItem v-bind="validateInfos.sellerAndMaintainId">
					<div class="flex">
						<div class="flex-1">
							<span>负责人选择</span>

							<RadioGroup v-model:value="sellerId">
								<Radio
									v-for="{ userId, userName } of currentBdList"
									:key="userId"
									:value="userId"
									:disabled="!isDispatchGrid"
									class="radio-block-item"
								>
									{{ userName }}
								</Radio>
							</RadioGroup>
						</div>
						<div class="flex-1">
							<span>维护人选择</span>
							<RadioGroup v-model:value="maintainId">
								<Radio
									v-for="{ userId, userName } of currentBdList"
									:key="userId"
									:value="userId"
									:disabled="!isDispatchGrid"
									class="radio-block-item"
								>
									{{ userName }}
								</Radio>
							</RadioGroup>
						</div>
					</div>
				</FormItem>
			</div>
		</Form>
		<template #footer>
			<Button @click="cancelHandle">取消</Button>
			<Button v-if="isDispatchGrid" type="primary" @click="saveHandle">保存</Button>
		</template>
	</Drawer>
</template>

<script>
	import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
	import { Form, Select, Radio, Button } from 'ant-design-vue'
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
			FormItem: Form.Item,
			Button
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
			},
			isDispatchGrid: {
				type: Boolean,
				default: false
			}
		},
		emits: ['close', 'dispatched'],
		setup(props, { emit }) {
			let state = reactive({
				orgId: '', // 机构id
				sellerId: '', // 负责人id
				maintainId: '', // 维护人id
				sellerAndMaintainId: '',
				gridIds: [], // 网格id
				currentBdList: [],
				selfSupportShopCount: 0, // 自营门店数
				averageFlows: 0, // 日均门店流水总和
				redictSupportShopCount: 0, // 自营门店数
				seasRecommendShopCount: 0, // 公海推荐门店数
				seasMapShopCount: 0 // 公海地图门店数
			})
			const useForm = Form.useForm
			state.sellerAndMaintainId = computed(() => state.sellerId || state.maintainId)

			const checkGridIds = async (rule, value) => {
				if (!value.length) {
					return Promise.reject('请选择网格！')
				} else {
					return Promise.resolve()
				}
			}

			const checkSellerAndMaintainId = async (rule, value) => {
				if (!props.isDispatchGrid || value) {
					return Promise.resolve()
				} else {
					return Promise.reject('负责人和维护人至少选择一个！')
				}
			}

			const validatorMsg = name => {
				return computed(() => `${(props.isDispatchGrid ? '请选择' : '暂未分配') + name}`)
			}
			const rulesRef = reactive({
				orgId: [{ required: true, message: validatorMsg('机构') }],
				sellerAndMaintainId: [{ validator: checkSellerAndMaintainId }],
				gridIds: [{ validator: checkGridIds }]
			})

			const { resetFields, validate, validateInfos } = useForm(state, rulesRef)

			watch(
				() => state.orgId,
				newVal => {
					if (props.role === ADMIN_ROLE_TYPE.BD_ADMIN_ROLE && newVal) {
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
					if (!props.isDispatchGrid) {
						state.orgId = newVal[0]?.orgId
						state.sellerId = newVal[0]?.sellerId
						state.maintainId = newVal[0]?.maintainId
					}
				},
				{
					deep: true
				}
			)

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
			const cancelHandle = () => {
				resetFields()
				state.currentBdList = []
				emit('close')
			}

			return {
				...toRefs(state),
				ADMIN_ROLE_TYPE,
				validateInfos,
				saveHandle,
				cancelHandle
			}
		}
	})
</script>
