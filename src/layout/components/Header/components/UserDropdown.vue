<!--
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-24 16:54:57
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-15 11:11:49
-->
<template>
	<Dropdown>
		<div>
			<Avatar :width="24" :height="24" :src="avator" />
			<span class="username">{{ username }}</span>
		</div>
		<template #overlay>
			<Menu>
				<!-- <MenuItem @click="modifyPasswordHandle"> 修改密码 </MenuItem>
				<MenuDivider /> -->
				<MenuItem @click="logoutHandle"> 退出登录 </MenuItem>
			</Menu>
		</template>
	</Dropdown>
</template>

<script>
	import { defineComponent, createVNode } from 'vue'
	import { useStore } from 'vuex'
	import { useRouter } from 'vue-router'
	import { Dropdown, Menu, Avatar, Modal } from 'ant-design-vue'
	import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
	export default defineComponent({
		name: 'UserDropdown',
		components: {
			Dropdown,
			Menu,
			MenuItem: Menu.Item,
			// MenuDivider: Menu.Divider,
			Avatar
		},
		setup() {
			const store = useStore()
			const router = useRouter()
			const { avator, username } = store.getters.userInfo

			// 修改密码
			// const modifyPasswordHandle = () => {
			// 	console.log('修改密码')
			// }

			// 退出登录
			const logoutHandle = () => {
				Modal.confirm({
					title: '是否退出登录?',
					icon: createVNode(ExclamationCircleOutlined),
					width: 350,
					centered: true,
					onOk: async () => {
						await store.dispatch('user/logout')
						router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
					}
				})
			}
			return {
				avator: avator || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
				username,
				// modifyPasswordHandle,
				logoutHandle
			}
		}
	})
</script>
