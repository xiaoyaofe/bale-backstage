<template>
  <div class="app-container">
    <!-- 筛选框 -->
    <div style="marginBottom:20px">
      <el-button type="primary" style="margin:30px 0" plain @click="goBack">
        <i class="el-icon-back"/> 返回列表界面
      </el-button>
      <el-input
        :placeholder="_state.tip"
        v-model="inputAppName"
        class="input-with-select inputSearchBox"
      >
        <el-button slot="append" icon="el-icon-search" @click="getSearchData">筛选</el-button>
      </el-input>
    </div>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form>
        <el-form-item label="应用名称" label-width="120px">
          <el-input v-model="changeInfo.appNameEn"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" label-width="120px">
          <el-input v-model="changeInfo.appDescribe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
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
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="startChange(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
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
      changeDataFormVisible: false, //编辑框变量
      changeInfo: {                 //编辑框参数
        appNameEn: null,
        appDescribe: null,
        index: null,
      },
      tableHead: ['主键ID', 'appId', '中文名称', '英文名称', '应用appKey', '应用APPSecret', '应用appDescribe', '创建时间',]
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
    // 编辑框确定按钮触发
    determineChangeData() {
      var params = {
        id: this.tableData[this.changeInfo.index].id,
        appNameEn: this.changeInfo.appNameEn,
        appDescribe: this.changeInfo.appDescribe,
      }
      this.$store.dispatch('changeGameListInfo', params).then((data) => {
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
        this.changeDataFormVisible = false;
        Object.keys(this.changeInfo).forEach((item) => {
          this.changeInfo.item = null
        })
      })
    },
    // 点击编辑按钮触发
    startChange(index, row) {
      this.changeInfo.appNameEn = this.tableData[index].appNameEn;
      this.changeInfo.appDescribe = this.tableData[index].appDescribe;
      this.changeInfo.index = index;
      this.changeDataFormVisible = true;
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [100, 100, 180, 180, , , , 160]
      return arr[i]
    },
    goBack() {
      this.$store.state.packing_list.isComponents = 'mainPage'
      this.$router.push({ path: 'mainPage'})
      
    }
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

