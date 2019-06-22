<template>
  <div class="app-container">
    <el-button type="primary" style="margin:10px 0" plain @click="goBack">
      <i class="el-icon-back"/> 返回列表界面
    </el-button>
    <div v-if="$route.query.index>=0&&packing_list.tableData.data">
      <!-- <p>{{certificate_list}}</p> -->
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
          <span class="title">游戏:</span>
          <el-input
            style="width:400px"
            disabled
            :placeholder="packing_list.tableData.data[$route.query.index].channelPackageName"
          ></el-input>
        </div>
      </section>
      <!-- 步骤一:选择证书 -->
      <section class="step3">
        <el-steps :active="1" simple>
          <el-step icon="el-icon-tickets" title="步骤一:选择证书"></el-step>
        </el-steps>
        <div style="margin:20px">
          <span class="title">请选择证书:</span>
          <el-select v-model="certificateId" filterable placeholder="请选择证书" @focus="addCertificate">
            <el-option
              v-for="(item,index) in certificate_list.tableData"
              :key="index"
              :label="item.certificateName"
              :value="item.certificateId"
            ></el-option>
          </el-select>
          <el-button type="primary" plain @click="uploadCertificate">上传证书</el-button>
        </div>
      </section>
    </div>
    <p v-else>请返回上一层级</p>
    <dialog-page></dialog-page>
  </div>
</template>
<script>
import dialogPage from './dialog'
export default {
  components:{dialogPage},
  data() {
    return {
      certificateId: '',
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.packing_list.tableData.data) {
      if (confirm("确定离开吗？") == true) {
        next()   //跳转到另一个路由
      } else {
        next(false);//不跳转
      }
    } else {
      next()   //跳转到另一个路由
    }
  },

  created() {
    this.dataInit()
    let _this = this
    // 页面刷新提示
    window.onbeforeunload = function (e) {
      if (_this.$route.path == "/package_management/packing_list/detailsPage") {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '关闭提示1111';
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭提示222';
      } else {
        window.onbeforeunload = null
      }
    };
    if (this.$route.query.index >= 0 && this.packing_list.tableData.data) {
      // 如果没有配置打包证书则获取之前配置的证书
      // var appId = this.packing_list.tableData.data[this.$route.query.index].appId
      // this.$store.dispatch('getCertificateList', appId).then((data) => { })
      // 获取配置项
      var params = {
        taskId: this.packing_list.tableData.data[this.$route.query.index].taskId,
        appId: this.packing_list.tableData.data[this.$route.query.index].appId      }
      this.$store.dispatch('getTaskParam', params).then((data) => {
        console.log(this.packing_list.taskConfigParam);


      })
    }

  },
  computed: {
    packing_list() {
      return this.$store.state.packing_list
    },
    certificate_list() {
      return this.$store.state.certificate_list
    }

  },

  methods: {
    goBack() {
      this.$router.push({ path: 'mainPage' })
    },
    // 添加证书
    addCertificate() {
      if (!this.certificate_list.tableData.length) {
        this.packing_list.dialogFormVisible = true;
        // this.diolagData.data = this.game_list.tableData.data[this.appId]
      }
    },
    //上传证书
    uploadCertificate() {
      console.log(this.packing_list);

      this.packing_list.dialogFormVisible = true;
      console.log(this.packing_list);

      // this.diolagData.data = this.game_list.tableData.data[this.appId]
    },
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

