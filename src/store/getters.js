/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-23 15:31:56
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-23 14:30:19
 */
const getters = {
	sidebar: state => state.app.sidebar,
	routes: state => state.permission.routes,
	addRoutes: state => state.permission.addRoutes,
	userInfo: state => state.user.userInfo,
	menuList: state => state.user.menuList,
	buttonList: state => state.user.buttonList,
	visitedViews: state => state.tabsView.visitedViews,
	cachedViews: state => state.tabsView.cachedViews
}

export default getters
