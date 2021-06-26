/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 18:07:02
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-24 18:53:17
 */
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { Button, Input } from 'ant-design-vue'
const IconFont = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_2158924_4dfgz79nz4h.js'
})

const compList = []

export function registerGlobComp(app) {
	compList.forEach(comp => {
		app.component(comp.name || comp.displayName, comp)
	})
	app.use(Input).use(Button)
	console.log(app)
	app.component('IconFont', IconFont)
}
