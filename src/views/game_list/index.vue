<template>
  <div class="app-container">
    <!-- 筛选框 -->
    <div style="marginBottom:20px">
      <el-input
        :placeholder="_state.tip"
        v-model="inputAppName"
        class="input-with-select inputSearchBox"
      >
      <el-button slot="append" icon="el-icon-search" @click="getSearchData">筛选</el-button>
      </el-input>
    </div>
    <!-- 应用列表框 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
        :key="i"
        :sortable="i==0||i==1"
        :prop="item"
        :label="tableHead[i]"
        :width="getWidth(i)"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>

import Vue from 'vue'
export default {
  data() {
    return {
      tableData: [],                //表格数据
      inputAppName: '',             //筛选选内容
      listLoading: true,            //loading加载变量
      tableHead:['主键ID','appId','中文名称','应用appKey','应用APPSecret','创建时间',]
    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.listLoading = false
    })
  },
  computed: {
    // 加载应用列表
    _state() {
      if (this.$store.state.game_list.tableData.data) {
        this.tableData = [...this.$store.state.game_list.tableData.data]
      }
      return this.$store.state.game_list
    }
  },
  watch: {
    // 筛选监听事件
    inputAppName(newValue, oldValue) {
      if (!newValue) {
        this.tableData = this._state.tableData.data
      }
    }
  },
  methods: {
    // 点击筛选按钮触发
    getSearchData() {
      if (this.inputAppName) {
        this.tableData = this._state.tableData.data.filter(data => data.appNameZn.toLowerCase().includes(this.inputAppName.toLowerCase()))
      } else {
        Vue.prototype.$message({ message: '请输入应用名称', type: 'warning', duration: 1500 })
      }

    },
    // 设置表格列宽
    getWidth(i){
      var arr = [150,150,,,,]
      return arr[i]
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .inputSearchBox {
    width: 400px;
  }
}
</style>

