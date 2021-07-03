/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 11:06:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-02 09:36:27
 */
import path from 'path-browserify'
import { basicRoutes, asyncRoutes, PAGE_NOT_FOUND_ROUTE } from 'src/router/routes'
import * as types from './types'
import { isExternal } from 'src/utils/validate'
/**
 * @Function: 判断当前用户是否具有权限
 * @Description: 使用code确定当前用户是否具有权限
 * @param {permissionList}
 * @param {route}
 * @return {Boolean}
 */
function hasPermission(permissionList, route) {
	if (route.meta?.code) {
		return permissionList.some(permission => permission.code === route.meta.code)
	} else {
		return true
	}
}
/**
 * @Function: 过滤异步路由表
 * @Description: 递归过滤异步路由表
 * @param {asyncRoutes}
 * @param {permissionList}
 * @return {[]}
 */
function filterAsyncRoutes(asyncRoutes, permissionList, baseUrl = '/') {
	const res = []
	asyncRoutes.forEach(route => {
		route.fullPath = isExternal(route.path) ? route.path : path.resolve(baseUrl, route.path)

		const tmp = { ...route }

		if (hasPermission(permissionList, route)) {
			if (tmp.children) {
				tmp.children = filterAsyncRoutes(tmp.children, permissionList, route.fullPath)
			}
			res.push(tmp)
		}
	})
	return res
}

const withFullPathContantRoutes = (function setFullPathBasicRoutes(basicRoutes, baseUrl = '/') {
	const res = []
	basicRoutes.forEach(route => {
		route.fullPath = isExternal(route.path) ? route.path : path.resolve(baseUrl, route.path)

		const tmp = { ...route }

		if (tmp.children) {
			tmp.children = setFullPathBasicRoutes(tmp.children, route.fullPath)
		}
		res.push(tmp)
	})
	return res
})(basicRoutes)

const state = {
	routes: [...basicRoutes],
	addRoutes: []
}

const mutations = {
	[types.SET_ROUTES]: (state, routes) => {
		state.addRoutes = routes
		state.routes = routes.concat(withFullPathContantRoutes)
	}
}

const actions = {
	[types.generateRoutes]({ commit }, permissionList) {
		return new Promise(resolve => {
			const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissionList)
			commit(types.SET_ROUTES, accessedRoutes)
			resolve(accessedRoutes.concat(PAGE_NOT_FOUND_ROUTE))
		})
	}
}

export default {
	name: 'permission',
	namespaced: true,
	state,
	mutations,
	actions
}
