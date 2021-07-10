<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 14:34:40
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:34:42
-->
<template>
	<div>
		<SearchFormBox>
			<Form layout="vertical">
				<FormItem label="操作地图" name="mapType">
					<MapTypeSelect v-model:value="form.mapType" show-all-option />
				</FormItem>

				<FormItem label="操作类型" name="optType">
					<MapOperateSelect v-model:value="form.optType" show-all-option />
				</FormItem>

				<FormItem label="操作人" name="optUserName" v-bind="validateInfos.optUserName">
					<Input v-model:value="form.optUserName" />
				</FormItem>

				<FormItem label="操作机构" name="optOrgName" v-bind="validateInfos.optOrgName">
					<Input v-model:value="form.optOrgName" />
				</FormItem>

				<FormItem label="操作网格" name="gridName" v-bind="validateInfos.gridName">
					<Input v-model:value="form.gridName" />
				</FormItem>

				<FormItem label="操作时间" name="dateTime">
					<DatePicker v-model:value="form.dateTime" show-time format="YYYY-MM-DD HH:mm:ss" />
				</FormItem>
			</Form>

			<template #searchBtn>
				<Button type="primary" @click="searchHandle">查询</Button>
				<Button @click="resetHandle">重置</Button>
			</template>
		</SearchFormBox>
		<TableListBox>
			<Table row-key="id" :data-source="tableList" :columns="columns" :scroll="{ x: true }" bordered :pagination="false" size="small" />
		</TableListBox>
	</div>
</template>

<script>
	import { defineComponent, reactive, ref } from 'vue'
	import { Form, Table, Button, Input } from 'ant-design-vue'
	import SearchFormBox from 'src/components/SearchFormBox/index.vue'
	import TableListBox from 'src/components/TableListBox/index.vue'
	import MapTypeSelect from './components/mapTypeSelect.vue'
	import MapOperateSelect from './components/mapOperateSelect.vue'
	import DatePicker from 'src/components/DatePicker/index.vue'
	import { getRecordList } from 'src/api/GridManagement'
	export default defineComponent({
		name: 'GridRecord',
		components: {
			SearchFormBox,
			TableListBox,
			Form,
			FormItem: Form.Item,
			Table,
			Input,
			Button,
			MapTypeSelect,
			MapOperateSelect,
			DatePicker
		},
		setup() {
			const form = reactive({
				mapType: '',
				optType: '',
				optUserName: '',
				optOrgName: '',
				gridName: '',
				dateTime: []
				// dateTime: [moment('2021-7-1'), moment('2021-7-7')]
			})
			const rules = reactive({
				optUserName: [
					{ max: 20, message: '最多输入20个字', trigger: 'change' },
					{ pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{0,20}$/, message: '只支持中英文和数字', trigger: 'change' }
				],
				optOrgName: [
					{ max: 30, message: '最多输入30个字', trigger: 'change' },
					{ pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{0,30}$/, message: '只支持中英文和数字', trigger: 'change' }
				],
				gridName: [
					{ max: 30, message: '最多输入30个字', trigger: 'change' },
					{ pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{0,30}$/, message: '只支持中英文和数字', trigger: 'change' }
				]
			})
			const tableList = ref([])
			const useForm = Form.useForm
			const { resetFields, validate, validateInfos } = useForm(form, rules)

			const columns = [
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
					width: 60
				},
				{
					title: '操作时间',
					dataIndex: 'createdDate',
					key: 'createdDate',
					width: 160
				},
				{
					title: '操作地图',
					dataIndex: 'mapType',
					key: 'mapType',
					width: 100
				},
				{
					title: '操作类型',
					dataIndex: 'optType',
					key: 'optType',
					width: 100
				},
				{
					title: '操作人',
					dataIndex: 'optUserName',
					key: 'optUserName',
					width: 100
				},
				{
					title: '操作机构',
					dataIndex: 'optOrgName',
					key: 'optOrgName',
					width: 100
				},
				{
					title: '操作网格',
					dataIndex: 'gridName',
					key: 'gridName',
					width: 160
				},
				{
					title: '操作说明',
					dataIndex: 'remark',
					key: 'remark',
					ellipsis: true,
					width: 160
				},
				{
					title: '原负责人',
					dataIndex: 'oldSellerName',
					key: 'oldSellerName',
					width: 100
				},
				{
					title: '现负责人',
					dataIndex: 'sellerName',
					key: 'sellerName',
					width: 100
				},
				{
					title: '原维护人',
					dataIndex: 'oldMaintainName',
					key: 'oldMaintainName',
					width: 100
				},
				{
					title: '现维护人',
					dataIndex: 'maintainName',
					key: 'maintainName',
					width: 100
				},
				{
					title: '原自营团队门店数',
					dataIndex: 'oldSelfShopNum',
					key: 'oldSelfShopNum',
					width: 140
				},
				{
					title: '现自营团队门店数',
					dataIndex: 'selfShopNum',
					key: 'selfShopNum',
					width: 130
				},
				{
					title: '原店自营流水总和',
					dataIndex: 'oldAverageFlow',
					key: 'oldAverageFlow',
					width: 130
				},
				{
					title: '现店自营流水总和',
					dataIndex: 'averageFlow',
					key: 'averageFlow',
					width: 130
				},
				{
					title: '原直营创建门店数',
					dataIndex: 'oldDirectShopNum',
					key: 'oldDirectShopNum',
					width: 130
				},
				{
					title: '现直营创建门店数',
					dataIndex: 'directShopNum',
					key: 'directShopNum',
					width: 130
				},
				{
					title: '原公海门店推荐数',
					dataIndex: 'oldPublicRecommendNum',
					key: 'oldPublicRecommendNum',
					width: 130
				},
				{
					title: '现公海门店推荐数',
					dataIndex: 'publicRecommendNum',
					key: 'publicRecommendNum',
					width: 130
				},
				{
					title: '原公海地图门店数',
					dataIndex: 'oldPublicMapNum',
					key: 'oldPublicMapNum',
					width: 130
				},
				{
					title: '现公海地图门店数',
					dataIndex: 'publicMapNum',
					key: 'publicMapNum',
					width: 130
				}
			]
			const getList = async () => {
				await validate()
				const params = {
					...form,
					startDate: form.dateTime[0]?.format('YYYY-MM-DD HH:mm:ss'),
					endDate: form.dateTime[1]?.format('YYYY-MM-DD HH:mm:ss')
				}
				const data = await getRecordList(params)
				tableList.value = []
				tableList.value = data.map((item, index) => ({
					index: index + 1,
					...item
				}))
			}
			// 查询
			const searchHandle = () => {
				getList()
			}

			// 重置
			const resetHandle = () => {
				resetFields()
				getList()
			}

			return {
				form,
				tableList,
				columns,
				validateInfos,
				searchHandle,
				resetHandle
			}
		}
	})
</script>
<style lang="scss" scoped></style>
