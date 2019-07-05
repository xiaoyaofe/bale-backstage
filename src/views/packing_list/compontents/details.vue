<template>
  <div class="app-container">
    <el-button type="primary" style="margin:10px 0" plain @click="goBack">
      <i class="el-icon-back"/> 返回列表界面
    </el-button>
    <div v-if="$route.query.index>=0&&packing_list.tableData.data">
      <!-- 步骤一:选择游戏  -->
      <section class="step1">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="当前游戏"></el-step>
        </el-steps>
        <div style="margin:20px">
          <span class="title">游戏:</span>
          <el-input
            style="width:400px"
            disabled
            :placeholder="packing_list.tableData.data[$route.query.index].appName"
          ></el-input>
        </div>
      </section>
      <!-- 步骤二选择渠道包  -->
      <section class="step2">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="当前渠道包"></el-step>
        </el-steps>
        <div style="margin:20px">
          <span class="title">渠道包:</span>
          <el-input
            style="width:400px"
            disabled
            :placeholder="packing_list.tableData.data[$route.query.index].channelPackageName"
          ></el-input>
        </div>
      </section>
      <!-- 步骤三:选择证书 -->
      <section class="step3">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="步骤一:选择证书"></el-step>
        </el-steps>
        <div style="margin:20px">
          <span class="title">证书:</span>
          <el-input
            style="width:400px"
            disabled
            :placeholder="packing_list.sdkPackageCertificate?'当前绑定的证书是 : '+packing_list.sdkPackageCertificate.certificateName:'暂未绑定证书'"
          ></el-input>
          <el-button type="primary" plain @click="switchCertificate">切换证书</el-button>
          <el-button type="primary" plain @click="uploadCertificate">上传证书</el-button>
        </div>
      </section>
      <!-- 步骤四:配置参数 -->
      <section class="step4">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="步骤二:配置打包参数"></el-step>
        </el-steps>
        <div style="margin:20px">
          <span class="title">模板操作:</span>
          <strong>
            <el-button type="primary" @click="bindingTemplateButton">绑定模板</el-button>
            <el-button type="primary" @click="unBindingTemplateButton">模板解绑</el-button>
          </strong>
          <!-- <p>{{packing_list.taskConfigParam}}</p> -->
          <!-- table -->
          <el-table
            v-loading="listLoading"
            :data="packing_list.taskConfigParam"
            empty-text="当前应用渠道包未绑定模板, 请先绑定模板!!!"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            style="marginTop:20px"
          >
            <el-table-column
              v-for="(item, i) in (Object.keys(packing_list.taskConfigParam[0]?packing_list.taskConfigParam[0]:{}))"
              :key="i"
              v-if="i!=7"
              :sortable="i==0||i==1"
              :prop="item"
              :label="tableHead[i]"
              :width="getWidth(i)"
            ></el-table-column>
            <el-table-column
              min-width="300px"
              v-for="(item, i) in (Object.keys(packing_list.taskConfigParam[0]?packing_list.taskConfigParam[0]:{}))"
              v-if="i===7"
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
        </div>
      </section>
      <!-- 步骤五:配置游戏ICON -->
      <section class="step5">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="步骤三:配置游戏ICON"></el-step>
        </el-steps>
        <span class="title" style="margin:20px 20px 0px;">上传游戏icon:</span>
        <div class="iconBox">
          <section v-for="(item,i) in packing_list.aIconData" :key="i" class="iconItem">
            <div :class="`ICONIMG${i}`">
              <el-upload
                class="avatar-uploader"
                :action="domain+'/task/addSdkPackageIcon'"
                :data="addIconUploadData"
                :show-file-list="false"
                :on-success="IconUploadSuccess.bind(this,i)"
                :before-upload="beforeAvatarUpload.bind(this,i)"
                :on-progress="handleProgress.bind(this,i)"
              >
                <img v-if="item.imageUrl" :src="item.imageUrl" :class="['avatar',`avatar${i}`]">
                <i
                  v-else
                  :class="['el-icon-plus','avatar-uploader-icon',`avatar-uploader-icon${i}`]"
                ></i>
              </el-upload>
            </div>
            <span class="iconTitle">{{item.tilte}}</span>
            <!-- <el-progress
              v-if="item.progress && !item.status"
              class="iconProgress"
              type="circle"
              :percentage="item.progress"
              :status="item.status"
            ></el-progress>-->
          </section>
        </div>
      </section>
    </div>
    <p v-else>请返回上一层级</p>
    <dialog-page></dialog-page>
  </div>
</template>
<script>
import dialogPage from './details_dialog'
export default {
  components: { dialogPage },
  data() {
    return {
      domain: process.env.BASE_API,
      certificateId: '',
      tableHead: [],
      listLoading: false,
      changeConfigIndex: -1,
      configValue: '',
      addIconUploadData: {       //icon上传数据体
        taskId: '',
        iconType: '',
        iconTypeKey: '',
        filePath: '',
        id: '',
        file: '',
      },
      tableHead: ['主键ID', '任务ID', '模板名称', '模板ID', '配置名称', '配置key值', '配置类型', '参数值', '创建时间']
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.packing_list.tableData.data) {
  //     if (confirm("确定离开吗？") == true) {
  //       next()   //跳转到另一个路由
  //     } else {
  //       next(false);//不跳转
  //     }
  //   } else {
  //     next()   //跳转到另一个路由
  //   }
  // },

  created() {
    this.dataInit()
    let _this = this
    // 页面刷新跳转主页面
    window.addEventListener('load', function () {
      if (_this.$route.path === '/package_management/packing_list/detailsPage') { // /date 表示日期选择路由
        _this.$router.replace('/package_management/packing_list') // 列表页面的路由
      }
    })
    if (this.$route.query.index >= 0 && this.packing_list.tableData.data) {
      // 获取配置项
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        appId: this.packing_list.tableData.data[this.$route.query.index].appId
      }
      this.$store.dispatch('getTaskParam', params).then((data) => { })
    }
    // window.onbeforeunload = function (e) {
    //   if (_this.$route.path == "/package_management/packing_list/detailsPage") {
    //     alert(111111111111)
    //   _this.$router.push({ name: 'mainPage' })
    //     // e = e || window.event;
    //     // // 兼容IE8和Firefox 4之前的版本
    //     // if (e) {
    //     //   e.returnValue = '关闭提示1111';
    //     // }
    //     // // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    //     // return '关闭提示222';
    //   } else {
    //     window.onbeforeunload = null
    //   }
    // };
  },
  computed: {
    packing_list() {
      return this.$store.state.packing_list
    },
    certificate_list() {
      return this.$store.state.certificate_list
    },
  },

  methods: {
    goBack() {
      this.$router.push({ path: 'mainPage' })
    },
    // 添加证书
    addCertificate() {
      if (!this.certificate_list.tableData.length) {
        this.packing_list.uploadCertificateDialog = true;
      }
    },
    //上传证书
    uploadCertificate() {
      this.packing_list.uploadCertificateDialog = true;
    },
    // 切换证书
    switchCertificate() {
      if (!this.certificate_list.tableData.length) {
        return this.$message({ message: '当前打包任务暂未上传证书,请先上传证书!!!', type: 'warning', duration: 1500 })
      } else {
        this.packing_list.switchCertificateDialog = true;
      }
    },
    // 绑定模板弹窗
    bindingTemplateButton() {
      this.packing_list.bindingTemplateDialog = true;
    },
    // 解除模板绑定
    unBindingTemplateButton() {
      if (!this.packing_list.taskConfigParam.length) {
        return this.$message({ message: '当前应用渠道包未绑定模板, 请先绑定模板!!!', type: 'warning', duration: 1500 })
      }
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        templateName: this.packing_list.taskConfigParam[0].templateName,
      }
      this.$store.dispatch('unBindingTemplate', params).then((data) => {
        return this.$message({ message: '模板解绑成功', type: 'success', duration: 1500 })
      })
    },
    // 确定修改configValue
    confirmEdit(row) {
      var params = {
        taskId: this.packing_list.taskConfigParam[row.$index].taskId,
        templateName: this.packing_list.taskConfigParam[row.$index].templateName,
        configId: this.packing_list.taskConfigParam[row.$index].configId,
        id: this.packing_list.taskConfigParam[row.$index].id,
        configValue: this.configValue
      }
      this.$store.dispatch('changeChannelPackageInfo', Qs(params)).then((data) => {
        this.changeConfigIndex = -1;
        this.configValue = "";
        this.$message({ message: '修改渠道包配置信息成功', type: 'success' })
      })
    },
    // 取消修改configValue
    cancelEdit(row, i) {
      this.changeConfigIndex = -1;
      this.configValue = "";
    },
    // ICON上传成功钩子函数
    IconUploadSuccess(idx, res, file, fileList) {
      if (res.code == 200) {
        var newIcon = res.data.data.filter(todo => todo.iconType == this.addIconUploadData.iconType)[0]
        this.packing_list.aIconData[idx].imageUrl = URL.createObjectURL(file.raw);
        this.packing_list.aIconData[idx].id = newIcon.id;
        this.packing_list.aIconData[idx].status = "success";
        this.packing_list.aIconData[idx].progress = 100;
        this.$message({ message: `ICON上传成功`, type: 'success', duration: 1500 })
      } else {
        this.packing_list.aIconData[idx].status = "exception";
        return this.$message({ message: res.message, type: 'error' })
      }
    },
    // ICON上传文件中的钩子函数
    handleProgress(idx, event, file, fileLis) {
      this.packing_list.aIconData[idx].progress = Math.floor(event.percent) - 10;
    },
    // ICON上传文件前的钩子函数
    beforeAvatarUpload(idx, file) {
      this.addIconUploadData.id = this.packing_list.aIconData[idx].id;
      this.addIconUploadData.taskId = this.packing_list.tableData.data[this.$route.query.index].taskId;
      this.addIconUploadData.iconType = this.packing_list.aIconData[idx].iconType;
      this.addIconUploadData.iconTypeKey = this.packing_list.aIconData[idx].iconTypeKey;
      this.addIconUploadData.filePath = this.packing_list.aIconData[idx].filePath;
      // this.addIconUploadData.file= file;
      const aImgType = ['image/jpeg', 'image/png']
      if (!aImgType.includes(file.type)) {
        this.$message.error('上传头像图片只能是 JPG或者png 格式!');
      }
      return aImgType.includes(file.type);
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [100, 100, 150, 100, 120, 100, 100, 160, 190,]
      return arr[i]
    },
    // 初始化
    dataInit() {
      if (this.packing_list.taskConfigParam.sdkPackageCertificate) {
        this.certificateId = this.packing_list.taskConfigParam.sdkPackageCertificate.certificateId
      }
    }
  },
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
.avatar-uploader-icon0 {
  width: 36px;
  height: 36px;
  line-height: 36px;
  // margin: 78px;
}
.avatar0 {
  width: 36px;
  height: 36px;
  // margin: 78px;
}
.ICONIMG0 {
  margin: 78px;
}
.avatar-uploader-icon1 {
  width: 48px;
  height: 48px;
  line-height: 48px;
  // margin: 72px;
}
.avatar1 {
  width: 48px;
  height: 48px;
  // margin: 72px;
}
.ICONIMG1 {
  margin: 72px;
}
.avatar-uploader-icon2 {
  width: 72px;
  height: 72px;
  line-height: 72px;
  // margin: 60px;
}
.avatar2 {
  width: 72px;
  height: 72px;
  // margin: 60px;
}
.ICONIMG2 {
  margin: 60px;
}
.avatar-uploader-icon3 {
  width: 96px;
  height: 96px;
  line-height: 96px;
  // margin: 48px;
}
.avatar3 {
  width: 96px;
  height: 96px;
  // margin: 48px;
}
.ICONIMG3 {
  margin: 48px;
}
.avatar-uploader-icon4 {
  width: 144px;
  height: 144px;
  line-height: 144px;
  // margin: 24px;
}
.avatar4 {
  width: 144px;
  height: 144px;
  // margin: 24px;
}
.ICONIMG4 {
  margin: 24px;
}
.avatar-uploader-icon5 {
  width: 192px;
  height: 192px;
  line-height: 192px;
  // margin: 18px;
}
.avatar5 {
  width: 192px;
  height: 192px;
  // margin: 18px;
}
.iconTitle {
  width: 192px;
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

