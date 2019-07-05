import request from '@/utils/request'
// common
/** 
 * url : 请求接口
 * method:请求类型
 * params:请求参数
 * */ 
export function requestData(url,method,params) {
  return request({
    url: url,
    method: method,
    params:params
  })
}
// 查询应用列表
// export function getGameList() {
//   return request({
//     url: '/gameInfo/list',
//     method: 'get',
//   })
// }
// 修改应用列表信息
// export function changeGameListInfo(params) {
//   return request({
//     url: '/gameInfo/update',
//     method: 'post',
//     params:params
//   })
// }
// 查询母包列表
// export function getMasterPackageList() {
//   return request({
//     url: '/basePackage/list',
//     method: 'get',
//   })
// }
// 修改母包信息
// export function changeMasterPackageInfo(params) {
//   return request({
//     url: '/basePackage/update',
//     method: 'post',
//     params:params

//   })
// }
// 删除母包列表
// export function delMasterPackageList(params) {
//   return request({
//     url: '/basePackage/del',
//     method: 'post',
//     params:params
//   })
// }
// 获取证书列表
// export function getCertificateList() {
//   return request({
//     url: '/certificate/list',
//     method: 'get',
//   })
// }
// 修改证书列表
// export function changeCertificateList(params) {
//   return request({
//     url: '/certificate/update',
//     method: 'post',
//     params:params
//   })
// }
// 删除证书列表
// export function delCertificateList(params) {
//   return request({
//     url: '/certificate/del',
//     method: 'post',
//     params:params
//   })
// }
