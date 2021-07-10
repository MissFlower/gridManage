<!--
 * @Description: 地图类型选择器
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-07 09:48:42
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-10 17:35:31
-->
<template>
	<Select v-bind="$attrs">
		<SelectOption v-if="showAllOption" value="">全部</SelectOption>
		<SelectOption v-for="(name, key) in MAP_TYPE_NAME" :key="key" :value="key">{{ name }}</SelectOption>
	</Select>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Select } from 'ant-design-vue'
	import { MAP_TYPE_NAME } from 'src/common/constant'
	export default defineComponent({
		name: 'MapTypeSelect',
		components: {
			Select,
			SelectOption: Select.Option
		},
		props: {
			showAllOption: {
				type: Boolean,
				default: false
			}
		},
		setup() {
			return {
				MAP_TYPE_NAME
			}
		}
	})
</script>
