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
    <!-- 上传母包 -->
    <el-dialog title="添加游戏母包" :visible.sync="packing_list.uploadMotherPackageDialog" @close="cancelAddMotherPackage">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-input v-model="packing_list.matchingInfo.appName" disabled></el-input>
        </el-form-item>
        <el-form-item label="版本名称" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.versionName"></el-input>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="uploadMotherPackage"
            :action="domain+'/basePackage/add'"
            :data="addMotherPackageData"
            :on-success="uploadMotherPackageSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" icon="el-icon-upload el-icon--right" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.versionCode"></el-input>
        </el-form-item>
        <el-form-item label="母包名称" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.basePackageName"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.versionDesc"></el-input>
        </el-form-item>
        <el-form-item label="母包类型" :label-width="formLabelWidth">
          <el-radio v-model="basePackageType" label="0">ios</el-radio>
          <el-radio v-model="basePackageType" label="1">android</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddMotherPackage">取 消</el-button>
        <el-button type="primary" @click="determineAddMotherPackage">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传渠道包 -->
    <el-dialog title="添加渠道包" :visible.sync="packing_list.uploadChannelPackageDialog" @close="cancelAddChannelPackage">
      <el-form>
        <el-form-item label="渠道Id" :label-width="formLabelWidth">
          <el-input v-model="addChannelPackageData.channelId"></el-input>
        </el-form-item>
        <el-form-item label="sdk标识" :label-width="formLabelWidth">
          <el-input class="sdkInput" v-model="addChannelPackageData.sdkName" placeholder="仅限输入字母和符号"></el-input>
        </el-form-item>
        <el-form-item label="渠道包名称" :label-width="formLabelWidth">
          <el-input v-model="addChannelPackageData.channelPackageName"></el-input>
        </el-form-item>
        <el-form-item label="手机系统" :label-width="formLabelWidth">
          <el-radio v-model="os" label="0">ios</el-radio>
          <el-radio v-model="os" label="1">android</el-radio>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="domain+'/channelPackage/add'"
            :data="addChannelPackageData"
            :on-success="uploadChannelPackageSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" icon="el-icon-upload el-icon--right" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddChannelPackage">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传证书弹出框 -->
    <el-dialog title="上传证书" :visible.sync="packing_list.uploadCertificateDialog" @close="cancelAddCertificate">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-input disabled :placeholder="packing_list.tableData.data[$route.query.index].appName"></el-input>
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
            :on-success="uploadCertificateSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" icon="el-icon-upload el-icon--right" size="small" type="primary">选取文件</el-button>
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
              v-for="(item,index) in packing_list.certificateList"
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
    <!-- 切换母包 -->
    <el-dialog title="切换母包" :visible.sync="packing_list.switchMotherPackageDialog" width="450px"  @close="cancelSwitchMotherPackage">
      <el-form>
         <el-select v-model="motherPackageId" filterable placeholder="请选择母包" >
            <el-option
              v-for="(item,index) in packing_list.motherPackageList"
              :key="index"
              :label="item.basePackageName"
              :value="item.basePackageId"
            ></el-option>
          </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSwitchMotherPackage">取 消</el-button>
        <el-button type="primary" @click="determineSwitchMotherPackage">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 切换渠道包 -->
    <el-dialog title="切换渠道包" :visible.sync="packing_list.switchChannelPackageDialog" width="450px"  @close="cancelSwitchChannelPackage">
      <el-form>
         <el-select v-model="channelPackageId" filterable placeholder="请选择渠道包" >
            <el-option
              v-for="(item,index) in packing_list.channelPackageList"
              :key="index"
              :label="item.channelPackageName"
              :value="item.channelPackageId"
            ></el-option>
          </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSwitchChannelPackage">取 消</el-button>
        <el-button type="primary" @click="determineSwitchChannelPackage">确 定</el-button>
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
      basePackageType: '0',             //母包类型
      addMotherPackageData: {       //添加母包弹框数据体
        appId: '',
        versionName: '',
        versionCode: '',
        versionDesc: '',
        basePackageName: '',
      },
      os: '0',                        //系统类型0:ios 1:Android
      addChannelPackageData: {        //添加渠道包参数
        channelPackageName: '',//渠道包名称
        channelId: '', //渠道Id
        sdkName: '',//sdk标识
      },
      addCertificateListData: {
        appId: 0,//应用ID
        alias: '',//别名
        certificatePassword: '',//证书密码
        aliasPassword: '',//别名密码
        appNameEn: '',//应用英文名
      },
      certificateId:'',
      motherPackageId:"",
      channelPackageId:"",
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
    // 取消切换母包
    cancelSwitchMotherPackage(){
      this.packing_list.switchMotherPackageDialog = false;
      this.motherPackageId=''
    },
    // 取消切换渠道包
    cancelSwitchChannelPackage(){
      this.packing_list.switchChannelPackageDialog = false;
      this.channelPackageId=''
    },
    // 确定切换母包
    determineSwitchMotherPackage(){
       var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        basePackageId: this.motherPackageId,
      }
      this.$store.dispatch('bindMotherPackage', params).then((data) => {
        this.packing_list.switchMotherPackageDialog = false;
        this.$store.commit('SET_MOTHERPACKAGE_NAME', this.packing_list.motherPackageList.filter(todo=>todo.basePackageId ==params.basePackageId)[0].basePackageName);
        this.motherPackageId=''
        return Vue.prototype.$message({ message: '母包切换成功', type: 'success', duration: 1500 })
      })
    },
    // 确定切换渠道包
    determineSwitchChannelPackage(){
       var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        channelPackageId: this.channelPackageId,
      }
      this.$store.dispatch('bindChannelPackage', params).then((data) => {
        this.packing_list.switchChannelPackageDialog = false;
        this.$store.commit('SET_CHANNELPACKAGE_NAME', this.packing_list.channelPackageList.filter(todo=>todo.channelPackageId ==params.channelPackageId)[0].channelPackageName);
        this.channelPackageId=''
        return Vue.prototype.$message({ message: '渠道包切换成功', type: 'success', duration: 1500 })
      })
      
    },
    // 确定切换证书
    determineSwitchCertificate(){
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        certificateId: this.certificateId,
      }
      this.$store.dispatch('bindSdkPackageCertificate', params).then((data) => {
        this.packing_list.switchCertificateDialog = false;
        this.certificateId='';
        this.$store.commit('SET_CERTIFICATE_NAME', this.packing_list.certificateList.filter(todo=>todo.certificateId ==params.certificateId)[0].certificateName);
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
    // 证书上传成功
    uploadCertificateSuccess(response, file, fileList) {
      this.fileList = []
      this.packing_list.uploadCertificateDialog = false;
      // 获取配置项
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        appId: this.packing_list.tableData.data[this.$route.query.index].appId
      }
      this.$store.dispatch('getTaskParam', params).then((data) => { 
        return Vue.prototype.$message({ message: '证书上传成功', type: 'success', duration: 1500 })
      })
      // this.$store.commit('SET_CERTIFICATE_TABLE_DATA', response.data.data.filter(todo=>todo.appId == this.addCertificateListData.appId ))
      // Object.keys(this.addCertificateListData).forEach((key, index) => {
      //   if (key == "appId") {
      //     this.addCertificateListData[key] = 0;
      //   } else {
      //     this.addCertificateListData[key] = '';
      //   }
      // })
    },
    // 20200115
    // 母包上传成功
    uploadMotherPackageSuccess(response, file, fileList){
      this.fileList = []
      this.packing_list.uploadMotherPackageDialog = false;
      // 获取配置项
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        appId: this.packing_list.tableData.data[this.$route.query.index].appId
      }
      this.$store.dispatch('getTaskParam', params).then((data) => { 
        return Vue.prototype.$message({ message: '母包上传成功', type: 'success', duration: 1500 })
      })
      
    },
    // 渠道包上传成功
    uploadChannelPackageSuccess(response, file, fileList){
      this.fileList = []
      this.packing_list.uploadChannelPackageDialog = false;
      // 获取配置项
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        appId: this.packing_list.tableData.data[this.$route.query.index].appId
      }
      this.$store.dispatch('getTaskParam', params).then((data) => { 
        return Vue.prototype.$message({ message: '渠道包上传成功', type: 'success', duration: 1500 })
      })
    },
    // 添加框取消按钮触发
    cancelAddMotherPackage() {
      // 初始化添加表单
      this.fileList=[]
      this.packing_list.uploadMotherPackageDialog = false;
      this.basePackageType = '0';
      Object.keys(this.addMotherPackageData).forEach((key, index) => {
        if (key == "appId") {
          this.addMotherPackageData[key] = 0;
        } else {
          this.addMotherPackageData[key] = '';
        }
      })
    },
    // 添加框确定按钮触发
    determineAddMotherPackage() {
      this.addMotherPackageData.basePackageType = this.basePackageType;
      this.addMotherPackageData.appId = this.packing_list.matchingInfo.appId;
      for (var key in this.addMotherPackageData) {
        if (this.addMotherPackageData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请选中上传文件', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.uploadMotherPackage.submit();
    },
    // 取消添加渠道包
    cancelAddChannelPackage() {
      this.fileList = [];
      this.packing_list.uploadChannelPackageDialog = false;
      Object.keys(this.addChannelPackageData).forEach((key, index) => { this.addChannelPackageData[key] = '' })
    },
    // 添加框确定添加按钮
    determineChangeData() {
      this.addChannelPackageData.os = this.os;
      for (var key in this.addChannelPackageData) {
        if (this.addChannelPackageData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请将上传信息填写完整', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
