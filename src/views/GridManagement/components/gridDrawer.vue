<!--
 * @Description: 网格分配抽屉
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-30 15:30:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-30 17:27:44
-->
<template>
	<Drawer v-bind="$attrs" title="网格分配" :mask="false" :closable="false" @save="saveHandle">
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

		<Select v-model:value="groupName" class="group-select">
			<SelectOption value="1">苏州市一组</SelectOption>
			<SelectOption value="2">苏州市二组</SelectOption>
			<SelectOption value="3">苏州市三组</SelectOption>
		</Select>

		<div class="radio-wrapper">
			<div class="duty-radio-group">
				<span>负责人选择</span>
				<RadioGroup v-model:value="dutyPerson">
					<Radio value="1" class="radio-item">迈克尔.乔丹</Radio>
					<Radio value="2" class="radio-item">科比.布莱恩特</Radio>
					<Radio value="3" class="radio-item">保罗.乔治</Radio>
				</RadioGroup>
			</div>
			<div class="maintain-radio-group">
				<span>维护人选择</span>
				<RadioGroup v-model:value="maintainPerson">
					<Radio value="1" class="radio-item">迈克尔.乔丹</Radio>
					<Radio value="2" class="radio-item">科比</Radio>
					<Radio value="3" class="radio-item">保罗.乔治</Radio>
				</RadioGroup>
			</div>
		</div>
	</Drawer>
</template>

<script>
	import { defineComponent, reactive, toRefs } from 'vue'
	import { Select, SelectOption, Radio, RadioGroup } from 'ant-design-vue'
	import Drawer from 'src/components/Drawer/index.vue'
	export default defineComponent({
		name: 'GridDrawer',
		components: {
			Drawer,
			Select,
			SelectOption,
			Radio,
			RadioGroup
		},
		setup() {
			const state = reactive({
				groupName: '1',
				dutyPerson: '1',
				maintainPerson: ''
			})
			const saveHandle = () => {
				// 保存
				console.log('save drawer')
			}
			return {
				...toRefs(state),
				saveHandle
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

	.radio-wrapper {
		display: flex;

		.radio-item {
			display: block;
			height: 30px;
			line-height: 30px;
		}
	}
</style>
