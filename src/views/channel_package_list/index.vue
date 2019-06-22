<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button type="info" plain @click="dialogFormVisible = true">
        <i class="el-icon-plus"/>
        {{_state.certificate_list.tip}}
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加渠道包" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form>
        <el-form-item label="渠道Id" :label-width="formLabelWidth">
          <el-input v-model="addChannelPackageData.channelId"></el-input>
        </el-form-item>
        <el-form-item label="sdk标识" :label-width="formLabelWidth">
          <el-input v-model="addChannelPackageData.sdkName"></el-input>
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
            action="http://172.16.10.106:8080/channelPackage/add"
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form>
        <el-form-item label="渠道ID" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.channelId"></el-input>
        </el-form-item>
        <el-form-item label="sdk标识" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.sdkName"></el-input>
        </el-form-item>
        <el-form-item label="渠道包名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.channelPackageName"></el-input>
        </el-form-item>
        <el-form-item label="系统" :label-width="formLabelWidth">
          <el-radio v-model="changeInfo.os" label="0">ios</el-radio>
          <el-radio v-model="changeInfo.os" label="1">android</el-radio>
        </el-form-item>
        <!-- <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.aliasPassword" ></el-input>
        </el-form-item>-->
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
        :sortable="i==0||i==1"
        :prop="item"
        :label="tableHead[i]"
        :width="getWidth(i)"
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
      tableData: [],
      fileList: [],
      // 
      dialogFormVisible: false,
      changeDataFormVisible: false,
      form: {
        channelPackageName: null,
        aliasPassword: null,
        sdkName: null,
      },
      addChannelPackageData: {
        channelPackageName: '',//渠道包名称
        channelId: '', //渠道Id
        sdkName: '',//sdk标识
      },
      os: '0',
      changeInfo: {
        channelPackageName: null,
        channelId: null,
        os: '0',
        sdkName: null,
        index: null,
      },
      formLabelWidth: '120px',
      tableHead: ['渠道包ID', '渠道ID', 'sdk标识', '系统', '渠道包名称', '存储目录', '上传时间']

    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.$store.dispatch('getChannelPackage').then((data) => {
        this.listLoading = false
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
    arrValue(newValue, oldValue) {
      console.log(newValue)
    }
  },
  methods: {
    // 取消
    cancel() {
      this.dialogFormVisible = false;
      Object.keys(this.form).forEach((key, index) => { this.form[key] = null })
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

    // 编辑数据
    changeData() {
      var params = {
        channelId: this.changeInfo.channelId,
        channelPackageId: this.tableData[this.changeInfo.index].channelPackageId,
        sdkName: this.changeInfo.sdkName,
        channelPackageName: this.changeInfo.channelPackageName,
        os: this.changeInfo.os,
      }
      this.$store.dispatch('changeChannelPackage', params).then((data) => {
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
        this.changeDataFormVisible = false;
        Object.keys(this.changeInfo).forEach((item) => {
          this.changeInfo.item = null
        })
      })
    },
    // 编辑数据下标
    startChange(index, row) {
      this.changeInfo.channelId = this.tableData[index].channelId;
      this.changeInfo.sdkName = this.tableData[index].sdkName;
      this.changeInfo.channelPackageName = this.tableData[index].channelPackageName;
      this.changeInfo.os = ('' + this.tableData[index].os);
      this.changeInfo.index = index;
      this.changeDataFormVisible = true;
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
        return Vue.prototype.$message({ message: response.message, type: 'warning', duration: 1500 })
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
      this.dialogFormVisible = false
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
</style>

