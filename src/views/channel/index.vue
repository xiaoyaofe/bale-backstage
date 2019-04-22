<template>
  <div class="app-container">
    <div style="marginBottom:20px;display: flex;justify-content: start;">
        <section>
            <span>选择游戏</span>
             <el-select v-model="appValue" placeholder="请选择游戏">
                <el-option v-for="(item,index) in appArr" :key="index" 
                :label="item.label"  :value="item.value"></el-option>
            </el-select>
        </section>
        <el-button  type="info" plain  @click="dialogFormVisible = true" style="marginLeft:20px">
            <i class="el-icon-plus" />添加
        </el-button>
        <el-button  type="info" plain  @click="dialogUploadVisible = true">
            <i class="el-icon-upload" />上传SDK资源
        </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加数据" :visible.sync="dialogFormVisible" width="400px" @close = "cancel">
      <el-form :model="form">
        <el-form-item label="应用名称" :label-width="formLabelWidth1">
          <el-select v-model="form.game_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" :label-width="formLabelWidth1">
          <el-select v-model="form.channel_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="母包包名" :label-width="formLabelWidth1">
          <el-select v-model="form.mother_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传SDK资源弹出框 -->
    <el-dialog title="SDK资源上传" :visible.sync="dialogUploadVisible" width="400px" @close = "uploadCancel">
      <el-form :model="uploadForm">
        <el-form-item label="应用名称" :label-width="formLabelWidth1">
          <el-select v-model="uploadForm.game_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" :label-width="formLabelWidth1">
          <el-select v-model="uploadForm.channel_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道SDK名称" :label-width="formLabelWidth1">
          <el-select v-model="uploadForm.channel_sdk_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth1">
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>
         <el-form-item label="系统类型" :label-width="formLabelWidth1">
            <el-radio v-model="uploadForm.system_type" label="0">ios</el-radio>
            <el-radio v-model="uploadForm.system_type" label="1">Android</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadCancel">取 消</el-button>
        <el-button type="primary" @click="submitSdk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 配置参数弹出框 -->
    <el-dialog title="包配置参数" :visible.sync="dialogChangeVisible" width="800px" @close = "changeCancel">
      <el-form :model="form">
        <el-form-item label="调试模式" :label-width="formLabelWidth">
          <el-radio v-model="changeInfo.debugging" label="0">非调试</el-radio>
          <el-radio v-model="changeInfo.debugging" label="1">调试</el-radio>
        </el-form-item>
        <el-form-item label="游戏包名" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.packed_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏横竖屏" :label-width="formLabelWidth">
            <el-radio v-model="changeInfo.screen" label="0">横屏</el-radio>
            <el-radio v-model="changeInfo.screen" label="1">竖屏</el-radio>
        </el-form-item>
        <el-form-item label="grena的APPID" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_appId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grena的APPKEY" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_appKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grena的支付KEY" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_pay_key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grena服务端推送KEY" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_serve_key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="沙盒模式" :label-width="formLabelWidth">
           <el-radio v-model="changeInfo.sandbox" label="0">非沙盒</el-radio>
          <el-radio v-model="changeInfo.sandbox" label="1">沙盒</el-radio>
        </el-form-item>
        <el-form-item label="grena客户端推送KEY" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_client_key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="语种" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.language" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="国家代码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.country" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grena的sourceld" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_sourceId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grena的元数据APPID(同grean的APPID)" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.grena_metadata_appId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="facebook的ID" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.fbId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏的versionCode" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.game_version_code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="游戏的versionName" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.game_version_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="facebookID元数据(和fb保持一致)" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.fb_metadata_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="appflye的channel" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.appflye_channel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeCancel">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 推送图标弹出框 -->
    <el-dialog title="推送图标配置" :visible.sync="dialogIconVisible"  @close = "iconCancel">
      <section style="display:flex;justify-content: center;align-items: flex-end;">
        <div style="margin:15px;" v-for="(item,index) in iconImage" :key="index" @click="changeIconIndex = index;">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="item.url" :src="item.url" :class="['avatar',`avatar${index}`]">
            <i v-else :class="['el-icon-plus','avatar-uploader-icon',`avatar-uploader-icon${index}` ]"></i>
          </el-upload>
          <span>{{item.name}}</span>
        </div>
      </section>
      

      <div slot="footer" class="dialog-footer">
        <el-button @click="iconCancel">取 消</el-button>
        <el-button type="primary" @click="submitIcon">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label=" " width="40">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="渠道包ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.appId }}
        </template>
      </el-table-column>
      <el-table-column label="系统类型" width="310" align="center">
         <template slot-scope="scope">
           {{ +scope.row.system_type ? "ios":"android" }}
        </template>
      </el-table-column>
      <el-table-column label="渠道SDK名称" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.appSecret }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.display_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button type="success" plain @click="startIconDialog(scope.$index, scope.row)">推送图标</el-button>
          <el-button type="success" plain @click="startChangeDialog(scope.$index, scope.row)">配置参数</el-button>
          <el-button type="danger" plain @click="deleteData(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'
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
      // 
      appArr: [{
          value: '0',
          label: '全名助攻'
        }, {
          value: '1',
          label: '神将三国'
        }, {
          value: '2',
          label: '港台VS'
        }, {
          value: "3",
          label: '超级英雄'
        }, {
          value: '4',
          label: '全球超英'
        }],
      appValue:"0",
      formLabelWidth: '300px',
      formLabelWidth1:'120px',
      dialogFormVisible:false,
      dialogUploadVisible:false,
      dialogChangeVisible:false,
      dialogIconVisible:false,
      form: {
          game_name: null,
          channel_name:null,
          mother_name:null,
      },
      uploadForm:{
          game_name: null,
          channel_name:null,
          channel_sdk_name: null,
          system_type:"0",
      },
      changeInfo:{
        debugging:"0",
        packed_name:null,
        screen:"0",
        grena_appId:null,
        grena_appKey:null,
        grena_pay_key:null,
        grena_serve_key:null,
        sandbox:"0",
        grena_client_key:null,
        language:null,
        country:null,
        grena_sourceId:null,
        grena_metadata_appId:null,
        fbId:null,
        game_version_code:null,
        game_version_name:null,
        fb_metadata_id:null,
        appflye_channel:null,
      },
      changeIconIndex:-1,
      iconImage: [{name:"36*36",url:''},{name:"48*48",url:''},{name:"72*72",url:''},{name:"96*96",url:''},{name:"144*144",url:''},{name:"192*192",url:''},]
    }
  },
  created() {
    this.fetchData()
  },
  watch:{
    arrValue(newValue,oldValue){
      console.log(newValue)
    }
  },
  methods: {
    // 取消添加
    cancel(){
      this.dialogFormVisible = false;
      this.form.game_name = null;
      this.form.channel_name = null;
      this.form.mother_name = null;
    },
    // 取消上传
    uploadCancel(){
      this.dialogUploadVisible = false;
      this.uploadForm.game_name = null;
      this.uploadForm.channel_name = null;
      this.uploadForm.channel_sdk_name = null;
      this.uploadForm.system_type = '0';
    },
    // 取消配置
    changeCancel(){
      this.dialogChangeVisible = false;
      let arr = ["debugging","screen","sandbox"]
      Object.keys(this.changeInfo).forEach((key, index) => {
        if (arr.includes(key)) {
          this.changeInfo[key] = "0"
        }else{
          this.changeInfo[key] = null
        }
       })

    },
    //取消推送ICon
    iconCancel(){
      this.dialogIconVisible = false;
      for (let index = 0; index < this.iconImage.length; index++) {
       this.iconImage[index].url = "";
      }
    }, 
    //下载包
    download(flag){
        if (flag) {
            Vue.prototype.$message({message: '开始内网下载',type: 'success', duration: 1500})
        }else{
            Vue.prototype.$message({message: '开始外网下载',type: 'success', duration: 1500})
        }
    },
    // 添加打包任务
    submitData(){
        if (!this.form.game_name || !this.form.channel_name || !this.form.mother_name) {
            Vue.prototype.$message({message: '添加失败',type: 'error', duration: 1500})
            return
        }
        this.list.push({game_name:this.appArr[this.form.game_name].label,
                        channel_name:this.appArr[this.form.channel_name].label,
                        mother_name:this.appArr[this.form.mother_name].label,})
        this.dialogFormVisible = false;
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
    },
    // 上传SDK资源
    submitSdk(){
      if (!this.uploadForm.game_name || !this.uploadForm.channel_name || !this.uploadForm.channel_sdk_name ) {
          Vue.prototype.$message({message: '添加失败',type: 'error', duration: 1500})
          return
      }else{
        this.dialogUploadVisible = false;
        Vue.prototype.$message({message: 'SDK上传成功',type: 'success', duration: 1500})
      }
    },
    // 显示配置参数对话框
    startChangeDialog(index,row){
      this.dialogChangeVisible = true;
    },
    // 显示推送图标对话框
    startIconDialog(index,row){
      this.dialogIconVisible = true;
    },
    // 删除数据
    deleteData(index,row){
      this.list.splice(index,1)
      Vue.prototype.$message({message: '删除成功',type: 'success', duration: 1500})
    },
    // 提交配置
    submitChange(){
      this.dialogChangeVisible = false;      
      Vue.prototype.$message({message: '配置参数提交成功',type: 'success', duration: 1500})
    },
    // 提交ICON
    submitIcon(){
      this.dialogIconVisible = false;      
      Vue.prototype.$message({message: '推送图标配置成功',type: 'success', duration: 1500})
      for (let index = 0; index < this.iconImage.length; index++) {
       this.iconImage[index].url = "";
      }
    },
    // 获取数据
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    // 上传Icon
    handleAvatarSuccess(res, file) {
        this.iconImage[this.changeIconIndex].url = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 上传sdk资源
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePreview(file) {
        console.log(file);
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>
<style lang="scss" scoped>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon0 {
    font-size: 28px;
    color: #8c939d;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px solid;
    
  }
  .avatar0 {
      width: 36px;
      height: 36px;
      display: block;
    }
  .avatar-uploader-icon1{
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px solid;
  }
  .avatar1 {
    width: 48px;
    height: 48px;
    display: block;
  }
  .avatar-uploader-icon2{
    font-size: 28px;
    color: #8c939d;
    width: 72px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    border: 1px solid;
  }
  .avatar2 {
    width: 72px;
    height: 72px;
    display: block;
  }
  .avatar-uploader-icon3{
    font-size: 28px;
    color: #8c939d;
    width: 96px;
    height: 96px;
    line-height: 96px;
    text-align: center;
    border: 1px solid;
  }
  .avatar3 {
    width: 96px;
    height: 96px;
    display: block;
  }
  .avatar-uploader-icon4{
    font-size: 28px;
    color: #8c939d;
    width: 114px;
    height: 114px;
    line-height: 114px;
    text-align: center;
    border: 1px solid;
  }
  .avatar4 {
    width: 114px;
    height: 114px;
    display: block;
  }
 .avatar-uploader-icon5{
    font-size: 28px;
    color: #8c939d;
    width: 192px;
    height: 192px;
    line-height: 192px;
    text-align: center;
    border: 1px solid;
  }
  .avatar5 {
    width: 192px;
    height: 192px;
    display: block;
  }
  
</style>

