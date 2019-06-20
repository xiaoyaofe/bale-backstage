import {
  getCertificateList,
  changeCertificateList,
  delCertificateList,
  } from '@/api/module'

const certificate_list = {
    state: {
    tip:'添加',
    tableData:[],
    },
    mutations: {
    SET_CERTIFICATE_TABLE_DATA(state,data){
    state.tableData = data
    }
    },
    actions: {
    // 获取证书列表
    getCertificateList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getCertificateList().then((data) => {
        commit('SET_CERTIFICATE_TABLE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    },
    // 删除证书列表
    delCertificateList({commit,state},params){
    return new Promise((resolve, reject) => {
      delCertificateList(params).then((data) => {
        commit('SET_CERTIFICATE_TABLE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    },
    // 修改证书列表
    changeCertificateList({commit,state},params) {
    return new Promise((resolve, reject) => {
      changeCertificateList(params).then((data)=>{
        commit('SET_CERTIFICATE_TABLE_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    }
},




}
export default certificate_list