/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 18:11:03
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-19 18:10:08
 */
import SELF_SUPPORT_SHOP_ICON from 'src/assets/images/shop-icon-0.png'
import DIRECT_SUPPORT_SHOP_ICON from 'src/assets/images/shop-icon-1.png'
import SEAS_RECOMMEND_SHOP_ICON from 'src/assets/images/shop-icon-2.png'
import SEAS_MAP_SHOP_ICON from 'src/assets/images/shop-icon-3.png'
// 地图类型
const [SIGN_MAP, MAINTAIN_MAP] = [1, 2]
export const MAP_TYPE = {
	SIGN_MAP,
	MAINTAIN_MAP
}
export const MAP_TYPE_NAME = {
	[MAP_TYPE.SIGN_MAP]: '签约地图',
	[MAP_TYPE.MAINTAIN_MAP]: '维护地图'
}

export const SIZE_TYPE = {
	SMALL: 'small',
	DEFAULT: 'default',
	LARGE: 'large'
}

// 门店类型
const [ALL, DIRECT, COMMENT, RACE] = [0, 1, 2, 3]
export const SHOP_TYPE = {
	ALL,
	DIRECT,
	COMMENT,
	RACE
}
export const SHOP_TYPE_NAME = {
	[SHOP_TYPE.ALL]: '全部',
	[SHOP_TYPE.DIRECT]: '直营',
	[SHOP_TYPE.COMMENT]: '点评',
	[SHOP_TYPE.RACE]: '竞对'
}

const [SELF_SUPPORT_SHOP, DIRECT_SUPPORT_SHOP, SEAS_RECOMMEND_SHOP, SEAS_MAP_SHOP] = [0, 1, 2, 3]
export const SHOP_ICON_TYPE = {
	SELF_SUPPORT_SHOP,
	DIRECT_SUPPORT_SHOP,
	SEAS_RECOMMEND_SHOP,
	SEAS_MAP_SHOP
}
export const MARKER_TYPE_ICON = {
	[SHOP_ICON_TYPE.SELF_SUPPORT_SHOP]: SELF_SUPPORT_SHOP_ICON,
	[SHOP_ICON_TYPE.DIRECT_SUPPORT_SHOP]: DIRECT_SUPPORT_SHOP_ICON,
	[SHOP_ICON_TYPE.SEAS_RECOMMEND_SHOP]: SEAS_RECOMMEND_SHOP_ICON,
	[SHOP_ICON_TYPE.SEAS_MAP_SHOP]: SEAS_MAP_SHOP_ICON
}

// 角色
const [ORGANZITION_ADMIN_ROLE, BD_ADMIN_ROLE] = [1, 2]
export const ADMIN_ROLE_TYPE = {
	ORGANZITION_ADMIN_ROLE, // cm及以上角色 在行政区域内绘制网格
	BD_ADMIN_ROLE // bdm角色 在网格内绘制
}
// 单位：平方米
export const GRID_AREA_TYPE = {
	[ORGANZITION_ADMIN_ROLE]: {
		MIN: 1000000,
		MAX: 10000000000
	},
	[BD_ADMIN_ROLE]: {
		MIN: 1000,
		MAX: 10000000
	}
}
// 负责人变更、维护人变更、网格变更、新增网格、删除网格
const [ADD_GRID, CHANGE_GRID, CHANGE_LEADER, CHANGE_MAINTAINER, CHANGE_PERSONNEL, DELETE_GRID, CHANGE_ORGANZITION] = [1, 2, 3, 4, 5, 6, 7]
export const MAP_OPERATE_TYPE = {
	[ADD_GRID]: '新增网格',
	[CHANGE_GRID]: '网格变更',
	[CHANGE_LEADER]: '负责人变更',
	[CHANGE_MAINTAINER]: '维护人变更',
	[CHANGE_PERSONNEL]: '人员变更',
	[DELETE_GRID]: '删除网格',
	[CHANGE_ORGANZITION]: '机构变更'
}
