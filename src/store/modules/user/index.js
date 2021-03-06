/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 11:09:24
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-27 17:11:18
 */
import { resetRouter } from 'src/router'
import { getToken, removeToken, setToken } from 'src/utils/cookie'
import { login, getUserInfo, getMenuList, logout } from 'src/api/System'
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
	[types.SET_TOKEN]: (state, hasToken) => {
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
					commit(types.SET_TOKEN, true)
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
					const { trueName, avatar, userId, mobile } = res
					commit(types.SET_USERINFO, { username: trueName, avatar, userId, phone: mobile })
					resolve()
				})
				.catch(error => {
					console.log(error)
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
					commit(
						types.SET_BUTTONLIST,
						button.map(code => +code)
					)
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
			logout(state.token)
				.then(() => {
					commit(types.SET_TOKEN, '')
					commit(types.SET_USERINFO, {})
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
			commit(types.SET_TOKEN, '')
			commit(types.SET_USERINFO, {})
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
