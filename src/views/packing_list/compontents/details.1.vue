<template>
  <div class="app-container">
    <!-- <p>{{_state.packing_list.mainInfo}}</p> -->
    <el-button type="primary" style="margin:30px 0" plain @click="goBack"><i class="el-icon-back" /> 返回列表界面</el-button>
    <!-- 步骤一:选择游戏  -->
    <section class="step1">
      <el-steps :active="1" simple>
        <el-step icon="el-icon-tickets" title="步骤一:选择游戏"></el-step>
      </el-steps>
      <div style="margin:20px">
        <span class="title">游戏:</span>
        <p>{{route}}</p>
        <el-select v-model="appId" disabled filterable placeholder="请选择应用">
          <el-option
            v-for="(item,index) in _state.game_list.tableData.data"
            :key="index"
            :label="item.appNameZn"
            :value="item.appId"
          ></el-option>
        </el-select>
      </div>
    </section>
    <!-- 步骤:选择游戏  -->
    <section class="step2">
      <el-steps :active="1" simple>
        <el-step icon="el-icon-tickets" title="步骤二:选择渠道包"></el-step>
      </el-steps>
      <div style="margin:20px">
        <span class="title">请选择渠道包:</span>
        <el-select disabled  v-model="channelPackageId" filterable placeholder="请选择渠道包">
          <el-option
            v-for="(item,index) in _state.channel_package_list.tableData.data"
            :key="index"
            :label="item.channelPackageName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
    </section>
    <!-- 步骤:选择证书 -->
    <section class="step3">
      <el-steps :active="1" simple>
        <el-step icon="el-icon-tickets" title="步骤三:选择证书"></el-step>
      </el-steps>
      <div style="margin:20px">
        <span class="title">请选择证书:</span>
        <el-select
          v-model="certificateIndex"
          filterable
          placeholder="请选择证书"
          @focus="addCertificate"
        >
          <el-option
            v-for="(item,index) in _state.channel_package_configuration.certificateList"
            :key="index"
            :label="item.certificateName"
            :value="index"
          ></el-option>
        </el-select>
        <el-button  type="primary" plain @click="uploadCertificate">上传证书</el-button>
      </div>
    </section>
    <!-- 步骤四:配置打包参数 -->
    <section class="step4">
      <el-steps :active="1" simple>
        <el-step icon="el-icon-tickets" title="步骤四:配置打包参数"></el-step>
      </el-steps>
      <div style="margin:20px">
        <span class="title">模板操作:</span>
        <strong v-if="stepArr[0] && channelPackageId">
          <el-button type="primary" @click="bindingTemplateButton">绑定模板</el-button>
          <el-button type="primary" @click="unBindingTemplateButton">模板解绑</el-button>
        </strong>
        <!-- table -->
        <el-table
          v-if="stepArr[0] && channelPackageId"
          v-loading="listLoading"
          :data="tableData"
          empty-text="当前应用渠道包未绑定模板, 请先绑定模板!!!"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="marginTop:20px"
        >
          <el-table-column
            v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
            v-if="i!=5"
            :key="i"
            :sortable="i==0||i==1"
            :prop="item"
            :label="tableHead[i]"
            :width="getWidth(i)"
          ></el-table-column>
          <el-table-column
            min-width="300px"
            v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
            v-if="i===5"
            :key="i"
            :label="tableHead[i]"
          >
            <template slot-scope="row">
              <template v-if="row.$index == changeConfigIndex">
                <el-input v-model="configValue" class="edit-input" size="small"/>
                <el-button
                  v-if="row.$index == changeConfigIndex"
                  type="success"
                  size="small"
                  icon="el-icon-circle-check-outline"
                  @click="confirmEdit(row)"
                >提交</el-button>
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit"
                >取消</el-button>
              </template>
              <span v-else>{{ row.row.configValue }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="row">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="changeConfigIndex = row.$index"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span v-else class="tip">请同时选中游戏和渠道包!!!</span>
      </div>
    </section>
    <!-- 步骤五:配置游戏ICON -->
    <section class="step5">
      <el-steps :active="1" simple>
        <el-step icon="el-icon-tickets" title="步骤五:配置游戏ICON"></el-step>
      </el-steps>
      <span class="title" style="margin:20px 20px 0px;">上传游戏icon:</span>
      <div class="iconBox" v-if="stepArr[0] && channelPackageId">
        <section v-for="(item,i) in aIconData" :key="i" class="iconItem">
          <el-upload
            class="avatar-uploader"
            :action="domain+'/appIcon/upload'"
            :data="addMotherPackageData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess.bind(this,i)"
            :before-upload="beforeAvatarUpload.bind(this,i)"
            :on-progress="handleProgress.bind(this,i)"
          >
            <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="iconTitle">{{item.tilte}}</span>
          <el-progress
            v-if="item.progress && !item.status"
            class="iconProgress"
            type="circle"
            :percentage="item.progress"
            :status="item.status"
          ></el-progress>
        </section>
      </div>
      <span v-else class="iconTip">请同时选中游戏和渠道包!!!</span>
    </section>
    <!-- 绑定模板弹窗 -->
    <el-dialog
      title="绑定模板"
      :visible.sync="bindingTemplateDialog"
      width="400px"
      @close="cacelBinding"
    >
      <el-select v-model="bindingTemplateIndex" filterable placeholder="请选择需要绑定的模板">
        <el-option
          v-for="(item,i) in $store.state.configuration_template.selectTemplateData"
          :key="i"
          :label="item.templateName"
          :value="i"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cacelBinding">取 消</el-button>
        <el-button type="primary" @click="determineBindingTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <dialog-box :diolagData="diolagData"></dialog-box>
  </div>
</template>

<script>
import Vue from 'vue'

import dialogBox from '../../channel_package_configuration/dialog'
export default {
  components: {
    dialogBox
  },
  data() {
    return {
      domain:process.env.BASE_API,
      tableData: [],                //表格数据
      listLoading: true,            //loading加载变量
      bindingTemplateDialog: false, //绑定模板变量
      bindingTemplateIndex: '',     //绑定模板下标
      changeConfigIndex: -1,        //修改表格数据下标
      configValue: '',              //模板参数配置值
      tableHead: ['主键ID', '应用ID', '渠道包ID', '模板ID', '模板名称', '模板参数配置值', '配置参数名称', '配置参数Key值', '上传时间',],
      // aIconData: [],
      appId: '',           //游戏应用下标
      certificateIndex: '',          //证书下标
      channelPackageId: '',         //渠道包ID
      addMotherPackageData: {       //icon上传数据体
        appNameEn: '',
        appId: ' ',
        channelPackageId: '',
        iconType: '',
        iconTypeKey: '',
        filePath: '',
        id: '',
        file: '',
      },
      stepArr: [0],
      diolagData: {
        id: '',
        data: [],
      }
    }
  },
  created() {
    this.appId = this.packing_list.tableData.data[this.$route.query.index].appId;
    this.channelPackageId = this.packing_list.tableData.data[this.$route.query.index].channelPackageId;
    var params = {
       taskId:9
    }
    console.log(1111111111111);
    
    // 初始化获取应用列表
    this.$store.dispatch('getTaskParam',params).then((data) => {
    //   this.$store.dispatch('getChannelPackage').then((data) => {
    //     this.listLoading = false;
    //     this.dataInit()
    //   })
    })
  },
  computed: {
    // 加载应用列表
    _state() {
      if (this.$store.state.channel_package_configuration.tableData) {
        this.tableData = [...this.$store.state.channel_package_configuration.tableData]
      }
      return this.$store.state
    },
    aIconData(){
      return this.$store.state.channel_package_configuration.aIconData
    },
    packing_list(){
      return this.$store.state.packing_list
    }
  },
  watch: {
    // 监听游戏是否切换
    appId(newValue, oldValue) {
      if (this._state.game_list.tableData.data[newValue] && !this._state.game_list.tableData.data[newValue].appNameEn) {
        this.appId = oldValue;
        this.diolagData.id = this._state.game_list.tableData.data[newValue].id;
        this._state.channel_package_configuration.addAppNameEnDialog = true;
      } else {
        this.$store.commit('SET_APP_NAME_EN_INDEX', newValue)
        this.stepArr[0] = 1;
        var params = {
          appId: this._state.game_list.tableData.data[newValue].appId
        }
        this.$store.dispatch('getGameCertificateList', params).then((data) => {
          this.certificateIndex = '';
          if (this.channelPackageId) {
            var params = {
              appId: this._state.game_list.tableData.data[this.appId].appId,
              channelPackageId: this.channelPackageId,
            }
            this.$store.dispatch('getChannelPackageConfiguration', params).then((data) => {
              this.$store.dispatch('getGameChannelPackageIcon', params).then((data) => {
                this.listLoading = false;
              })
            })
          }
        })
      }
    },
    channelPackageId(newValue, oldValue) {
      var params = {
        appId: this._state.game_list.tableData.data[this.appId].appId,
        channelPackageId: newValue
      }
      this.$store.commit('SET_CHANNEL_PACKAGE_ID', newValue)
      this.$store.dispatch('getChannelPackageConfiguration', params).then((data) => {
        this.$store.dispatch('getGameChannelPackageIcon', params).then((data) => {
          this.listLoading = false;
        })
      })
    },
    certificateIndex(newValue,oldValue){
      this.$store.commit('SET_CERTIFICATE_INDEX', newValue)

    }
    

  },
  methods: {
    addCertificate() {
      if (!this._state.channel_package_configuration.certificateList.length) {
        this._state.channel_package_configuration.dialogFormVisible = true;
        this.diolagData.data = this._state.game_list.tableData.data[this.appId]
      }
    },
    // 取消绑定
    cacelBinding() {
      this.bindingTemplateDialog = false;
      this.bindingTemplateIndex = ''
    },
    // 绑定模板弹窗
    bindingTemplateButton() {
      this.$store.dispatch('getConfigurationTemplate').then((data) => {
        this.bindingTemplateDialog = true;
      })
    },
    // 上传证书
    uploadCertificate() {
      this._state.channel_package_configuration.dialogFormVisible = true;
      this.diolagData.data = this._state.game_list.tableData.data[this.appId]
    },
    // 解除绑定
    unBindingTemplateButton() {
      if (!this.tableData[0]) {
        return Vue.prototype.$message({ message: '当前应用渠道包未绑定模板, 请先绑定模板!!!', type: 'warning', duration: 1500 })
      }
      var params = {
        appId: this._state.game_list.tableData.data[this.appId].appId,
        channelPackageId: this.channelPackageId,
        templateName: this.tableData[0].templateName,
      }
      this.$store.dispatch('unBindingTemplate', params).then((data) => {
        return Vue.prototype.$message({ message: '绑定成功', type: 'success', duration: 1500 })
      })
    },
    // 确定绑定模板
    determineBindingTemplate() {
      if (this.bindingTemplateIndex === '') {
        return Vue.prototype.$message({ message: '请选择绑定模板', type: 'warning', duration: 1500 })
      }
      var params = {
        appId: this._state.game_list.tableData.data[this.appId].appId,
        channelPackageId: this.channelPackageId,
        templateName: this._state.configuration_template.selectTemplateData[this.bindingTemplateIndex].templateName,
      }
      this.$store.dispatch('bindingTemplate', params).then((data) => {
        this.bindingTemplateDialog = false;
        return Vue.prototype.$message({ message: '绑定成功', type: 'success', duration: 1500 })
      })
    },
    // 触发确定修改按钮
    confirmEdit(row) {
      var params = {
        appId: this._state.game_list.tableData.data[this.appId].appId,
        channelPackageId: this.channelPackageId,
        templateName: this.tableData[row.$index].templateName,
        templateId: this.tableData[row.$index].templateId,
        id: this.tableData[row.$index].id,
        configValue: this.configValue
      }
      this.$store.dispatch('changeChannelPackageInfo', params).then((data) => {
        this.changeConfigIndex = -1;
        this.configValue = "";
        this.$message({ message: '修改成功', type: 'success' })
      })
    },
    // 取消修改
    cancelEdit(row, i) {
      this.changeConfigIndex = -1;
      this.configValue = "";
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [90, 90, 90, 90, , , , , 160]
      return arr[i]
    },
    dataInit(){
      this.appId = this._state.channel_package_configuration.appId;
      this.channelPackageId = this._state.channel_package_configuration.channelPackageId;
    },
    // 上传成功钩子函数
    handleAvatarSuccess(idx, res, file, fileList) {
      if (res.code == 200) {
        this.aIconData[idx].imageUrl = URL.createObjectURL(file.raw);
        this.aIconData[idx].status = "success";
      } else {
        this.aIconData[idx].status = "exception";
        this.$message({ message: res.message, type: 'warning' })
      }
    },
    // 上传文件中的钩子函数
    handleProgress(idx, event, file, fileLis) {
      this.aIconData[idx].progress = Math.floor(event.percent);
    },
    // 上传文件前的钩子函数
    beforeAvatarUpload(idx, file) {
      console.log(idx,this.aIconData[idx]);
      this.addMotherPackageData.appNameEn = this._state.game_list.tableData.data[this.appId].appNameEn;
      this.addMotherPackageData.appId = this._state.game_list.tableData.data[this.appId].appId;
      this.addMotherPackageData.channelPackageId = this.channelPackageId;
      this.addMotherPackageData.iconType = this.aIconData[idx].type;
      this.addMotherPackageData.iconTypeKey = this.aIconData[idx].type_key;
      this.addMotherPackageData.filePath = this.aIconData[idx].imageUrl;
      this.addMotherPackageData.id = this.tableData[0].id;
      // this.addMotherPackageData.file= file;
      const aImgType = ['image/jpeg', 'image/png']
      if (!aImgType.includes(file.type)) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      return aImgType.includes(file.type);
    },
    goBack(){
      this.$router.push({ path: 'mainPage'})
    }


  }
}
</script>
<style lang="scss" scoped>
.iconBox {
  display: flex;
  width: 100%;
  overflow: auto;
  padding-left: 7%;
  .iconItem {
    margin: 20px 10px 0 10px;
    position: relative;
    .iconProgress {
      position: absolute;
      top: 0;
      left: 0;
      padding: 12px;
    }
  }
}
.app-container {
  .inputSearchBox {
    width: 400px;
  }
  .operationForm {
    // display: flex;
    // justify-content: flex-start;
    margin: 0 0px 15px 0;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border: 1px dashed;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.iconTitle {
  width: 150px;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  padding-top: 11px;
}
.edit-input {
  width: 60%;
  float: left;
  margin-right: 10px;
}
.cancel-btn {
  // position: absolute;
  // right: 15px;
  // top: 18px;
  float: left;
}
.step2,
.step3,
.step4,
.step5 {
  .tip {
    color: red;
    font-weight: bold;
  }
}
.title {
  display: inline-block;
  width: 110px;
  text-align: right;
}
.iconTip {
  display: inline-block;
  color: red;
  font-weight: bold;
}
</style>

