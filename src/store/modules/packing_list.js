
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
      packageTime: [moment().add(-7, 'day').format('YYYY-MM-DD'), moment().add('day').format('YYYY-MM-DD')],
      certificateList:[],
      addAppNameEnDialog:false,
      uploadCertificateDialog:false,
      switchCertificateDialog:false,
      templateName:'',
      bindingTemplateDialog:false,
      appNameEnIndex: '',           //游戏应用下标
      taskConfigParam:[],
      sdkPackageIconList:[],
      sdkPackageCertificate:null,
      aIconData: [                   //游戏icon组合
        // { tilte: '默认ICON', imageUrl: '', progress: 0, status: '', iconType: '0', iconTypeKey: 'drawable', filePath: '' },
        {id:0, tilte: 'ICON_1(36*36)', imageUrl: '', progress: 0, status: '', iconType: '1', iconTypeKey: 'drawable-ldpi-v4', filePath: '',size:36 },
        {id:0, tilte: 'ICON_2(48*48)', imageUrl: '', progress: 0, status: '', iconType: '2', iconTypeKey: 'drawable-mdpi-v4', filePath: '',size:48 },
        {id:0, tilte: 'ICON_3(72*72)', imageUrl: '', progress: 0, status: '', iconType: '3', iconTypeKey: 'drawable', filePath: '',size:72 },
        {id:0, tilte: 'ICON_4(96*96)', imageUrl: '', progress: 0, status: '', iconType: '4', iconTypeKey: 'drawable-xhdpi-v4', filePath: '',size:96 },
        {id:0, tilte: 'ICON_5(144*144)', imageUrl: '', progress: 0, status: '', iconType: '5', iconTypeKey: 'drawable-xxhdpi-v4', filePath: '',size:144 },
        {id:0, tilte: 'ICON_6(192*192)', imageUrl: '', progress: 0, status: '', iconType: '6', iconTypeKey: 'drawable-xxxhdpi-v4', filePath: '',size:192 },],
      packingRecordData:[]
    },
    mutations: {
      SET_PACKAGE_TIME(state,data){
        state.packageTime = data
      },
      SET_PACKING_RECORD_DATA(state,data){
        state.packingRecordData = data
      },
      SET_CONFIG_PACKAGE_DATA(state,data){
        state.taskConfigParam = data
      },
      SET_FILTER_PACKING_INFO(state,data){
        state.filterPackagingInfo = data
      },
      SET_FILTER_TIME(state,data){
        state.filterTime = data
      },
      SET_PACKAGE_TABLE_DATA(state,data){
        state.tableData = data
      },
      SET_TASK_CONFIG_PARAM(state,data){
        state.taskConfigParam = data
      },
      SET_TASK_CONFIG_ICON(state,data){
        state.sdkPackageIconList = data
      },
      SET_TASK_CONFIG_CERTIFICATE_ID(state,data){
        state.sdkPackageCertificate = data
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
      // 查询打包任务配置信息
      getTaskParam({ commit, state, dispatch },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/getTaskParam','post',params).then((data) => {
            console.log(data);
              // 设置配置信息
              commit('SET_TASK_CONFIG_PARAM', data.data.sdkPackageConfigList)
              // 设置ICON
              commit('SET_TASK_CONFIG_ICON',data.data.sdkPackageIconList)
                for (let index = 0; index < state.aIconData.length; index++) {
                  state.aIconData[index].id = 0
                  state.aIconData[index].imageUrl = ''
                }
                for (let index = 0; index < data.data.sdkPackageIconList.length; index++) {
                  state.aIconData[data.data.sdkPackageIconList[index].iconType-1].id = data.data.sdkPackageIconList[index].id
                  state.aIconData[data.data.sdkPackageIconList[index].iconType-1].imageUrl = process.env.DOWNLOAD_API+data.data.sdkPackageIconList[index].filePath
                  state.aIconData[data.data.sdkPackageIconList[index].iconType-1].filePath = data.data.sdkPackageIconList[index].filePath
                }
              // 设置当前证书
                commit('SET_TASK_CONFIG_CERTIFICATE_ID',data.data.sdkPackageCertificate)
              // 获取证书列表
              var appId = params.appId
              dispatch('getCertificateList', appId).then((data) => { })
              // 获取配置模板
              dispatch('getConfigurationTemplate').then((data) => { })
              
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取打包参数
      getSdkPackageConfig({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/getSdkPackageConfig','post',params).then((data) => {
            // commit('SET_SELECT_TEMPLATE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 绑定模板
      bindingTemplate({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/bindTemplate','post',params).then((data) => {
            commit('SET_CONFIG_PACKAGE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 模板绑定解除
      unBindingTemplate({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/unBindTemplate','post',params).then((data) => {
            commit('SET_CONFIG_PACKAGE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 修改模板参数配置值
      changeChannelPackageInfo({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/updateSdkPackageConfig','post',params).then((data) => {
            commit('SET_CONFIG_PACKAGE_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 绑定证书
      bindSdkPackageCertificate({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/addSdkPackageCertificate','post',params).then((data) => {
            commit('SET_TASK_CONFIG_CERTIFICATE_ID', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 参数检查
      testPackageParams({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/checkTask','post',params).then((data) => {
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取打包记录
      getPackageList({ commit, state },params) {
        return new Promise((resolve, reject) => {
          requestData('/task/getTaskLog','post',params).then((data) => {
            commit('SET_PACKING_RECORD_DATA', data.data.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },

    
    },




}
export default packing_list