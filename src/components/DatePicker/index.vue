<!--
 * @Description:日期选择器
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-07 10:39:22
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:39:14
-->
<template>
	<DatePicker v-if="dateType === 'Date'" v-bind="$attrs" />
	<RangePicker v-if="dateType === 'Range'" v-bind="$attrs" :format="format" />
</template>

<script>
	// TODO:month week
	import { defineComponent } from 'vue'
	import { DatePicker } from 'ant-design-vue'
	export default defineComponent({
		name: 'DatePickerWrapper',
		components: {
			DatePicker,
			RangePicker: DatePicker.RangePicker
		},
		props: {
			dateType: {
				type: String,
				default: 'Range',
				validator: v => ['Date', 'Range'].includes(v)
			},
			format: {
				type: String,
				default: 'YYYY-MM-DD'
			}
		},
		setup() {}
	})
</script>

<style lang="scss" scoped></style>
