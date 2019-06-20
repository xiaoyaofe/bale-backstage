<template>
  <div>
    <!-- 添加应用英文名 -->
    <el-dialog title="当前应用没有英文名,请先添加应用英文名" :visible.sync="_state.addAppNameEnDialog">
      <el-form>
        <el-form-item label="应用英文名" label-width="120px">
          <el-input v-model="appNameEn"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="_state.addAppNameEnDialog = false;appNameEn =''">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加数据弹出框 -->
    <el-dialog title="当前应用没有证书添加证书" :visible.sync="_state.dialogFormVisible" @close="cancel">
      <el-form>
        
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-input disabled v-model="diolagData.data.appNameZn"></el-input>
        </el-form-item><el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-input v-model="addCertificateListData.certificateName"></el-input>
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
        <el-button type="primary" @click="determineAddCertificate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: ['diolagData'],
  data() {
    return {
      appNameEn: null,
      formLabelWidth:"120px",
      fileList:[],
      addCertificateListData: {
        appId: 0,//应用ID
        alias: '',//别名
        certificateName: '', //证书名称
        certificatePassword: '',//证书密码
        aliasPassword: '',//别名密码
        appNameEn: '',//应用英文名
      },
    }
  },
  computed: {
    // 加载应用列表
    _state() {
      return this.$store.state.channel_package_configuration
    }
  },
  methods: {
    // 取消
    cancel(){
      this._state.dialogFormVisible = false;
      Object.keys(this.addCertificateListData).forEach((key, index) => {this.addCertificateListData[key] = ''})
    },
    determineAddCertificate(){
      this.addCertificateListData.appId = this.diolagData.data.appId;
      this.addCertificateListData.appNameEn = this.diolagData.data.appNameEn;
      for (var key in this.addCertificateListData) {
        if (this.addCertificateListData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请将上传信息填写完整', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
    // 编辑框确定按钮触发
    determineChangeData() {
      var params = {
        id: this.diolagData.id,
        appNameEn: this.appNameEn,
        appDescribe: '',
      }
      this.$store.dispatch('changeGameListInfo', params).then((data) => {
        this._state.addAppNameEnDialog = false;
        this.appNameEn = "";
        Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
      })
    },
    // 文件上传成功的钩子函数
    uploadSuccess(response, file, fileList) {
      this.fileList = []
      this.$store.commit('SET_CERTIFCATE_LIST', response.data.data.filter(todo=>todo.certificateName == this.addCertificateListData.certificateName ))
      Object.keys(this.addCertificateListData).forEach((key, index) => {
        if (key == "appId") {
          this.addCertificateListData[key] = 0;
        } else {
          this.addCertificateListData[key] = '';
        }
      })
      this._state.dialogFormVisible = false
      return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
