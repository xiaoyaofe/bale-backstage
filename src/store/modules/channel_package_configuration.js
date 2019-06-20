import {requestData} from '@/api/module'

const channel_package_configuration = {
  state: {
    tip:'绑定模板',
    tableData:[],
    addAppNameEnDialog:false,
    dialogFormVisible:false,
    certificateList:[],
  },
  mutations: {
    SET_TABLE_DATA(state,data){
      state.tableData = data
    },
    SET_CERTIFCATE_LIST(state,data){
      state.certificateList = data
    }

  },
  actions: {
    // 获取当前渠道包配置
    getChannelPackageConfiguration({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/channelPackageConfig/list','post',params).then((data) => {
          commit('SET_TABLE_DATA', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 绑定模板
    bindingTemplate({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/channelPackageConfig/bindTemplate','post',params).then((data) => {
          commit('SET_TABLE_DATA', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 模板绑定解除
    unBindingTemplate({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/channelPackageConfig/unBindTemplate','post',params).then((data) => {
          commit('SET_TABLE_DATA', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改模板参数配置值
    changeChannelPackageInfo({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/channelPackageConfig/update','post',params).then((data) => {
          commit('SET_TABLE_DATA', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取对应游戏证书列表
    getGameCertificateList({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/certificate/listByApp','get',params).then((data) => {
          commit('SET_CERTIFCATE_LIST', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  },




}
export default channel_package_configuration