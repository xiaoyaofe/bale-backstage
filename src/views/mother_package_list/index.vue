<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button type="info" plain @click="dialogFormVisible = true">
        <i class="el-icon-plus"/>添加
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加游戏母包" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form>
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="appNameEnIndex" filterable placeholder="请选择应用">
            <el-option
              v-for="(item,index) in _state.game_list.tableData.data"
              :key="index"
              :label="item.appNameZn"
              :value="index"
              :disabled="!item.appNameEn"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本名称" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.versionName"></el-input>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="domain+'/basePackage/add'"
            :data="addMotherPackageData"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="addMotherPackageData.versionCode"></el-input>
        </el-form-item>
        <el-form-item label="母包包名" :label-width="formLabelWidth">
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="determineAddData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form>
        <el-form-item label="版本名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.versionName"></el-input>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.versionCode"></el-input>
        </el-form-item>
        <el-form-item label="版本备注" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.versionDesc"></el-input>
        </el-form-item>
        <el-form-item label="母包类型" :label-width="formLabelWidth">
          <el-radio v-model="changeInfo.basePackageType" label="0">ios</el-radio>
          <el-radio v-model="changeInfo.basePackageType" label="1">android</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="$store.state.mother_package_list.tableData.data"
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
  data() {
    return {
      domain:process.env.BASE_API,
      fileList: [],                 //上传列表存储
      tableData: [],                //表格数据
      basePackageType: '0',             //母包类型
      appNameEnIndex: '',            //app应用下标
      listLoading: true,            //表格loading变量
      formLabelWidth: '120px',      //表单长度变量
      dialogFormVisible: false,     //添加框显示/隐藏变量
      changeDataFormVisible: false, //编辑框显示/隐藏变量
      changeInfo: {                 //编辑框数据体
        versionName: null,
        versionCode: null,
        versionDesc: null,
        basePackageType: '0',
        index: null,
      },
      addMotherPackageData: {       //添加框数据体
        appId: 0,
        appNameEn: ' ',
        versionName: '',
        versionCode: '',
        versionDesc: '',
        basePackageName: '',
      },
      tableHead: ['主键ID', '应用Id', '版本名称', '版本号', '版本备注', '母包名称', '母包类型', '存储目录', '上传时间'],//表头修饰
    }
  },
  created() {
    // 初始化获取应用列表
    this.$store.dispatch('getGameList').then((data) => {
      this.$store.dispatch('getMasterPackageList').then((data) => {
        this.listLoading = false
      })
    })
  },
  computed: {
    // 应用列表
    _state() {
      if (this.$store.state.mother_package_list.tableData.data) {
        this.tableData = [...this.$store.state.mother_package_list.tableData.data]
      }
      return this.$store.state
    }
  },
  methods: {
    // 添加框取消按钮触发
    cancel() {
      // 初始化添加表单
      this.dialogFormVisible = false
      this.basePackageType = '0';
      this.appNameEnIndex = '';
      Object.keys(this.addMotherPackageData).forEach((key, index) => {
        if (key == "appId") {
          this.addMotherPackageData[key] = 0;
        } else {
          this.addMotherPackageData[key] = '';
        }
      })
    },
    // 添加框确定按钮触发
    determineAddData() {
      if (this.appNameEnIndex === '') {
        return Vue.prototype.$message({ message: '请选中应用', type: 'warning', duration: 1500 })
      }
      this.addMotherPackageData.basePackageType = this.basePackageType;
      this.addMotherPackageData.appId = this._state.game_list.tableData.data[this.appNameEnIndex].appId;
      this.addMotherPackageData.appNameEn = this._state.game_list.tableData.data[this.appNameEnIndex].appNameEn;
      for (var key in this.addMotherPackageData) {
        if (this.addMotherPackageData[key] === '') {
          return Vue.prototype.$message({ message: '添加失败,请选中上传文件', type: 'warning', duration: 1500 })
        }
      }
      this.$refs.upload.submit();
    },
    // 编辑框确定按钮触发
    determineChangeData() {
      var params = {
        basePackageName: this.tableData[this.changeInfo.index].basePackageName,
        basePackageId: this.tableData[this.changeInfo.index].basePackageId,
        appId: this.tableData[this.changeInfo.index].appId,
        basePackageType: this.changeInfo.basePackageType,
        versionName: this.changeInfo.versionName,
        versionCode: this.changeInfo.versionCode,
        versionDesc: this.changeInfo.versionDesc,
      }
      this.$store.dispatch('changeMasterPackageInfo', params).then((data) => {
        Vue.prototype.$message({ message: '编辑成功', type: 'success', duration: 1500 })
        this.changeDataFormVisible = false;
        Object.keys(this.changeInfo).forEach((item) => {
          if (item === "appId") {
            this.changeInfo.item = 0
          }
          this.changeInfo.item = null
        })
      })
    },
    // 编辑按钮触发
    startChange(index, row) {
      console.log(111,this.tableData[index]);
      
      this.changeInfo.versionName = this.tableData[index].versionName;
      this.changeInfo.versionCode = this.tableData[index].versionCode;
      this.changeInfo.versionDesc = this.tableData[index].versionDesc;
      this.changeInfo.basePackageType = ('' + this.tableData[index].basePackageType);
      this.changeInfo.index = index;
      this.changeDataFormVisible = true;
    },
    // 删除按钮触发
    deleteData(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          basePackageId: this.tableData[index].basePackageId,
          filePath: this.tableData[index].filePath,
        }
        this.$store.dispatch('delMasterPackageList', params).then((data) => {
        Vue.prototype.$message({ message: '删除成功', type: 'success', duration: 1500 })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // 
    },
    // 格式化母包类型
    formatterData(row, column, cellValue, index) {
      var { label } = column
      if (label === '母包类型') {
        return cellValue ? 'android' : 'ios'
      }
      return cellValue
    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [90, 90, 140, 120, 140, 160, 160, , 160]
      return arr[i]
    },
    // 文件上传成功的钩子函数
    uploadSuccess(response, file, fileList) {
      this.basePackageType = '0';
      this.appNameEnIndex = '';
      Object.keys(this.addMotherPackageData).forEach((key, index) => {
        if (key == "appId") {
          this.addMotherPackageData[key] = 0;
        } else {
          this.addMotherPackageData[key] = '';
        }
      })
      this.$store.commit('SET_MOTHER_TABLE_DATA', response.data)
      this.dialogFormVisible = false
      return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

