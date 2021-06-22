/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-22 18:03:13
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-22 18:19:57
 */
const modules = import.meta.globEager('./modules/**/*.js')

const routeModuleList = []
console.log(modules)

Object.keys(modules).forEach(key => {
	const module = modules[key].default || {}
	const moduleList = Array.isArray(module) ? [...module] : [module]
	routeModuleList.push(...moduleList)
})

// Basic routing without permission
export const basicRoutes = [...routeModuleList]
