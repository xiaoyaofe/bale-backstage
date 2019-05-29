<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button  type="info" plain  @click="dialogFormVisible = true">
        <i class="el-icon-plus" />添加
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加游戏母包" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form :model="form">
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="appValue" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本名称" :label-width="formLabelWidth">
          <el-input v-model="form.version_name" ></el-input>
        </el-form-item>
        <el-form-item label="上传apk" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.version_note" ></el-input> -->
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed">
                <!-- :file-list="fileList" -->
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="form.version_number" ></el-input>
        </el-form-item>
        <el-form-item label="母包包名" :label-width="formLabelWidth">
          <el-input v-model="form.mother_name" ></el-input>
        </el-form-item>
        <el-form-item label="版本备注" :label-width="formLabelWidth">
          <el-input v-model="form.version_note" ></el-input>
        </el-form-item>
        <el-form-item label="母包类型" :label-width="formLabelWidth">
            <el-radio v-model="form.mother_type" label="0">android</el-radio>
            <el-radio v-model="form.mother_type" label="1">ios</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form :model="form">
        <el-form-item label="版本名称" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.version_name" ></el-input>
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.version_number" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="母包包名" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.mother_name" ></el-input>
        </el-form-item> -->
        <el-form-item label="版本备注" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.version_note" ></el-input>
        </el-form-item>
        <el-form-item label="母包类型" :label-width="formLabelWidth">
            <el-radio v-model="changeInfo.mother_type" label="0">android</el-radio>
            <el-radio v-model="changeInfo.mother_type" label="1">ios</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDataFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeData">确 定</el-button>
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
      <el-table-column label="主键ID" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.appId }}
        </template>
      </el-table-column>
      <el-table-column label="版本名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.version_number }}
        </template>
      </el-table-column>
      <el-table-column label="版本备注" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.version_note }}
        </template>
      </el-table-column>
      <el-table-column label="母包名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.mother_name }}
        </template>
      </el-table-column>
      <el-table-column label="母包类型" width="200" align="center">
        <template slot-scope="scope">
          {{ +scope.row.mother_type ? "ios":"android" }}
        </template>
      </el-table-column>
      <el-table-column label="apk更新时间" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.display_time }}
        </template>
      </el-table-column>
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
import { getList } from '@/api/mother'
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
      dialogFormVisible: false,
      changeDataFormVisible: false,
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
      form: {
          version_name:null,
          version_number:null,
        //   mother_name:null,
          version_note:null,
          mother_type:"0",
      },
      changeInfo:{
          version_name:null,
          version_number:null,
        //   mother_name:null,
          version_note:null,
          mother_type:'0',
          index:null,
      },
      formLabelWidth: '120px',
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
    // 取消
    cancel(){
        this.dialogFormVisible = false
        // 初始化添加表单
        Object.keys(this.form).forEach((key, index) => {
            if (key == "mother_type") {
                this.form[key]  = "0"
            }else{
                this.form[key] = null
            }
        })
    },
    // 添加数据
    addData(){
        if (!this.form.version_name || !this.form.version_number ) {
            Vue.prototype.$message({message: '添加失败',type: 'error', duration: 1500})
            return
        }
        this.list.push({
            version_name:this.form.version_name,
            mother_type:this.form.mother_type,
            // mother_name:this.form.mother_name,
            version_number:this.form.version_number,
            version_note:this.form.version_note})
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.dialogFormVisible = false
        // 初始化添加表单
        Object.keys(this.form).forEach((key, index) => {
            if (key == "mother_type") {
                this.form[key]  = "0"
            }else{
                this.form[key] = null
            }
        })
    },
    // 编辑数据
    changeData(){
        this.list[this.changeInfo.index].version_name = this.changeInfo.version_name;
        this.list[this.changeInfo.index].version_number = this.changeInfo.version_number;
        // this.list[this.changeInfo.index].mother_name = this.changeInfo.mother_name;
        this.list[this.changeInfo.index].version_note = this.changeInfo.version_note;
        this.list[this.changeInfo.index].mother_type = this.changeInfo.mother_type;
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.changeDataFormVisible = false
    },
    // 编辑数据下标
    startChange(index,row){
      this.changeInfo.version_name = this.list[index].version_name;
      this.changeInfo.version_number = this.list[index].version_number;
    //   this.changeInfo.mother_name = this.list[index].mother_name;
      this.changeInfo.version_note = this.list[index].version_note;
      this.changeInfo.mother_type = ''+(+this.list[index].mother_type);
      this.changeInfo.index = index;
      this.changeDataFormVisible = true;
    },
    // 删除数据
    deleteData(index,row){
      this.list.splice(index,1)
      Vue.prototype.$message({message: '删除成功',type: 'success', duration: 1500})
    },
    // 获取数据
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    // 上传
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


</style>

