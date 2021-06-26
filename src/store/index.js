/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 10:58:53
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-25 17:25:32
 */
import { createStore } from 'vuex'
import getters from 'src/store/getters'

const files = import.meta.globEager('./modules/**/index.js')
const modules = {}
Object.keys(files).forEach(key => {
	const mod = files[key].default || {}
	const name = mod?.name
	if (!name) {
		throw Error('module name is required!')
	}
	modules[name] = mod
})
const store = createStore({
	modules,
	getters
})
export function setupStore(app) {
	app.use(store)
}

export { store }
