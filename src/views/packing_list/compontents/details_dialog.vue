<template>
  <div v-if="$route.query.index>=0&&packing_list.tableData.data">
    <!-- 添加应用英文名 -->
    <el-dialog title="当前应用没有英文名,请先添加应用英文名" :visible.sync="_state.addAppNameEnDialog">
      <el-form>
        <el-form-item label="应用英文名" label-width="120px">
          <el-input v-model="appNameEn"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="_state.addAppNameEnDialog = false;appNameEn =''">取 消</el-button>
        <el-button type="primary" @click="determineAppNameEn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加证书弹出框 -->
    <el-dialog title="当前应用没有证书添加证书" :visible.sync="packing_list.uploadCertificateDialog" @close="cancelAddCertificate">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-input disabled :placeholder="packing_list.tableData.data[$route.query.index].appName"></el-input>
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
            :action="domain+'/certificate/add'"
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
        <el-button @click="cancelAddCertificate">取 消</el-button>
        <el-button type="primary" @click="determineAddCertificate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定模板弹窗 -->
    <el-dialog
      title="绑定模板"
      :visible.sync="packing_list.bindingTemplateDialog"
      width="400px"
      @close="cacelBinding">
      <el-select v-model="packing_list.templateName" filterable placeholder="请选择需要绑定的模板">
        <el-option
          v-for="(item,i) in template_list.selectTemplateData"
          :key="i"
          :label="item.templateName"
          :value="item.templateName"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacelBinding">取 消</el-button>
        <el-button type="primary" @click="determineBindingTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 切换证书对话框 -->
    <el-dialog title="选择证书" :visible.sync="packing_list.switchCertificateDialog" width="450px"  @close="cancelSwitchCertificate">
      <el-form>
         <el-select v-model="certificateId" filterable placeholder="请选择证书" >
            <el-option
              v-for="(item,index) in certificate_list.tableData"
              :key="index"
              :label="item.certificateName"
              :value="item.certificateId"
            ></el-option>
          </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSwitchCertificate">取 消</el-button>
        <el-button type="primary" @click="determineSwitchCertificate">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  data() {
    return {
      domain: process.env.BASE_API,
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
      certificateId:'',

    }
  },
  computed: {
    // 加载应用列表
    _state() {
      return this.$store.state.channel_package_configuration
    },
    packing_list(){
      return this.$store.state.packing_list
    },
    template_list(){
      return this.$store.state.configuration_template
    },
    certificate_list(){
      return this.$store.state.certificate_list
    }
  },
  methods: {
    // 取消上传证书
    cancelAddCertificate(){
      this.packing_list.uploadCertificateDialog = false;
      Object.keys(this.addCertificateListData).forEach((key, index) => {this.addCertificateListData[key] = ''})
    },
    // 确定上传证书
    determineAddCertificate(){
      this.addCertificateListData.appId = this.packing_list.tableData.data[this.$route.query.index].appId;
      this.addCertificateListData.appNameEn = this.packing_list.tableData.data[this.$route.query.index].appNameEn;
      for (var key in this.addCertificateListData) {
        if (this.addCertificateListData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请将上传信息填写完整', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
    // 取消绑定
    cacelBinding() {
      this.packing_list.bindingTemplateDialog = false;
      this.packing_list.templateName = ''
    },
    // 确定绑定模板
    determineBindingTemplate() {
      if (this.packing_list.templateName === '') {
        return Vue.prototype.$message({ message: '请选择绑定模板', type: 'warning', duration: 1500 })
      }
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        templateName: this.packing_list.templateName,
      }
      this.$store.dispatch('bindingTemplate', params).then((data) => {
        this.packing_list.bindingTemplateDialog = false;
        return Vue.prototype.$message({ message: '模板绑定成功', type: 'success', duration: 1500 })
      })
    },
    // 取消切换证书
    cancelSwitchCertificate(){
      this.packing_list.switchCertificateDialog = false;
      this.certificateId=''
    },
    // 确定切换证书
    determineSwitchCertificate(){
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        certificateId: this.certificateId,
      }
      this.$store.dispatch('bindSdkPackageCertificate', params).then((data) => {
        this.packing_list.switchCertificateDialog = false;
        this.certificateId=''
        return Vue.prototype.$message({ message: '证书切换成功', type: 'success', duration: 1500 })
      })

    },
    // 编辑框确定按钮触发
    determineAppNameEn() {
      var params = {
        certificateId: this.packing_list.tableData.data[this.$route.query.index].certificateId,
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
      this.$store.commit('SET_CERTIFICATE_TABLE_DATA', response.data.data.filter(todo=>todo.appId == this.addCertificateListData.appId ))
      Object.keys(this.addCertificateListData).forEach((key, index) => {
        if (key == "appId") {
          this.addCertificateListData[key] = 0;
        } else {
          this.addCertificateListData[key] = '';
        }
      })
      this.packing_list.uploadCertificateDialog = false;
      return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
