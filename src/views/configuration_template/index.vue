<template>
  <div class="app-container">
    <!-- 操作表单 -->
    <div style="marginBottom:20px;display: flex;justify-content: start;">
      <el-select filterable v-model="templateIndex" placeholder="请选择模板">
        <el-option
          v-for="(item,i) in $store.state.configuration_template.selectTemplateData"
          :key="i"
          :label="item.templateName"
          :value="i"
        ></el-option>
      </el-select>
      <el-input
        style="marginLeft:20px;width:400px"
        placeholder="请输入新的模板名称"
        v-model="newTemplateName"
        class="input-with-select inputSearchBox"
      >
        <el-button slot="append" icon="el-icon-edit-outline" @click="changeTemplateName">修改模板名称</el-button>
      </el-input>
      <el-button
        type="info"
        plain
        @click="addDataDialog = true;addDataParams=true"
        style="marginLeft:20px"
      >
        <i class="el-icon-plus"/>
        {{_state.configuration_template.tip}}
      </el-button>
      <el-button
        type="info"
        plain
        @click="addDataDialog = true;addDataParams=false"
        style="marginLeft:20px"
      >
        <i class="el-icon-plus"/>添加模板参数
      </el-button>
      <el-button type="info" plain @click="copyDataDialog=true" style="marginLeft:20px">
        <i class="el-icon-document-copy"/>&nbsp;复制摸板
      </el-button>
      <el-button type="danger" plain @click="deleteTemplate" style="marginLeft:20px">
        <i class="el-icon-delete"/>&nbsp;删除摸板
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加数据" :visible.sync="addDataDialog" @close="cancelAddTemplate">
      <el-form>
        <el-form-item label="模板名称" :label-width="formLabelWidth">
          <el-input v-if="addDataParams" v-model="addConfigurationTemplate.templateName"></el-input>
          <el-input
            v-if="!addDataParams"
            :placeholder="selectTemplateData[templateIndex].templateName"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!addDataParams" label="配置参数名称" :label-width="formLabelWidth">
          <el-input v-model="addConfigurationTemplate.configName"></el-input>
        </el-form-item>
        <el-form-item v-if="!addDataParams" label="配置参数key值" :label-width="formLabelWidth">
          <el-input v-model="addConfigurationTemplate.configKey"></el-input>
        </el-form-item>
        <el-form-item v-if="!addDataParams" label="配置参数类型" :label-width="formLabelWidth">
          <el-radio v-model="configType" label="0">string</el-radio>
          <el-radio v-model="configType" label="1">param</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddTemplate">取 消</el-button>
        <el-button type="primary" @click="determineAddTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 配置参数弹出框 -->
    <el-dialog title="修改模板参数" :visible.sync="changeDataDialog" @close="changeDataDialog = false">
      <el-form>
        <el-form-item label="配置参数名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.configName"></el-input>
        </el-form-item>
        <el-form-item label="配置参数key值" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.configKey"></el-input>
        </el-form-item>
        <el-form-item label="配置参数类型" :label-width="formLabelWidth">
          <el-radio v-model="changeInfo.configType" label="0">string</el-radio>
          <el-radio v-model="changeInfo.configType" label="1">param</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDataDialog = false">取 消</el-button>
        <el-button type="primary" @click="determineChangeData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 复制模板弹窗 -->
    <el-dialog title="复制模板" :visible.sync="copyDataDialog" @close="cancelCopyTemplate">
      <el-form>
        <el-form-item label="请选择要复制的模板" label-width="180px">
          <el-select filterable v-model="copyTemplateName" placeholder="请选择模板">
            <el-option
              v-for="(item,i) in $store.state.configuration_template.selectTemplateData"
              :key="i"
              :label="item.templateName"
              :value="item.templateName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入新的模板名称" label-width="180px">
          <el-input v-model="copyedTemplateName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCopyTemplate">取 消</el-button>
        <el-button type="primary" @click="determineCopyTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      empty-text="暂无数据"
      border
      fit
      highlight-current-row>
      <el-table-column
        v-for="(item, i) in (Object.keys(tableData[0]?tableData[0]:{}))"
        :key="i"
        :sortable="i==0"
        :prop="item"
        :label="tableHead[i]"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="startChangeDialog(scope.$index, scope.row)">
            <i class="el-icon-edit-outline"/>&nbsp;编辑
          </el-button>
          <el-button type="danger" plain @click="deleteTemplateData(scope.$index, scope.row)">
            <i class="el-icon-delete"/>&nbsp;删除模板参数
          </el-button>
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
      configType: '0',        //配置参数类型
      tableData: [],          //表格数据体
      templateIndex: 0,      //模板选择表单下标
      selectTemplateData: [], //模板选择数据体系
      newTemplateName: '',    //新的模板名称
      listLoading: true,      //loading显示/隐藏变量
      addDataDialog: false,   //添加模板对话框显示/隐藏变量
      addDataParams: true,    //添加模板参数对话框显示/隐藏变量
      copyDataDialog: false,  //复制模板对话框显示/隐藏变量
      changeDataDialog: false,//修改对话框显示/隐藏变量
      formLabelWidth: '120px',//表单长度
      copyTemplateName: '',   //复制模板名
      copyedTemplateName: '', //复制之后的模板重命名
      changeInfo: {           //修改参数数据体
        configId: '',
        templateName: '',
        configName: "",
        configKey: "",
        configType: '',
      },
      addConfigurationTemplate: { //添加参数数据体
        templateName: '',     //模板名称
        configName: '',       //配置参数名称
        configKey: '',        //配置参数key值
      },
      tableHead: ['模板ID', '模板名称', '配置参数名称', '配置参数key值', '配置参数类型', '创建时间',], //自定义表头参数
      
    }
  },
  mounted() {
    // 初始化获取应用列表
    this.$store.dispatch('getConfigurationTemplate').then((data) => {
      var params = { templateName: this.selectTemplateData[0] ? this.selectTemplateData[0].templateName : '' }
      this.$store.dispatch('getTemplateDetails', params).then((data, params) => {
        this.listLoading = false
      })
    })
  },
  computed: {
    // 加载应用列表
    _state() {
      this.selectTemplateData = this.$store.state.configuration_template.selectTemplateData
      this.tableData = this.$store.state.configuration_template.tableData
      return this.$store.state
    }
  },
  watch: {
    templateIndex(newValue, oldValue) {
      var params = { templateName: this._state.configuration_template.selectTemplateData[newValue].templateName }
      this.$store.dispatch('getTemplateDetails', params).then((data, params) => {
        this.listLoading = false
      })
    }
  },
  methods: {
    // 取消复制模板
    cancelCopyTemplate() {
      this.copyTemplateName = '';
      this.copyedTemplateName = '';
      this.copyDataDialog = false;
    },
    // 确定复制模板
    determineCopyTemplate() {
      if (this.copyTemplateName === '' || !this.copyedTemplateName === '') {
        return Vue.prototype.$message({ message: '请将复制模板信息填写完整', type: 'warning', duration: 1500 })
      }
      var params = {
        templateName: this.copyTemplateName,
        newTemplateName: this.copyedTemplateName,
      }
      this.$store.dispatch('copyTemplate', params).then((data) => {
        this.copyTemplateName = '';
        this.copyedTemplateName = '';
        this.copyDataDialog = false;
        this.$store.dispatch('getConfigurationTemplate').then((data) => {
          return Vue.prototype.$message({ message: '复制成功', type: 'success', duration: 1500 })
        })
      })

    },
    // 取消添加模板
    cancelAddTemplate() {
      Object.keys(this.addConfigurationTemplate).forEach((key, index) => { this.addConfigurationTemplate[key] = '' })
      this.addDataDialog = false;
    },
    // 确定添加模板
    determineAddTemplate() {
      // addDataParams:true ==> 添加模板  false ==> 添加模板参数
      if (this.addDataParams) {
        if (!this.addConfigurationTemplate.templateName) {
          return Vue.prototype.$message({ message: '请输入模板名称', type: 'warning', duration: 1500 })
        }
      } else {
        if (this.addConfigurationTemplate.configName === '' || this.addConfigurationTemplate.configKey === '') {
          return Vue.prototype.$message({ message: '请输入参数信息', type: 'warning', duration: 1500 })
        }
        this.addConfigurationTemplate.templateName = this.selectTemplateData[this.templateIndex].templateName
      }
      // 判断参数类型
      if (this.configType === '1') {
        this.addConfigurationTemplate.configType = 'param'
      } else {
        this.addConfigurationTemplate.configType = 'string'
      }
      var params = this.addConfigurationTemplate;
      this.$store.dispatch('addConfigurationTemplate', params).then((data) => {
        this.$store.dispatch('getConfigurationTemplate').then((data) => {
          this.addDataDialog = false
          delete this.addConfigurationTemplate.configType
          for (let index = 0; index < this.selectTemplateData.length; index++) {
            if (this.selectTemplateData[index].templateName === this.tableData[0].templateName) {
              this.templateIndex = index;
            }
          }
          return Vue.prototype.$message({ message: '添加成功', type: 'success', duration: 1500 })
        })
      })
    },
    // 触发修改参数弹框
    startChangeDialog(index, row) {
      this.changeInfo.configName = this.tableData[index].configName;
      this.changeInfo.templateName = this.tableData[index].templateName;
      this.changeInfo.configId = this.tableData[index].configId;
      this.changeInfo.configKey = this.tableData[index].configKey;
      this.changeInfo.configType = this.tableData[index].configType == "string" ? '0' : '1';
      this.changeDataDialog = true;
    },
    // 确定修改模板配置
    determineChangeData() {
      this.changeInfo.configType = this.changeInfo.configType == '0' ? "string" : "param";
      this.$store.dispatch('changeTemplateParams', this.changeInfo).then((data) => {
        Vue.prototype.$message({ message: '修改成功', type: 'success', duration: 1500 })
        this.changeDataDialog = false;
        Object.keys(this.changeInfo).forEach((item) => {
          this.changeInfo.item = null
        })
      })
    },
    // 修改模板名
    changeTemplateName() {
      if (!this.newTemplateName) {
        return Vue.prototype.$message({ message: '请输入新的模板名称', type: 'warning', duration: 1500 })
      }
      var params = {
        newTemplateName: this.newTemplateName,
        oldTemplateName: this.selectTemplateData[this.templateIndex].templateName,
      }
      this.$store.dispatch('changeTemplateName', params).then((data) => {
        this.newTemplateName = '';
        this.$store.dispatch('getConfigurationTemplate')      });
    },
    // 删除模板配置数据
    deleteTemplateData(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          templateName: this.tableData[index].templateName,
          configId: this.tableData[index].configId
        }
        this.$store.dispatch('delConfigurationTemplateParams', params).then((data) => {
          this.$store.dispatch('getConfigurationTemplate').then((data) => {
            return Vue.prototype.$message({ message: '删除成功', type: 'success', duration: 1500 })
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 删除模板
    deleteTemplate() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          templateName: this.selectTemplateData[this.templateIndex].templateName,
        }
        this.$store.dispatch('delConfigurationTemplate', params).then((data) => {
          var params = { templateName: this.selectTemplateData[0] ? this.selectTemplateData[0].templateName : '' }
          this.$store.dispatch('getTemplateDetails', params).then((data, params) => {
            this.listLoading = false;
            this.templateIndex = 0;
          })
          return Vue.prototype.$message({ message: '删除成功', type: 'success', duration: 1500 })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    // 设置表格列宽
    getWidth(i) {
      var arr = [100, , 150, 150, 150, 200, 150]
      return arr[i]
    },
  }
}
</script>
<style lang="scss" scoped>
</style>

