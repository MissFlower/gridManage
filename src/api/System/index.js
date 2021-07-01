/*
 * @Description:
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-06-25 15:01:32
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-06-28 13:25:57
 */
import request from 'src/utils/request'
/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001000939'
 ** 登录 参数 - 说明(是否必填)
 * @param username 用户名(是)
 * @param password 密码(是)
 * @param code 验证码值(是)
 * @param uuid 验证码ID(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-06-25 15:01:55
 */
export function login(params) {
	return request.postByBodyAndURL('/auth/login', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001000937'
 ** 获取验证码 参数 - 说明(是否必填)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-06-25 15:12:58
 */
export function getVerifyCode(params) {
	return request.post('/auth/capcha/getCode', params)
}

/**
 * APIURL: ''
 ** 获取用户信息 参数 - 说明(是否必填)
 * @param page 页码(是)
 * @param size 每页条数(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-06-26 11:24:41
 */
export function getUserInfo() {
	return request.get('/auth/getUserInfo')
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001000950'
 ** 获取菜单列表 参数 - 说明(是否必填)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-06-28 13:22:30
 */
export function getMenuList() {
	return request.get('/auth/getMenuList')
}
