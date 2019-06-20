import {requestData} from '@/api/module'

const channel_package_list = {
    state: {
    tip:'添加',
    tableData:[],
    },
    mutations: {
    SET_CHANNEL_PACKAGE_DATA(state,data){
    state.tableData = data
    }
    },
    actions: {
    // 获取渠道包列表
    getChannelPackage({ commit, state },params) {
    return new Promise((resolve, reject) => {
      requestData('/channelPackage/list','get',params).then((data) => {
        commit('SET_CHANNEL_PACKAGE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    },
    // 删除证书列表
    delChannelPackage({commit,state},params){
    return new Promise((resolve, reject) => {
      requestData('/channelPackage/del','post',params).then((data) => {
        commit('SET_CHANNEL_PACKAGE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    },
    // 修改渠道包列表
    changeChannelPackage({commit,state},params) {
    return new Promise((resolve, reject) => {
      requestData('/channelPackage/update','post',params).then((data)=>{
        commit('SET_CHANNEL_PACKAGE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    }
},




}
export default channel_package_list