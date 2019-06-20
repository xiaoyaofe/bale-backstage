import {getMasterPackageList,
        changeGameListInfo,
        delMasterPackageList,
        changeMasterPackageInfo} from '@/api/module'

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
    getMasterPackageList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMasterPackageList().then((data) => {
          commit('SET_MOTHER_TABLE_DATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除母包列表
    delMasterPackageList({commit,state},params){
      return new Promise((resolve, reject) => {
        delMasterPackageList(params).then((data) => {
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
        changeMasterPackageInfo(params).then((data)=>{
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