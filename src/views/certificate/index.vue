<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button  type="info" plain  @click="dialogFormVisible = true">
        <i class="el-icon-plus" />添加
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加证书" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form :model="form">
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="appValue" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-input v-model="form.certificate_name" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="form.alias" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="form.alias_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="form.certificate_password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="横竖屏" :label-width="formLabelWidth">
            <el-radio v-model="form.screen" label="0">横屏</el-radio>
            <el-radio v-model="form.screen" label="1">竖屏</el-radio>
        </el-form-item>
        <el-form-item label="应用描述" :label-width="formLabelWidth">
          <el-input v-model="form.txt" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
      <el-form :model="form">
         <el-form-item label="别名" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.alias" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="别名密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.alias_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="证书密码" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.certificate_password" autocomplete="off"></el-input>
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
      <el-table-column label="签名ID" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.appId }}
        </template>
      </el-table-column>
      <el-table-column label="证书名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.certificate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名(alias)" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.alias }}
        </template>
      </el-table-column>
      <el-table-column label="别名密码(aliaspwd)" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.alias_password }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="横竖屏" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.screen == 0 ? "横屏":"竖屏" }}
        </template>
      </el-table-column> -->
      <el-table-column label="证书密码" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.certificate_password }}
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
import { getList } from '@/api/certificate'
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
          alias:null,
          alias_password:null,
          certificate_password:null,
      },
      changeInfo:{
          alias:null,
          alias_password:null,
          certificate_password:null,
          index:null,
      },
      formLabelWidth: '120px'
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
      this.dialogFormVisible = false;
      Object.keys(this.form).forEach((key, index) => {this.form[key] = null})
    },
    // 添加数据
    addData(){
        this.list.push(this.form)
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.dialogFormVisible = false;
    },
    // 编辑数据
    changeData(){
        this.list[this.changeInfo.index].alias = this.changeInfo.alias;
        this.list[this.changeInfo.index].alias_password = this.changeInfo.alias_password;
        this.list[this.changeInfo.index].certificate_password = this.changeInfo.certificate_password;
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.changeDataFormVisible = false
    },
    // 编辑数据下标
    startChange(index,row){
      this.changeInfo.alias = this.list[index].alias;
      this.changeInfo.alias_password = this.list[index].alias_password;
      this.changeInfo.certificate_password = this.list[index].certificate_password;
      this.changeInfo.index  = index;
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
    }
  }
}
</script>
<style lang="scss" scoped>


</style>

