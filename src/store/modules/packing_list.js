
import {requestData} from '@/api/module'
import moment from 'moment'

const packing_list = {
    state: {
      tip:'添加',
      isComponents:'mainPage',
      tableData:[],
      appList:[],
      motherPackageList:[],
      addPackageDialog:false,
      filterPackagingDialog:false,
      filterPackagingInfo:{},
      filterTime: [moment().add(-7, 'day').format('YYYY-MM-DD'), moment().add('day').format('YYYY-MM-DD')],
      mainInfo:[],
      certificateList:[],
      addAppNameEnDialog:false,
      dialogFormVisible:false,
      appNameEnIndex: '',           //游戏应用下标
      taskConfigParam:[],

    },
    mutations: {
      SET_FILTER_PACKING_INFO(state,data){
        state.filterPackagingInfo = data
      },
      SET_MAIN_PAGE_INFO(state,data){ 
        state.mainInfo = data
      },
      SET_FILTER_TIME(state,data){
        state.filterTime = data
      },
      SET_PACKAGE_TABLE_DATA(state,data){
        state.tableData = data
      },
      SET_TASK_CONFIG_PARAM(state,data){
        state.taskConfigParam = data
      }
    },
    actions: {
      // 获取打包任务列表
      getPackageTaskList({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/getTaskList','post',params).then((data) => {
            commit('SET_PACKAGE_TABLE_DATA', data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 提交打包任务
      submitPackageTask({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/addTask','post',params).then((data) => {
            // commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 执行打包任务
      performPackagingTask({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/executeTask','post',params).then((data) => {
            // commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取打包参数
      getTaskParam({ commit, state, dispatch },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/getTaskParam','post',params).then((data) => {
            console.log(data);
            // if (data.data.sdkPackageCertificate) {
              commit('SET_TASK_CONFIG_PARAM', data.data)
            // }else{
              var appId = params.appId
              dispatch('getCertificateList', appId).then((data) => { })
            // }
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
    
    },




}
export default packing_list