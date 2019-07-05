import {requestData} from '@/api/module'

const mother_package_list = {
  state: {
    tip:'请输入应用名称',
    tableData:[],
    appSelect:[],
  },
  mutations: {
    SET_APP_SELECT(state,data){
      state.appSelect = data
    },
    SET_MOTHER_TABLE_DATA(state,data){
      state.tableData = data
    }
  },
  actions: {
    // 获取母包列表
    getMasterPackageList({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/basePackage/list','get',params).then((data) => {
          if (params) {
            commit('SET_MOTHER_TABLE_DATA', data.data.data.filter(todo=>todo.appId===params))
          }else{
            commit('SET_MOTHER_TABLE_DATA', data.data)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除母包列表
    delMasterPackageList({commit,state},params){
      return new Promise((resolve, reject) => {
        requestData('/basePackage/del','post',params).then((data) => {
          commit('SET_MOTHER_TABLE_DATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改母包信息
    changeMasterPackageInfo({commit,state},params) {
      return new Promise((resolve, reject) => {
        requestData('/basePackage/update','post',params).then((data) => {
          commit('SET_MOTHER_TABLE_DATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })

      })
    }
  },




}
export default mother_package_list