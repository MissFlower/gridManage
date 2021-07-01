/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-28 18:11:03
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-29 16:45:19
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
