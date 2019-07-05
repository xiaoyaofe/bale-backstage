<template>
  <div class="app-container">
    <!-- 筛选框 -->
    <div style="marginBottom:20px">
      <section>
        <el-button type="primary" style="margin:0px 0px 20px 0px" plain @click="goBack">
          <i class="el-icon-back"/> 返回列表界面
        </el-button>
      </section>
      <el-date-picker
        v-model="packageTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
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
      v-loading="tableLoading"
      :data="packing_list.packingRecordData"
      element-loading-text="Loading"
      border
      highlight-current-row>
      <el-table-column
        v-for="(item, i) in (Object.keys(packing_list.packingRecordData[0]?packing_list.packingRecordData[0]:{}))"
        v-if="i!=9"
        :key="i"
        :sortable="i==0||i==1"
        :prop="item"
        :label="tableHead[i]"
      ></el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" plain @click="startChange(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
export default {
  data() {
    return {
      domain: process.env.DOWNLOAD_API, //下载域名
      tableData: [],                    //表格数据
      inputAppName: '',                 //筛选文本
      packageTime: '',                  //筛选时间
      tableLoading: true,               //loading加载变量
      tableHead: ['主键ID', '任务ID', '任务名称', '应用名称', '渠道包名称', '母包名称', '渠道', 'sdk标识', '证书名称', '存储路径', '创建时间',]
    }
  },
  created() {
    // 初始化获取打包历史记录
    this.packageTime = this.packing_list.packageTime
    this.queryPackageList()
  },
  computed: {
    // 加载应用列表
    _state() {
      if (this.$store.state.game_list.tableData.data) {
        this.tableData = [...this.$store.state.game_list.tableData.data]
      }
      return this.$store.state.game_list
    },
    packing_list() {
      return this.$store.state.packing_list
    }
  },
  watch: {
    // 筛选监听事件
    inputAppName(newValue, oldValue) {
      if (!newValue) {
        this.tableData = this._state.tableData.data
      }
    },
    packageTime(newValue, oldValue) {
      this.$store.commit('SET_PACKAGE_TIME', newValue.map(item => moment(item).format('YYYY-MM-DD')));
      this.queryPackageList()
    },
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
    // 点击下载按钮触发
    startChange(index, row) {
      window.open(this.domain + this.packing_list.packingRecordData[index].filePath)
    },
    // 查询数据
    queryPackageList() {
      var params = {
        beginDate: this.packing_list.packageTime[0],
        endDate: this.packing_list.packageTime[1],
        taskId: this.$route.query.taskId,
      }
      this.$store.dispatch('getPackageList', params).then((data) => {
        this.tableLoading = false
      })
    },
    // 返回列表界面
    goBack() {
      this.$store.state.packing_list.isComponents = 'mainPage'
      this.$router.push({ path: 'mainPage' })
    },
    // 设置表格列宽
    // getWidth(i) {
    //   var arr = [90,90,150,150,150,150,100,150,150,500,180]
    //   return arr[i]
    // },
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

