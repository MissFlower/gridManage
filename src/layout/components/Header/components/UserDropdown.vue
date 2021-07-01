<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 16:54:57
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-29 17:41:35
-->
<template>
	<Dropdown>
		<div>
			<Avatar :width="24" :height="24" :src="avator" />
			<span class="username">{{ username }}</span>
		</div>
		<template #overlay>
			<Menu>
				<MenuItem> 修改密码 </MenuItem>
				<MenuDivider />
				<MenuItem> 退出登录 </MenuItem>
			</Menu>
		</template>
	</Dropdown>
</template>

<script>
	import { defineComponent } from 'vue'
	import { useStore } from 'vuex'
	import { Dropdown, Menu, Avatar } from 'ant-design-vue'
	export default defineComponent({
		name: 'UserDropdown',
		components: {
			Dropdown,
			Menu,
			MenuItem: Menu.Item,
			MenuDivider: Menu.Divider,
			Avatar
		},
		setup() {
			const store = useStore()
			const { avator, username } = store.getters.userInfo
			return {
				avator: avator || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
				username
			}
		}
	})
</script>
