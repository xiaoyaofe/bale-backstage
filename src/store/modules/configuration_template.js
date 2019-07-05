import {requestData} from '@/api/module'

const channel_package_list = {
    state: {
      tip:'添加模板',
      tableData:[],
      selectTemplateData:[],
    },
    mutations: {
      SET_TEMPLATE_DETAILS_DATA(state,data){
        state.tableData = data
      },
      SET_SELECT_TEMPLATE_DATA(state,data){
        state.selectTemplateData = data
      }
    },
    actions: {
      // 获取渠道包配置模板
      getConfigurationTemplate({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/template/list','get',params).then((data) => {
          commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
      },
      // 获取模板详情
      getTemplateDetails({commit,state},params){
        return new Promise((resolve, reject) => {
          requestData('/template/getByTemplateName','post',params).then((data) => {
            commit('SET_TEMPLATE_DETAILS_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 添加渠道包模板
      addConfigurationTemplate({commit,state},params){
        return new Promise((resolve, reject) => {
          requestData('/template/add','post',params).then((data) => {
            commit('SET_TEMPLATE_DETAILS_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
        },
      // 删除渠道包配置模板参数
      delConfigurationTemplateParams({commit,state},params){
        return new Promise((resolve, reject) => {
          requestData('/template/delTemplateConfig','post',params).then((data) => {
            commit('SET_TEMPLATE_DETAILS_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
        },
      // 删除渠道包配置模板
      delConfigurationTemplate({commit,state},params){
        return new Promise((resolve, reject) => {
          requestData('/template/delByTemplateName','post',params).then((data) => {
            commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
        },
      // 修改模板名称
      changeTemplateName({commit,state},params) {
        return new Promise((resolve, reject) => {
          requestData('/template/updateTemplateName','post',params).then((data)=>{
            commit('SET_TEMPLATE_DETAILS_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
        },
      // 修改模板数据
      changeTemplateParams({commit,state},params) {
        return new Promise((resolve, reject) => {
          requestData('/template/updateTemplateConfig','post',params).then((data)=>{
            commit('SET_TEMPLATE_DETAILS_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 模板复制
      copyTemplate({commit,state},params) {
        return new Promise((resolve, reject) => {
          requestData('/template/copy','post',params).then((data)=>{
            // commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },

      
    },
}
export default channel_package_list