<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button type="primary" @click="addCertificateDialog = true">
        <i class="el-icon-plus"/>添加证书
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加证书" :visible.sync="addCertificateDialog" @close="cancelUploadCertificate">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="addCertificateListData.appId" filterable placeholder="请选择应用">
            <el-option
              v-for="(item,index) in _state.game_list.tableData.data"
              :key="index"
              :label="item.appNameZn"
              :value="item.appId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.certificatePassword"></el-input>
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.alias"></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.aliasPassword"></el-input>
        </el-form-item>
        <el-form-item label="上传证书" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="domain+'/certificate/add'"
            :data="addCertificateListData"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" icon="el-icon-upload el-icon--right" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUploadCertificate">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="editDataFormVisible">
      <el-form>
        <el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-input disabled v-model="changeInfo.certificateName"></el-input>
        </el-form-item>
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.certificatePassword"></el-input>
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.alias"></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.aliasPassword"></el-input>
        </el-form-item>
         <el-form-item label="重新上传证书" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="reUpload"
            :action="domain+'/certificate/update'"
            :data="changeInfo"
            :on-change="reUploadChange"
            :on-remove="reUploadRemove"
            :on-success="reUploadSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取证书</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
        v-if="i!=6"
        :key="i"
        :sortable="i==0"
        :prop="item"
        :label="tableHead[i]"
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
import Vue from 'vue'
export default {
  data() {
    return {
      domain: process.env.BASE_API,     //证书上传域名
      tableLoading: true,               //表格加载loading
      tableData: [],                    //表格数据
      fileList: [],                     //证书上传列表
      editDataFormVisible: false,       //编辑证书对话框变量
      isChooseApk:false,            //是否选取游戏包
      addCertificateListData: {         //添加证书传递参数
        appId: '',//应用ID
        alias: '',//别名
        certificatePassword: '',//证书密码
        aliasPassword: '',//别名密码
      },
      addCertificateDialog: false,      //添加证书对话框变量     
      changeInfo: {                     //编辑证书传递参数
        alias: null,
        aliasPassword: null,
        certificateName: null,
        certificatePassword: null,
        index: null,
      },
      formLabelWidth: '120px',          //表单长度
      tableHead: ['签名ID', '应用ID', '证书名称', '证书密码', '别名(alias)', '别名密码(aliaspwd)', '存储目录', '上传时间'] 

    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.$store.dispatch('getCertificateList').then((data) => {
        this.tableLoading = false
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
    cancelUploadCertificate() {
      this.addCertificateDialog = false;
      this.fileList=[]
      Object.keys(this.addCertificateListData).forEach((key, index) => { this.addCertificateListData[key] = '' })
    },
    // 添加框确定添加按钮
    determineChangeData() {
      if (this.addCertificateListData.appId === '') {
        return Vue.prototype.$message({ message: '请选中应用', type: 'warning', duration: 1500 })
      }
      for (var key in this.addCertificateListData) {
        if (this.addCertificateListData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请选中上传文件', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
    // 编辑数据
    changeData() {
      this.changeInfo.certificateId = this.tableData[this.changeInfo.index].certificateId;
      this.changeInfo.appId = this.tableData[this.changeInfo.index].appId;
      if (this.isChooseApk) {//判断是否需要重新上传母包
        this.$refs.reUpload.submit();
      }else{
        this.$store.dispatch('changeCertificateList', this.changeInfo).then((data) => {
          Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
          this.editDataFormVisible = false;
          Object.keys(this.changeInfo).forEach((item) => {
            this.changeInfo.item = null
          })
        })
      }
    },
    // 编辑数据下标
    startChange(index, row) {
      this.changeInfo.alias = this.tableData[index].alias;
      this.changeInfo.aliasPassword = this.tableData[index].aliasPassword;
      this.changeInfo.certificateName = this.tableData[index].certificateName;
      this.changeInfo.certificatePassword = this.tableData[index].certificatePassword;
      this.changeInfo.index = index;
      this.editDataFormVisible = true;
    },
    // 删除数据
    deleteData(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          certificateId: this.tableData[index].certificateId,
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
      if (response.code == 200) {
        Object.keys(this.addCertificateListData).forEach((key, index) => {
          if (key == "appId") {
            this.addCertificateListData[key] = 0;
          } else {
            this.addCertificateListData[key] = '';
          }
        })
        this.$store.commit('SET_CERTIFICATE_TABLE_DATA', response.data)
        this.addCertificateDialog = false
        return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
      } else {
        return Vue.prototype.$message({ message: response.message, type: 'error', duration: 1500 })
      }
    },
    //新增上传文件监听事件
    reUploadChange(file){
      this.isChooseApk=true
    },
    reUploadRemove(file){
      this.isChooseApk=false
    },
    // 修改弹窗重新上传母包成功
    reUploadSuccess(response, file, fileList) {
      this.fileList = []
      this.editDataFormVisible = false;
      this.$store.dispatch('getCertificateList').then(()=>{
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
      })
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [100, 100, 150, 150, 150, 150, , 160, 160]
      return arr[i]
    },
  }
}
</script>
<style lang="scss" scoped>
</style>

