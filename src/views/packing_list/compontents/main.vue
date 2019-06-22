<template>
  <div class="app-container">
    <div style="marginBottom:20px;display:flex" >
      <dialog-box></dialog-box>
      <el-button type="info" plain @click="packing_list.filterPackagingDialog = true">
        <i class="el-icon-plus"/> 筛选打包任务
      </el-button>
      <el-button type="info" plain @click="packing_list.addPackageDialog = true">
        <i class="el-icon-plus"/> 添加打包任务
      </el-button>
    </div>
    <!-- <p>{{packing_list.tableData.data}}</p> -->
    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="packing_list.tableData.data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        v-for="(item, i) in (Object.keys((packing_list.tableData.data&&packing_list.tableData.data[0])?packing_list.tableData.data[0]:[]))"
        :key="i"
        :sortable="i==0"
        :prop="item"
        :label="tableHead[i]"
        :width="getWidth(i)"
      ></el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="startChange(scope.$index, scope.row)">配参</el-button>
          <el-button type="success" plain @click="deleteData(scope.$index, scope.row)">打包</el-button>
          <el-button type="warning" plain @click="getHistory(scope.$index, scope.row)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <p>{{packing_list}}</p> -->
    <!-- <table-vue></table-vue> -->
  </div>
</template>

<script>
import dialogBox from '../dialog'
import Vue from 'vue'
export default {
  components: {
    dialogBox
  },
  data() {
    return {
      diolagData: {
        id: '',
        data: [],
      },
      domain: process.env.BASE_API,
      listLoading: true,
      tableData: [],
      fileList: [],
      appNameEnIndex: '',
      dialogFormVisible: false,
      addPackageDialog: false,
      form: {
        alias: null,
        aliasPassword: null,
        certificatePassword: null,
      },
      addCertificateListData: {
        appId: 0,//应用ID
        alias: '',//别名
        certificateName: '', //证书名称
        certificatePassword: '',//证书密码
        aliasPassword: '',//别名密码
        appNameEn: '',//应用英文名
      },
      changeInfo: {
        alias: null,
        aliasPassword: null,
        certificateName: null,
        certificatePassword: null,
        index: null,
      },
      formLabelWidth: '120px',
      tableHead: ['任务ID', '任务名称', '应用ID', '应用名称','渠道包ID','渠道包名称','母包ID','母包名称','任务状态','存储路径','构建时间'],
      filterTime: [],

    }
  },
  created() {
    this.dataInit()
    // 初始化获取应用列表
    // this.$store.dispatch('getMasterPackageList').then((data) => {
    // this.$store.dispatch('getCertificateList').then((data) => {
      this.listLoading = false
    // })
    // })
  },
  computed: {
    // 加载应用列表
    _state() {
      return this.$store.state
    },
    packing_list() {
      return this.$store.state.packing_list
    }
  },
  methods: {
    // 取消
    cancel() {
      this.dialogFormVisible = false;
      Object.keys(this.form).forEach((key, index) => { this.form[key] = null })
    },
    // 添加框确定添加按钮
    determineChangeData() {
      if (this.appNameEnIndex === '') {
        return Vue.prototype.$message({ message: '请选中应用', type: 'warning', duration: 1500 })
      }
      this.addCertificateListData.appId = this._state.game_list.tableData.data[this.appNameEnIndex].appId;
      this.addCertificateListData.appNameEn = this._state.game_list.tableData.data[this.appNameEnIndex].appNameEn;
      for (var key in this.addCertificateListData) {
        if (this.addCertificateListData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请选中上传文件', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
    // 编辑数据
    changeData() {
      var params = {
        id: this.tableData[this.changeInfo.index].id,
        appId: this.tableData[this.changeInfo.index].appId,
        certificateName: this.changeInfo.certificateName,
        certificatePassword: this.changeInfo.certificatePassword,
        alias: this.changeInfo.alias,
        aliasPassword: this.changeInfo.aliasPassword,
      }
      this.$store.dispatch('changeCertificateList', params).then((data) => {
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
        this.addPackageDialog = false;
        Object.keys(this.changeInfo).forEach((item) => {
          this.changeInfo.item = null
        })
      })
    },

    // 配餐
    startChange(index, row) {
      this.$router.push({ path: 'detailsPage', query: { index: index }})
      this.$store.commit('SET_MAIN_PAGE_INFO', this.$store.state.packing_list.tableData.data[index])
    },
    // 
    getHistory(index, row){
      // this.packing_list.isComponents = 'historyPage';
      this.$router.push({ path: 'historyPage', query: { index: index }})
      this.$store.commit('SET_MAIN_PAGE_INFO', this.$store.state.packing_list.tableData.data[index])
    },
    // 删除数据
    deleteData(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          id: this.tableData[index].id,
          filePath: this.tableData[index].filePath,
        }
        this.$store.dispatch('delCertificateList', params).then((data) => {
          return Vue.prototype.$message({ message: '删除成功', type: 'success', duration: 1500 })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 文件上传成功的钩子函数
    uploadSuccess(response, file, fileList) {
      this.appNameEnIndex = '';
      this.fileList = []
      Object.keys(this.addCertificateListData).forEach((key, index) => {
        if (key == "appId") {
          this.addCertificateListData[key] = 0;
        } else {
          this.addCertificateListData[key] = '';
        }
      })
      this.$store.commit('SET_CERTIFICATE_TABLE_DATA', response.data)
      this.dialogFormVisible = false
      return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [100, 100, 100, 150, 100, 150,100 ,150, 90, ,160]
      return arr[i]
    },
    dataInit() {
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

