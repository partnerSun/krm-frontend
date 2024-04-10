<script  setup>
import {getClusterListHandler,delClusterHandler} from '../../api/cluster.js';

import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref } from 'vue'
import Add from './Add.vue';

const dialogFormVisible = ref(false)

const loading = ref(true)

const data = reactive({
  items: [],
  clusterForm:{
    id: '',
    displayname: '',
    area: '',
    city: '',
    kubeconfig: '',
  },
})
const defaultMethod=ref('Create')

 const getClusterList = () =>{
  loading.value=true
  getClusterListHandler()
    .then((response) => {
        console.log("集群列表",response.data.Data)
        if (response.data.Data.items === null ){
          loading.value = false;
          return;
        }
        else{
          data.items = response.data.Data.items
          //当拿到数据后，停止刷新的动作
          loading.value=false
        }        
    })
     //.catch错误在守卫中处理
  
}

const closeRefresh = () =>{
  // getUser()
  getClusterList()
}
const {items,clusterForm} = toRefs(data)

// 使用生命周期，在打开页面时自动加载数据
onBeforeMount(() => {
    // getUser()
    getClusterList()
})

//删除集群+弹窗提示
const delCluster = (row) => {
  ElMessageBox.confirm(
    '确认删除集群 '+row.displayname+' 吗',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
  .then(() => {
    // console.log("当前删除行：",row.id)
    // 刷新开关
    loading.value=true
    // 调用删除
    delClusterHandler(row.id)
      .then((response) => {
        // console.log("获取成功，response:",response)
        ElMessage({
          message: response.data.Message,
          type: 'success',
        })
        getClusterList()
        //当拿到数据后，停止刷新的动作
        loading.value=false

      })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
    })
  })

}
//添加用户，使用dialog组件
const addCluster = () =>{
  data.clusterForm={}
  dialogFormVisible.value=true
  defaultMethod.value='Create'
}

//编辑、更新用户，使用dialog组件
const editCluster = (row) =>{
  dialogFormVisible.value=true
  defaultMethod.value='Edit'
  data.clusterForm=row
}

const callback = () =>{
  dialogFormVisible.value=false
  // getUser()
}
</script>

<template>
  <el-card >

    <template #header>
      <div class="card-header">
        <span>集群列表</span>
        <el-button   color="#626aef"  @click="addCluster()">添加集群</el-button>
      </div>
    </template>

    <el-table 
      v-loading="loading" 
      :data="items" 
      border 
      style="width: 100%" 
      height="450"
      :default-sort="{ prop: 'id', order: 'inscending' }"
      >
      <!-- <el-table v-for="(userinfo) in userList" :key="userinfo.id" :data="userinfo" style="width: 100%">  -->
      <el-table-column prop="id" label="集群ID" sortable  width="180" align="center" />
      <el-table-column prop="displayname" label="集群名称" width="180" align="center"/>
      <el-table-column prop="city" label="所在城市" width="180" align="center"/>
      <el-table-column prop="area" label="所在区" align="center" />
      <el-table-column prop="version" label="集群版本" align="center"/>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
            <el-text v-if='scope.row.status == "Active"' type="success">{{scope.row.status}}</el-text>
            <el-text v-else  type="danger">{{scope.row.status}}</el-text>
          </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" align="center">
        <!-- scope绑定当前操作的行 -->
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editCluster(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="delCluster(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加时的弹窗,关闭窗口时触发重新获取列表的事件 -->
  <el-dialog 
    @closed="closeRefresh()" 
    v-model="dialogFormVisible" 
    destroy-on-close
    :title="defaultMethod=='Create'?'添加集群':'更新集群'" 
    width="40%"
  >
    <!-- 触发事件 -->
    <!-- <Add @callback="getUser"></Add> -->
    <Add :clusterForm="clusterForm" :method="defaultMethod" @callback="callback()"></Add> 
  </el-dialog>

  
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>