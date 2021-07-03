/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 18:11:03
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-02 17:29:45
 */
export const SIZE_TYPE = {
	SMALL: 'small',
	DEFAULT: 'default',
	LARGE: 'large'
}

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

const [ORGANZITION_ADMIN_ROLE, BD_ADMIN_ROLE] = [1, 2]
export const ADMIN_ROLE_TYPE = {
	ORGANZITION_ADMIN_ROLE, // cm及以上角色 在行政区域内绘制网格
	BD_ADMIN_ROLE // bdm角色 在网格内绘制
}
// 单位：平方米
export const GRID_AREA_TYPE = {
	[ORGANZITION_ADMIN_ROLE]: {
		MIN: 1000,
		MAX: 10000000000
	},
	[BD_ADMIN_ROLE]: {
		MIN: 1000,
		MAX: 10000000
	}
}
