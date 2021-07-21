<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-21 16:58:25
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-21 17:04:15
-->
<template>
	<Tabs
		type="editable-card"
		size="small"
		:animated="false"
		:hide-add="true"
		:tab-bar-gutter="3"
		:active-key="activeKeyRef"
		@change="handleChange"
		@edit="handleEdit"
	>
		<template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
			<TabPane :closable="!(item && item.meta && item.meta.affix)">
				<template #tab>
					<TabContent :tab-item="item" />
				</template>
			</TabPane>
		</template>
	</Tabs>
</template>

<script>
	import { defineComponent } from 'vue'
	import { Tabs } from 'ant-design-vue'
	export default defineComponent({
		name: 'MultipleTabs',
		components: {
			Tabs,
			TabPane: Tabs.TabPane
		},
		setup() {
			const activeKeyRef = ref('')

			const handleChange = () => {}
			const handleEdit = () => {}
			return {
				activeKeyRef,
				handleChange,
				handleEdit
			}
		}
	})
</script>

<style lang="scss" scoped></style>
