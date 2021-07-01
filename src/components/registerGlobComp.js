/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 18:07:02
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-30 13:41:23
 */
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { Button, Input } from 'ant-design-vue'
const IconFont = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_2642258_4oojpy3gzfd.js'
})

const compList = []

export function registerGlobComp(app) {
	compList.forEach(comp => {
		app.component(comp.name || comp.displayName, comp)
	})
	app.use(Input).use(Button)

	app.component('IconFont', IconFont)
}
