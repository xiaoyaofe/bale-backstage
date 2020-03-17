<template>
  <div>
    <!-- 日期 -->
    <!-- <el-date-picker
        v-model="filterTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker> -->
    <!-- 筛选打包任务弹窗 -->
    <el-dialog
      title="筛选打包任务"
      :visible.sync="packing_list.filterPackagingDialog"
      @before-close="cacelFilterPackaging"
      width="450px">
      <el-form>
        <el-form-item label="应用列表" label-width="120px">
          <el-select v-model="filterPackagingInfo.appId" filterable placeholder="请选择应用">
            <el-option
              v-for="(item,index) in game_list.tableData.data"
              :key="index"
              :label="item.appNameZn"
              :value="item.appId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="母包列表" label-width="120px">
          <el-select v-model="filterPackagingInfo.basePackageId" filterable placeholder="请选择母包">
            <el-option
              v-for="(item,index) in mother_list.tableData"
              :key="index"
              :label="item.basePackageName"
              :value="item.basePackageId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="sdk渠道包列表" label-width="120px">
          <el-select
            v-model="filterPackagingInfo.channelPackageId"
            filterable
            placeholder="请选择sdk渠道包"
          >
            <el-option
              v-for="(item,index) in channel_list.tableData.data"
              :key="index"
              :label="item.channelPackageName"
              :value="item.channelPackageId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cacelFilterPackaging">取 消</el-button>
        <el-button type="primary" @click="determineFilterPackaging">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加打包任务弹窗 -->
    <el-dialog
      title="添加打包任务"
      :visible.sync="packing_list.addPackageDialog"
      @close="cacelAddPackage"
      width="450px">
      <el-form>
        <el-form-item label="打包任务名称" label-width="120px">
          <el-input v-model="addPackageInfo.taskName" placeholder="请输入打包任务名称"></el-input>
        </el-form-item>
        <el-form-item label="应用列表" label-width="120px">
          <el-select v-model="addPackageInfo.appId" filterable placeholder="请选择应用">
            <el-option
              v-for="(item,index) in game_list.tableData.data"
              :key="index"
              :label="item.appNameZn"
              :value="item.appId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="母包列表" label-width="120px">
          <el-select v-model="addPackageInfo.basePackageId" filterable placeholder="请选择母包">
            <el-option
              v-for="(item,index) in mother_list.tableData"
              :key="index"
              :label="item.basePackageName"
              :value="item.basePackageId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="sdk渠道包列表" label-width="120px">
          <el-select v-model="addPackageInfo.channelPackageId" filterable placeholder="请选择sdk渠道包">
            <el-option
              v-for="(item,index) in channel_list.tableData.data"
              :key="index"
              :label="item.channelPackageName"
              :value="item.channelPackageId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cacelAddPackage">取 消</el-button>
        <el-button type="primary" @click="determineAddPackage">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      filterPackagingInfo: {//筛选打包任务参数
        beginDate: '',
        endDate: '',
        appId: '',
        basePackageId: '',
        channelPackageId: '',
      },
      addPackageInfo: {//添加打包任务参数
        appId: '',
        basePackageId: '',
        channelPackageId: '',
        taskName: '',
      },
      filterTime:[],//筛选打包任务时间
    }
  },
  created() {
    this.dataInit()
    // 查询应用列表
    this.$store.dispatch('getGameList').then((data) => {
      // 查询母包列表
      this.$store.dispatch('getMasterPackageList').then((data) => {
        // 查询渠道包列表
        this.$store.dispatch('getChannelPackage').then((data) => {
          // 查询打包任务列表
          this.queryPackageList()
        })
      })
    })
  },
  watch: {
    filterTime(newValue, oldValue) {
      this.$store.commit('SET_FILTER_TIME', newValue.map(item => moment(item).format('YYYY-MM-DD')));
      this.queryPackageList()
    },
    'filterPackagingInfo.appId': {
      handler: function (newValue, oldValue) {
        this.$store.dispatch('getMasterPackageList', newValue).then((data) => {
          this.filterPackagingInfo.basePackageId = this.mother_list.tableData[0] ? this.mother_list.tableData[0].basePackageId : '';
        })
      }
    },
    'addPackageInfo.appId': {
      handler: function (newValue, oldValue) {
        this.$store.dispatch('getMasterPackageList', newValue).then((data) => {
          this.addPackageInfo.basePackageId = this.mother_list.tableData[0] ? this.mother_list.tableData[0].basePackageId : '';
        })
      }
    }
  },
  computed: {
    game_list() {
      return this.$store.state.game_list
    },
    channel_list() {
      return this.$store.state.channel_package_list
    },
    packing_list() {
      return this.$store.state.packing_list
    },
    mother_list() {
      return this.$store.state.mother_package_list
    }
  },
  methods: {
    // 取消添加打包任务
    cacelAddPackage() {     
      this.packing_list.addPackageDialog = false;
      Object.keys(this.addPackageInfo).forEach((item) => this.addPackageInfo[item] = '')
    },
    // 确定添加打包任务
    determineAddPackage() {      
      if (Object.values(this.addPackageInfo).every(v => !!v)) {
      // if (this.addPackageInfo.taskName && this.addPackageInfo.appId) {
        this.$store.dispatch('submitPackageTask', this.addPackageInfo).then((data) => {
          Object.keys(this.addPackageInfo).forEach((item) => this.addPackageInfo[item] = '')
          this.packing_list.addPackageDialog = false;
          this.queryPackageList()
          this.$message({ type: 'success', message: '添加打包任务成功' });
        })
      } else {
        this.$message({ type: 'warning', message: `打包任务参数不能为空` });
      }
    },
    // 取消筛选打包任务
    cacelFilterPackaging() {      
      this.packing_list.filterPackagingDialog = false;
      Object.keys(this.filterPackagingInfo).forEach((item) => this.filterPackagingInfo[item] = '')
    },
    // 确定筛选打包任务
    determineFilterPackaging() {      
      this.queryPackageList()
    },
    // 查询方法
    queryPackageList() {
      var params = {
        // endDate: this.packing_list.filterTime[1],
        // beginDate: this.packing_list.filterTime[0],
        appId: +this.filterPackagingInfo.appId,
        basePackageId: +this.filterPackagingInfo.basePackageId,
        channelPackageId: +this.filterPackagingInfo.channelPackageId,
      }
      this.$store.dispatch('getPackageTaskList', params).then((data) => {
        this.$store.commit("SET_FILTER_PACKING_INFO",params)
        Object.keys(this.filterPackagingInfo).forEach((item) => this.filterPackagingInfo[item] = '')
        this.packing_list.filterPackagingDialog = false;
      })
    },
    // 
    dataInit(){
      this.filterTime = this.packing_list.filterTime
    }


  },
}
</script>
<style lang="scss" scoped>
</style>
