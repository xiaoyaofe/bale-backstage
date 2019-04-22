<template>
  <div class="app-container">
    <div v-show="!listLoading" style="marginBottom:20px;display: flex;position: relative;z-index: 0;">
        <section>
            <span>选择游戏</span>
             <el-select v-model="appValue" placeholder="请选择应用">
                <el-option v-for="(item,index) in appArr" :key="index" 
                :label="item.label"  :value="item.value"></el-option>
            </el-select>
        </section>
        <el-button  type="info" plain  @click="dialogFormVisible = true" style="marginLeft:20px">
            <i class="el-icon-plus" />新建打包任务
        </el-button>
        <el-button  type="info" plain  @click="download(true)">
            <i class="el-icon-download" />内网下载
        </el-button>
        <el-button  type="info" plain  @click="download(false)">
            <i class="el-icon-download" />外网下载
        </el-button>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="新建打包任务" :visible.sync="dialogFormVisible" width="400px" @close = "cancel">
      <el-form :model="form">
        <el-form-item label="应用名称" :label-width="formLabelWidth">
          <el-select v-model="form.game_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" :label-width="formLabelWidth">
          <el-select v-model="form.channel_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SDK名称" :label-width="formLabelWidth">
          <el-select v-model="form.SDK_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="母包包名" :label-width="formLabelWidth">
          <el-select v-model="form.mother_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证书名称" :label-width="formLabelWidth">
          <el-select v-model="form.certificate_name" placeholder="请选择应用">
            <el-option v-for="(item,index) in appArr" :key="index" 
            :label="item.label"  :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addPacked">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑数据弹出框 -->
    <!-- <el-dialog title="编辑数据" :visible.sync="changeDataFormVisible">
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
    </el-dialog> -->
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
      <el-table-column label="游戏包ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="80">
        <template slot-scope="scope">
          {{ scope.row.appId }}
        </template>
      </el-table-column>
      <el-table-column label="母包包名" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.mother_name }}
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.channel_name }}
        </template>
      </el-table-column>
      <el-table-column label="渠道SDK名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.channel_sdk_name }}
        </template>
      </el-table-column>
      <el-table-column label="渠道包参数包名" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.channel_param_name }}
        </template>
      </el-table-column>
      <el-table-column label="证书别名(aliaskey)" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.certificate_name }}
        </template>
      </el-table-column>
      <el-table-column label="图标配置名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.icon_name }}
        </template>
      </el-table-column>
      <el-table-column label="打包任务ID" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.baleId }}
        </template>
      </el-table-column>
      <el-table-column label="打包时间" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.bale_time }}
        </template>
      </el-table-column>
      <el-table-column label="打包状态" width="120" align="center">
        <template slot-scope="scope">
            <span v-show="scope.row.status == 'success'" style="color:green">{{ scope.row.status}}</span>
            <span v-show="scope.row.status == 'fail'" style="color:red">{{ scope.row.status}}</span>
            <el-button v-show="scope.row.status == 'processing'" @click="statrtPacked(scope.$index, scope.row)" type="warning" plain>apk打包</el-button>
        </template>
      </el-table-column>
     <!-- <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="startChange(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" plain @click="deleteData(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
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
          game_name: null,
          channel_name:null,
          SDK_name:null,
          mother_name:null,
          certificate_name:null,
          status:'processing'
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
    // 添加打包任务
    addPacked(){
        if (!this.form.game_name || !this.form.channel_name || !this.form.SDK_name || !this.form.certificate_name || !this.form.mother_name) {
            Vue.prototype.$message({message: '添加失败',type: 'error', duration: 1500})
            return
        }
        this.list.push({game_name:this.appArr[this.form.game_name].label,
                        channel_name:this.appArr[this.form.channel_name].label,
                        SDK_name:this.appArr[this.form.SDK_name].label,
                        certificate_name:this.appArr[this.form.certificate_name].label,
                        mother_name:this.appArr[this.form.mother_name].label,
                        status:"processing"})
        this.dialogFormVisible = false;
    },
    //下载包
    download(flag){
        if (flag) {
            Vue.prototype.$message({message: '开始内网下载',type: 'success', duration: 1500})
        }else{
            Vue.prototype.$message({message: '开始外网下载',type: 'success', duration: 1500})
        }
    },
    // apk打包
    statrtPacked(index,row){
        console.log(index,row);
        this.listLoading = true
        setTimeout(() => {
            this.listLoading = false;
            this.list[index].status = "success";
            Vue.prototype.$message({message: '打包成功',type: 'success', duration: 1500})
        }, 5000);
    },
    // 查询数据
    searchData(){
        this.fetchData()
        Vue.prototype.$message({message: '查询成功',type: 'success', duration: 1500})
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

