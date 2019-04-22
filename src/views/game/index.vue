<template>
  <div class="app-container">
    <div style="marginBottom:20px">
      <el-button  type="info" plain  @click="dialogFormVisible = true">
        <i class="el-icon-plus" />添加
      </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加应用" :visible.sync="dialogFormVisible" @close = "cancel">
      <el-form :model="form">
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="appValue" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="横竖屏" :label-width="formLabelWidth">
            <el-radio v-model="form.screen" label="0">横屏</el-radio>
            <el-radio v-model="form.screen" label="1">竖屏</el-radio>
        </el-form-item>
        <el-form-item label="应用描述" :label-width="formLabelWidth">
          <el-input v-model="form.txt" autocomplete="off"></el-input>
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
        <el-form-item label="横竖屏" :label-width="formLabelWidth">
            <el-radio v-model="changeInfo.screen" label="0">横屏</el-radio>
            <el-radio v-model="changeInfo.screen" label="1">竖屏</el-radio>
        </el-form-item>
        <el-form-item label="应用描述" :label-width="formLabelWidth">
          <el-input v-model="changeInfo.txt" autocomplete="off"></el-input>
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
      <el-table-column label="主键ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="应用appKey" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.appKey }}
        </template>
      </el-table-column>
      <el-table-column label="应用appSecret" width="310" align="center">
        <template slot-scope="scope">
          {{ scope.row.appSecret }}
        </template>
      </el-table-column>
      <el-table-column label="横竖屏" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.screen == 0 ? "横屏":"竖屏" }}
        </template>
      </el-table-column>
      <el-table-column label="应用描述" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.txt }}
        </template>
      </el-table-column>
      <el-table-column label="应用时间" width="160" align="center">
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
          // title: null,
          screen:'0',
          txt: null,
      },
      changeInfo:{
          screen:'0',
          txt: null,
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
      this.form.txt = null;
    },
    // 添加数据
    addData(){
        
        this.list.push({title:this.appArr[this.appValue].label,screen:this.form.screen,txt:this.form.txt})
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.dialogFormVisible = false
        this.form.txt = '';
    },
    // 编辑数据
    changeData(){
        this.list[this.changeInfo.index].screen = this.changeInfo.screen;
        this.list[this.changeInfo.index].txt = this.changeInfo.txt;
        Vue.prototype.$message({message: '添加成功',type: 'success', duration: 1500})
        this.changeDataFormVisible = false
    },
    // 编辑数据下标
    startChange(index,row){
      this.changeInfo.txt = this.list[index].txt;
      this.changeInfo.screen = ''+(+this.list[index].screen);
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

