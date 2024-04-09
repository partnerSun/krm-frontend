<script  setup>
import {getNodeListHandler} from '../../api/cluster.js';

// import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref } from 'vue'


const dialogFormVisible = ref(false)

const loading = ref(true)

const data = reactive({
  items: [],
  nodeForm:{
    name: '',
    age: '',
    roles: '',
    status: '',
    version: '',
  },
})
const defaultMethod=ref('Create')

const getNodeList = () =>{
  loading.value=true
  getNodeListHandler()
    .then((response) => {
        console.log("节点列表",response.data.Data)
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
  getNodeList()
}
const {items,nodeForm} = toRefs(data)

// 使用生命周期，在打开页面时自动加载数据
onBeforeMount(() => {
    // getUser()
    getNodeList()
})


</script>

<template>
  <el-card >

    <template #header>
      <div class="card-header">
        <span>节点列表</span>
        <!-- <el-button text bg @click="addCluster()">添加集群</el-button> -->
      </div>
    </template>

    <el-table 
      v-loading="loading" 
      :data="items" 
      border 
      style="width: 100%" 
      height="450"
      :default-sort="{ prop: 'name', order: 'inscending' }"
      >

      <el-table-column prop="name" label="节点名称" sortable  width="200" />
      <el-table-column prop="status" label="节点状态" width="200" >
      <template #default="scope">
          <el-text v-if='scope.row.status == "Ready"' type="success">{{scope.row.status}}</el-text>
          <el-text v-else  type="danger">{{scope.row.status}}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色" width="200" />
      <el-table-column prop="version" label="集群版本" width="200" />
      <el-table-column prop="age" label="运行时间"  />
    </el-table>
  </el-card>

  
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>