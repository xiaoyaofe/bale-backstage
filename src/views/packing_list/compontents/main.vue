<template>
  <div class="app-container">
    <!-- 打包loading -->
    <div class="loadingPage" v-if="isLoading">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path" />
        </svg>
        <p class="el-loading-text">Loading</p>
      </div>
    </div>
    <!-- 日期组件及弹窗 -->
    <div style="marginBottom:20px;display:flex">
      <dialog-box></dialog-box>
      <el-button
        type="primary"
        @click="packing_list.filterPackagingDialog = true"
        style="marginLeft:15px"
      >
        <i class="el-icon-plus" /> 筛选打包任务
      </el-button>
      <el-button type="primary"  @click="packing_list.addPackageDialog = true">
        <i class="el-icon-plus" /> 添加打包任务
      </el-button>
    </div>
    <!-- table -->
    <el-table
      v-loading="tableLoading"
      :data="packing_list.tableData.data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        v-for="(item, i) in (Object.keys((packing_list.tableData.data&&packing_list.tableData.data[0])?packing_list.tableData.data[0]:[]))"
        :key="i"
        v-if="[0,1,2,3,5,7,8,9,11,12,13].includes(i)"
        :sortable="i==0"
        :prop="item"
        :label="tableHead[i]"
        :width="getWidth(i)"
      ></el-table-column>
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template slot-scope="scope">
          <p>
            <el-button type="primary" plain @click="startChange(scope.$index, scope.row)">配参</el-button>
            <el-button type="success" :disabled="scope.row.taskStatus==4" plain @click="startPacking(scope.$index, scope.row)">打包</el-button>
          </p>
          <p>
            <el-button type="danger" plain @click="deleteTask(scope.$index, scope.row)">删除</el-button>
            <el-button type="warning" plain @click="getHistory(scope.$index, scope.row)">记录</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dialogBox from "./main_dialog";
import Vue from "vue";
export default {
  components: {
    dialogBox
  },
  data() {
    return {
      tableLoading: true, //表格loading变量
      isLoading: false, //打包loading变量
      tableData: [], //表格数据
      tableHead: [
        "任务ID",
        "任务名称",
        "应用ID",
        "应用名称",
        "渠道包ID",
        "渠道包名称",
        "母包ID",
        "母包名称",
        "渠道",
        "sdk标识",
        "证书ID",
        "证书名称",
        "任务状态",
        "构建时间"
      ]
    };
  },
  computed: {
    // 加载应用列表
    packing_list() {
      return this.$store.state.packing_list;
    }
  },
  watch: {
    "packing_list.tableData": {
      handler: function(newValue, oldValue) {
        this.tableLoading = false;
      }
    }
  },
  methods: {
    // 配参
    startChange(index, row) {      
      this.$store.commit('SET_MOTHERPACKAGE_NAME', row.basePackageName);
      this.$store.commit('SET_CHANNELPACKAGE_NAME', row.channelPackageName);
      this.$store.commit('SET_CERTIFICATE_NAME', row.certificateName);
      this.$store.commit('SET_MATCHING_INFO', row);
      
      if (row.taskStatus==4) {//判断是否在打包中
        this.$router.push({ path: "detailsPage", query: { index: index,taskStatus:row.taskStatus } });
      }else{
        this.$router.push({ path: "detailsPage", query: { index: index} });
      }
    },
    // 删除打包任务
    deleteTask(index,row){
       this.$confirm("当前操作不可逆,是否确定删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.isLoading = true;
        var params = {
          taskId: this.packing_list.tableData.data[index].taskId
        };
        this.$store.dispatch('deleteTask', params).then((data) => {
          var paramInfo = {
          endDate: this.packing_list.filterTime[1],
          beginDate: this.packing_list.filterTime[0],
          appId: 0,
          basePackageId: 0,
          channelPackageId: 0,
        }
          this.$store.dispatch('getPackageTaskList', paramInfo).then(()=>{
            this.$message({type: "success",message: "删除成功"});
            this.isLoading = false;
          })
        })
      })
      .catch(() => {
        this.$message({type: "info",message: "已取消删除"});
      })
    },
    // 查看打包记录
    getHistory(index, row) {
      this.$router.push({
        path: "historyPage",
        query: {
          index: index,
          taskId: this.packing_list.tableData.data[index].taskId,
        }
      });
    },
    // 打包
    startPacking(index, row) {
      this.$confirm("即将开始执行打包任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isLoading = true;
          var params = {
            taskId: this.packing_list.tableData.data[index].taskId
          };
          this.$store
            .dispatch("testPackageParams", params)
            .then(data => {
              this.$store
                .dispatch("performPackagingTask", params)
                .then(data => {
                  this.isLoading = false;
                  return Vue.prototype.$message({
                    message: "打包成功",
                    type: "success",
                    duration: 1500
                  });
                })
                .catch(() => (this.isLoading = false));
            })
            .catch(() => (this.isLoading = false));
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消"
          // });
        });
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [90, 180, 80, 180, 80, 180, 70, 180, 90, 150, , 240, 90, 160];
      return arr[i];
    }
  }
};
</script>
<style lang="scss" scoped>
.loadingPage {
  position: fixed;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
</style>

