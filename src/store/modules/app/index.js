/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 11:04:50
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-25 16:21:58
 */
import Cookies from 'js-cookie'
import * as types from './types'
const state = {
	sidebar: {
		collapsed: +Cookies.get('sidebarStatus') ? !+Cookies.get('sidebarStatus') : true,
		withoutAnimation: false
	},
	device: 'desktop',
	size: Cookies.get('size') || 'medium'
}

const mutations = {
	[types.TOGGLE_SIDEBAR]: state => {
		state.sidebar.collapsed = !state.sidebar.collapsed
		state.sidebar.withoutAnimation = false
		if (state.sidebar.collapsed) {
			Cookies.set('sidebarStatus', 0)
		} else {
			Cookies.set('sidebarStatus', 1)
		}
	}
}

const actions = {
	[types.toggleSideBar]({ commit }) {
		commit(types.TOGGLE_SIDEBAR)
	}
}
export default {
	name: 'app',
	namespaced: true,
	state,
	mutations,
	actions
}
