<!--
 * @Description: 地图操作类型选择器
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-07 10:02:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-07 10:20:42
-->
<template>
	<Select v-bind="$attrs">
		<SelectOption v-if="showAllOption" value="">全部</SelectOption>
		<SelectOption v-for="(name, key) in MAP_OPERATE_TYPE" :key="key" :value="key">{{ name }}</SelectOption>
	</Select>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Select, SelectOption } from 'ant-design-vue'
	import { MAP_OPERATE_TYPE } from 'src/common/constant'
	export default defineComponent({
		name: 'MapOperateSelect',
		components: {
			Select,
			SelectOption
		},
		props: {
			showAllOption: {
				type: Boolean,
				default: false
			}
		},
		setup() {
			return {
				MAP_OPERATE_TYPE
			}
		}
	})
</script>

<style lang="scss" scoped></style>
