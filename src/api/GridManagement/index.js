/*
 * @Description: 网格化管理api
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-07-07 15:57:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-07-16 17:50:04
 */
import request from 'src/utils/request'

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003830'
 ** 获取用户表格数据 参数 - 说明(是否必填)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 15:58:22
 */
export function getUserGridsData() {
	return request.get('/manage/shopGrid/queryAreaAndGrid')
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003831'
 ** 获取网格信息 参数 - 说明(是否必填)
 * @param pointInfo 点位信息(是)
 * @param area 面积(是)
 * @param gridId 网格父ID(否)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:27:21
 */
export function getAddGridData(params) {
	return request.get('/manage/shopGrid/checkGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003831'
 ** 获取网格信息 参数 - 说明(是否必填)
 * @param pointInfo 点位信息(是)
 * @param area 面积(是)
 * @param gridId 网格父ID(否)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:27:21
 */
export function getEditGridData(params) {
	return request.get('/manage/shopGrid/updateCheckGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003834'
 ** 编辑保存网格 参数 - 说明(是否必填)
 * @param id 	网格ID(是)
 * @param gridAddress 网格点经纬度(是)
 * @param gridArea 网格面积(是)
 * @param districtCode 网格归属区域code(是)
 * @param mapType 地图类型（1:签约地图 2:维护地图）(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 16:06:46
 */
export function editSaveGrid(params) {
	return request.post('/manage/shopGrid/modifyGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003833'
 ** 新增保存网格 参数 - 说明(是否必填)
 * @param gridName 网格名称(是)
 * @param gridAddress 网格点经纬度(是)
 * @param gridArea 网格面积(是)
 * @param averageFlow 日均流水(是)
 * @param selfShopNum 自营团队门店数(是)
 * @param directShopNum 直营创建门店数(是)
 * @param publicRecommendNum 公海推荐门店数(是)
 * @param publicMapNum 公海地图门店数(是)
 * @param districtCode 网格归属区域code(是)
 * @param pid 父网格ID(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:36:35
 */
export function addSaveGrid(params) {
	return request.post('/manage/shopGrid/saveGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003836'
 ** 删除网格 参数 - 说明(是否必填)
 * @param gridId 	网格ID(是)
 * @param mapType 地图类型（1:签约地图 2:维护地图）(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:38:58
 */
export function deleteGrid(params) {
	return request.get('/manage/shopGrid/deleteGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003827'
 ** 获取附近的门店信息 参数 - 说明(是否必填)
 * @param longitude 经度(是)
 * @param latitude 纬度(是)
 * @param type 门店ID 0:全部 1:直营 2:点评 3:竞品(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:40:29
 */
export function getNearbyShopForGrid(params) {
	return request.get('/manage/shopGrid/queryNearbyShopForGrid', params, { loading: false })
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003823'
 ** 获取门店信息 参数 - 说明(是否必填)
 * @param shopId 门店ID(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 鲍少丹
 * @Date 2021-07-07 17:42:45
 */
export function getShopInfo(params) {
	return request.get('/manage/shopGrid/queryShopInfoForGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003794'
 ** 获取热力图数据 参数 - 说明(是否必填)
 * @param northEast 区域坐标东北角经纬度(是)
 * @param southWest 区域坐标西南角经纬度(是)
 * @param shopType 门店类型(是)
 * @param mapZoom zoom值(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-07-07 17:45:19
 */
export function getHeatMapList(params) {
	return request.post('/manage/hotMap/getHotMapList', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003824'
 ** 网格变更记录列表查询 参数 - 说明(是否必填)
 * @param startDate 操作开始时间(否)
 * @param endDate 操作截至时间(否)
 * @param mapType 操作地图 空串：全部；1:签约地图 2:维护地图(否)
 * @param optType 操作类型 空串：全部；1:新增网格 2:网格变更 3:负责人变更 4:维护人变更 5:人员变更 6:删除网格(否)
 * @param optUserName 操作人姓名(否)
 * @param optOrgName 操作机构(否)
 * @param gridName 操作网格(否)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 梁华强
 * @Date 2021-07-07 17:47:45
 */
export function getRecordList(params) {
	return request.post('/manage/shopGridChangeLog/getRecordList', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003854'
 ** 获取可以分配网格给机构(CM给网格分配小组时使用) 参数 - 说明(是否必填)
 * @param regionCode 行政区域编码(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 胡文
 * @Date 2021-07-10 12:39:25
 */
export function getDispatchOrganization(params) {
	return request.get('/manage/organization/listOrgForGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003855'
 ** 获取可以分配网格的销售(BDM给网格分配负责人维护人时使用) 参数 - 说明(是否必填)
 * @param regionCode 行政区域编码(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 胡文
 * @Date 2021-07-10 12:43:17
 */
export function getDispatchBd(params) {
	return request.get('/manage/authUser/listUserForGrid', params)
}

/**
 * APIURL: 'https://www.tapd.cn/48625949/markdown_wikis/show/#1148625949001003856'
 ** 分配网格的负责人,维护人,机构 参数 - 说明(是否必填)
 * @param sellerId 负责人ID 操作类型为用户是负责人和维护人必须有一个(否)
 * @param maintainId 维护人ID 操作类型为用户是负责人和维护人必须有一个(否)
 * @param orgId 机构ID 操作类型为机构时必填(否)
 * @param gridIds 网格ID(是)
 * @param operation 操作类型 1用户(负责人,维护人),2机构(是)
 * @param mapType 地图类型(是)
 * @FrontendAuthor 艾东阳
 * @BackendAuthor 胡文
 * @Date 2021-07-10 12:45:01
 */
export function dispatchGrid(params) {
	return request.post('/manage/shopGrid/saveGridAuthOrg', params)
}
