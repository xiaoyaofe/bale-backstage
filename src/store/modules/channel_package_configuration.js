import {requestData} from '@/api/module'

const channel_package_configuration = {
  state: {
    tip:'绑定模板',
    tableData:[],
    aIconData: [                   //游戏icon组合
      { tilte: 'ICON_1(36*36)', imageUrl: '', progress: 0, status: '', type: '1', type_key: 'drawable-ldpi-v4', file_path: '',id:0},
      { tilte: 'ICON_2(48*48)', imageUrl: '', progress: 0, status: '', type: '2', type_key: 'drawable-mdpi-v4', file_path: '',id:0},
      { tilte: 'ICON_3(72*72)', imageUrl: '', progress: 0, status: '', type: '3', type_key: 'drawable', file_path: '',id:0},
      { tilte: 'ICON_4(96*96)', imageUrl: '', progress: 0, status: '', type: '4', type_key: 'drawable-xhdpi-v4', file_path: '',id:0 },
      { tilte: 'ICON_5(144*144)', imageUrl: '', progress: 0, status: '', type: '5', type_key: 'drawable-xxhdpi-v4', file_path: '',id:0 },
      { tilte: 'ICON_6(192*192)', imageUrl: '', progress: 0, status: '', type: '6', type_key: 'drawable-xxxhdpi-v4', file_path: '',id:0 },],
    addAppNameEnDialog:false,
    dialogFormVisible:false,
    appNameEnIndex: '',           //游戏应用下标
    certificateIndex: '',          //证书下标
    channelPackageId: '',         //渠道包ID
    certificateList:[],
  },
  mutations: {
    SET_CHANNEL_PACKAGE_ID(state,data){
      state.channelPackageId = data
    },
    SET_CERTIFICATE_INDEX(state,data){
      state.certificateIndex = data
    },
    SET_APP_NAME_EN_INDEX(state,data){
      state.appNameEnIndex = data
    },
    SET_TABLE_DATA(state,data){
      state.tableData = data
    },
    SET_CERTIFCATE_LIST(state,data){
      state.certificateList = data
    },
    SET_GAME_ICON(state,data){
      state.aIconData = data
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
    // 获取游戏icon
    getGameChannelPackageIcon({ commit, state },params) {
      return new Promise((resolve, reject) => {
        requestData('/appIcon/listByPackage','post',params).then((data) => {
          // commit('SET_GAME_ICON', data.data.data)
          for (let index = 0; index < data.data.data.length; index++) {
            state.aIconData[data.data.data[index].iconType-1].imageUrl = process.env.BASE_API+data.data.data[index].filePath
            state.aIconData[data.data.data[index].iconType-1].id = process.env.BASE_API+data.data.data[index].id
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  },




}
export default channel_package_configuration