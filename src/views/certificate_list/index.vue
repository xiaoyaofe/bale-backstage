<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button  type="info" plain  @click="dialogFormVisible = true">
        <i class="el-icon-plus" />{{_state.certificate_list.tip}}
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加证书" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="appNameEnIndex" filterable placeholder="请选择应用">
            <el-option
              v-for="(item,index) in _state.game_list.tableData.data"
              :key="index"
              :label="item.appNameZn"
              :value="index"
              :disabled="!item.appNameEn"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.certificateName" ></el-input>
        </el-form-item> 
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.certificatePassword" ></el-input>
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.alias" ></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.aliasPassword" ></el-input>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="http://172.16.10.106:8080/certificate/add"
            :data="addCertificateListData"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form>
        <el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.certificateName" ></el-input>
        </el-form-item>
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.certificatePassword" ></el-input>
        </el-form-item>
         <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.alias" ></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.aliasPassword" ></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
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
        :sortable="i==0"
        :prop="item"
        :label="tableHead[i]"
        :width="getWidth(i)"
      ></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="startChange(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" plain @click="deleteData(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/certificate'
import Vue from 'vue'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      tableData:[],
      fileList:[],
      appNameEnIndex:'',
      // 
      dialogFormVisible: false,
      changeDataFormVisible: false,
      form: {
          alias:null,
          aliasPassword:null,
          certificatePassword:null,
      },
      addCertificateListData:{
        appId:0,//应用ID
        alias:'',//别名
        certificateName:'', //证书名称
        certificatePassword:'',//证书密码
        aliasPassword:'',//别名密码
        appNameEn:'',//应用英文名
      },
      changeInfo:{
          alias:null,
          aliasPassword:null,
          certificateName:null,
          certificatePassword:null,
          index:null,
      },
      formLabelWidth: '120px',
      tableHead:['签名ID','应用ID','证书名称','证书密码','别名(alias)','别名密码(aliaspwd)','存储目录','上传时间']

    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.$store.dispatch('getCertificateList').then((data) => {
        this.listLoading = false
      })
    })
  },
  computed: {
    // 加载应用列表
    _state() {
      if (this.$store.state.certificate_list.tableData.data) {
        this.tableData = [...this.$store.state.certificate_list.tableData.data]
      }
      return this.$store.state
    }
  },
  methods: {
    // 取消
    cancel(){
      this._state.dialogFormVisible = false;
      Object.keys(this.form).forEach((key, index) => {this.form[key] = null})
    },
    // 添加框确定添加按钮
    determineChangeData(){
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
    changeData(){
        var params = {
          id:this.tableData[this.changeInfo.index].id,
          appId: this.tableData[this.changeInfo.index].appId,
          certificateName: this.changeInfo.certificateName,
          certificatePassword: this.changeInfo.certificatePassword,
          alias: this.changeInfo.alias,
          aliasPassword: this.changeInfo.aliasPassword,
        }
         this.$store.dispatch('changeCertificateList',params).then((data) => {
          Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
          this.changeDataFormVisible = false;
          Object.keys(this.changeInfo).forEach((item)=>{
            this.changeInfo.item = null
          })
      })
    },
    // 编辑数据下标
    startChange(index,row){
      this.changeInfo.alias = this.tableData[index].alias;
      this.changeInfo.aliasPassword = this.tableData[index].aliasPassword;
      this.changeInfo.certificateName = this.tableData[index].certificateName;
      this.changeInfo.certificatePassword = this.tableData[index].certificatePassword;
      this.changeInfo.index  = index;
      this.changeDataFormVisible = true;
    },
    // 删除数据
    deleteData(index,row){
       var params = {
        id: this.tableData[index].id,
        filePath: this.tableData[index].filePath,
      }
      this.$store.dispatch('delCertificateList', params).then((data) => {
        return Vue.prototype.$message({ message: '删除成功', type: 'success', duration: 1500 })
      })
    },
    // 获取数据
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
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
    getWidth(i){
      var arr = [100,100,150,150,150,150,,160,160]
      return arr[i]
    },
  }
}
</script>
<style lang="scss" scoped>


</style>

