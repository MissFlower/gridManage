/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 11:09:24
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-28 14:26:11
 */
import { resetRouter } from 'src/router'
import { getToken, removeToken, setToken } from 'src/utils/cookie'
import { login, getUserInfo, getMenuList } from 'src/api/System'
import * as types from './types'
const state = {
	userInfo: {},
	hasToken: getToken(),
	buttonList: [],
	menuList: []
}

const mutations = {
	[types.SET_USERINFO]: (state, userInfo) => {
		state.userInfo = userInfo
	},
	[types.HAS_TOKEN]: (state, hasToken) => {
		state.hasToken = hasToken
	},
	[types.SET_BUTTONLIST]: (state, buttonList) => {
		state.buttonList = buttonList
	},
	[types.SET_MENULIST]: (state, menuList) => {
		state.menuList = menuList
	}
}

const actions = {
	login({ commit }, params) {
		// 用户登录
		return new Promise((resolve, reject) => {
			login(params)
				.then(() => {
					commit(types.HAS_TOKEN, true)
					setToken(true)
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	getUserInfo({ commit }) {
		// 获取用户信息
		return new Promise((resolve, reject) => {
			getUserInfo()
				.then(res => {
					if (!res) {
						reject('Verification failed, Please Login Aligin!')
					}
					const { trueName, avatar, userId } = res
					commit(types.SET_USERINFO, { username: trueName, avatar, userId })
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	getMenuList({ commit }) {
		// 获取权限列表
		return new Promise((resolve, reject) => {
			getMenuList()
				.then(res => {
					const { button = [], menu = [] } = res
					commit(types.SET_BUTTONLIST, button)
					commit(types.SET_MENULIST, menu)
					resolve(menu)
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			this.logout(state.token)
				.then(() => {
					commit(types.SET_TOKEN, '')
					removeToken()
					resetRouter()
					// reset visited views and cached views
					// dispatch('tagsView/delAllViews', null, { root: true })

					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	resetToken({ commit }) {
		// 重置token
		return new Promise(resolve => {
			commit(types.HAS_TOKEN, '')
			removeToken()
			resolve()
		})
	}
}
export default {
	name: 'user',
	namespaced: true,
	state,
	mutations,
	actions
}
