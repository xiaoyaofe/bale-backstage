import {getGameList,changeGameListInfo} from '@/api/module'

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
    getGameList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getGameList().then((data) => {
          commit('SET_TABLEDATA', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    changeGameListInfo({commit,state},params) {
      return new Promise((resolve, reject) => {
        changeGameListInfo(params).then((data)=>{
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