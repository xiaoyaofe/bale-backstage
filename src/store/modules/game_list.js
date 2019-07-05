import { requestData} from '@/api/module'

const game_list = {
  state: {
    tip:'请输入应用名称',
    tableData:[]
  },
  mutations: {
    SET_TABLEDATA(state,data){
      state.tableData = data
    }
  },
  actions: {
    // 获取打包任务列表
    getGameList({ commit, state }) {
      return new Promise((resolve, reject) => {
        requestData('/gameInfo/list','get').then((data) => {
          commit('SET_TABLEDATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    changeGameListInfo({commit,state},params) {
      return new Promise((resolve, reject) => {
        requestData('/gameInfo/update','post',params).then((data) => {
          commit('SET_TABLEDATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })

      })
    }
  },




}
export default game_list