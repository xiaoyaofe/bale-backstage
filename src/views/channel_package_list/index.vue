<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button type="info" plain @click="addChannelPackageDialog = true">
        <i class="el-icon-plus"/>
        {{_state.certificate_list.tip}}
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加渠道包" :visible.sync="addChannelPackageDialog" @close="unaddChannelPackage">
      <el-form>
        <el-form-item label="渠道Id" :label-width="formLabelWidth">
          <el-input v-model="addChannelPackageData.channelId"></el-input>
        </el-form-item>
        <el-form-item label="sdk标识" :label-width="formLabelWidth">
          <input class="sdkInput" v-model="addChannelPackageData.sdkName" placeholder="仅限输入字母和符号"/>
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
            :on-success="uploadSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unaddChannelPackage">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="editChannelPackageDialog">
      <el-form>
        <el-form-item label="渠道ID" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.channelId"></el-input>
        </el-form-item>
        <el-form-item label="sdk标识" :label-width="formLabelWidth">
          <input class="sdkInput" v-model="changeInfo.sdkName" placeholder="仅限输入字母和符号"/>
        </el-form-item>
        <el-form-item label="渠道包名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.channelPackageName"></el-input>
        </el-form-item>
        <el-form-item label="系统" :label-width="formLabelWidth">
          <el-radio v-model="changeInfo.os" label="0">ios</el-radio>
          <el-radio v-model="changeInfo.os" label="1">android</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editChannelPackageDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineEditData">确 定</el-button>
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
        v-if="i!=5"
        :key="i"
        :sortable="i==0||i==1"
        :prop="item"
        :label="tableHead[i]"
        :formatter="formatterData"
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
      domain: process.env.BASE_API,   //渠道包上传域名
      tableLoading: true,             //表格loading变量
      tableData: [],                  //表格数据
      fileList: [],                   //上传列表
      addChannelPackageDialog: false, //添加渠道包对话框变量
      addChannelPackageData: {        //添加渠道包参数
        channelPackageName: '',//渠道包名称
        channelId: '', //渠道Id
        sdkName: '',//sdk标识
      },
      os: '0',                        //系统类型0:ios 1:Android
      editChannelPackageDialog: false,//编辑渠道包对话框变量   
      changeInfo: {                   //编辑渠道包参数
        channelPackageName: null,
        channelId: null,
        sdkName: null,
        index: null,
        os: '0',
      },
      formLabelWidth: '120px',        //表单长度
      tableHead: ['渠道包ID', '渠道ID', 'sdk标识', '系统', '渠道包名称', '存储目录', '上传时间']
    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.$store.dispatch('getChannelPackage').then((data) => {
        this.tableLoading = false
      })
    })
  },
  computed: {
    // 加载应用列表
    _state() {
      if (this.$store.state.channel_package_list.tableData.data) {
        this.tableData = [...this.$store.state.channel_package_list.tableData.data]
      }
      return this.$store.state
    }
  },
  watch: {
    'addChannelPackageData.sdkName': {
      handler: function (newValue, oldValue) {
        if(!(/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/.test(newValue))){ 
          this.addChannelPackageData.sdkName = ''
        }else{
          this.addChannelPackageData.sdkName = newValue
        }
      }
    },
    'changeInfo.sdkName': {
      handler: function (newValue, oldValue) {
        if(!(/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/.test(newValue))){ 
          this.changeInfo.sdkName = ''
        }else{
          this.changeInfo.sdkName = newValue
        }
      }
    }
  },
  methods: {
    // 取消添加渠道包
    unaddChannelPackage() {
      this.fileList = [];
      this.addChannelPackageDialog = false;
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
    // 确定修改编辑数据
    determineEditData() {
      var params = {
        channelId: this.changeInfo.channelId,
        channelPackageId: this.tableData[this.changeInfo.index].channelPackageId,
        sdkName: this.changeInfo.sdkName,
        channelPackageName: this.changeInfo.channelPackageName,
        os: this.changeInfo.os,
      }
      this.$store.dispatch('changeChannelPackage', params).then((data) => {
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
        this.editChannelPackageDialog = false;
        Object.keys(this.changeInfo).forEach((item) => {
          this.changeInfo.item = null
        })
      })
    },
    // 编辑按钮触发
    startChange(index, row) {
      this.changeInfo.channelId = this.tableData[index].channelId;
      this.changeInfo.sdkName = this.tableData[index].sdkName;
      this.changeInfo.channelPackageName = this.tableData[index].channelPackageName;
      this.changeInfo.os = ('' + this.tableData[index].os);
      this.changeInfo.index = index;
      this.editChannelPackageDialog = true;
    },
    // 删除数据
    deleteData(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          channelPackageId: this.tableData[index].channelPackageId,
          filePath: this.tableData[index].filePath,
        }
        this.$store.dispatch('delChannelPackage', params).then((data) => {
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
      if (response.code != 200) {
        return Vue.prototype.$message({ message: response.message, type: 'error', duration: 1500 })
      }
      this.fileList = []
      Object.keys(this.addChannelPackageData).forEach((key, index) => {
        if (key == "appId") {
          this.addChannelPackageData[key] = 0;
        } else {
          this.addChannelPackageData[key] = '';
        }
      })
      this.$store.commit('SET_CHANNEL_PACKAGE_DATA', response.data)
      this.addChannelPackageDialog = false
      return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
    },
    // 格式化母包类型
    formatterData(row, column, cellValue, index) {
      var { label } = column
      if (label === '系统') {
        return cellValue ? 'android' : 'ios'
      }
      return cellValue
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [130, 100, 150, 150, 150, , , 160, 160]
      return arr[i]
    },
  }
}
</script>
<style lang="scss" scoped>
.sdkInput{
  -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    // outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
</style>

