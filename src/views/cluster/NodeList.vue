<script  setup>
import { useRoute } from 'vue-router';
import {getNodeListHandler,getClusterListHandler} from '../../api/cluster.js';

// import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref,computed } from 'vue'


const dialogFormVisible = ref(false)
const route=useRoute()
const loading = ref(true)
const search = ref('')
const value1 = ref(true)
const value = ref('')
const defaultMethod=ref('Create')

const data = reactive({
  items: [],
  clusterList: [],
  clusterId: "",
  nodeForm:{
    name: '',
    ip: '',
    roles: '',
    status: '',
    scheduleStatus: '',
    drain:''
  },
})

const {items,nodeForm,clusterList,clusterId} = toRefs(data)

const getNodeList = (id) =>{
  loading.value=true
  getNodeListHandler(id)
    .then((response) => {
        console.log("节点列表",response.data.Data.items)
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
const  getClusterList = async() => {
  await getClusterListHandler()
    .then(      
      (response) => {
        data.clusterList=response.data.Data.items
        console.log("集群列表",data.clusterList)
      }
    )
}

const closeRefresh = () =>{
  //
  getNodeList()
}



// 使用生命周期，在打开页面时自动加载数据
onBeforeMount( async() => {

    //加载集群列表
    await getClusterList()
    // 定义变量 接受一个默认集群id  防止传过来是个空id
    const defaultCluster = data.clusterList[0].id
    console.log("默认集群是:",defaultCluster)
    //获取查询的集群id
    const curCluster = route.query.clusterId
    data.clusterId=curCluster?route.query.id:defaultCluster
    //加载节点列表
    getNodeList(data.clusterId)
})

const filterTableData = computed(() =>
  data.items.filter(
    (item) =>
      !search.value ||
      item.metadata.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.status.addresses[0].address.toLowerCase().includes(search.value.toLowerCase())
  )
)

const configInfo = (row) =>{
  dialogFormVisible.value=true
  defaultMethod.value='Edit'
  data.nodeForm=row
}

 
</script>

<template>
  <el-card >

    <template #header>
      <div class="card-header">
          <span>节点列表</span>
          <div class="div-header">

            <span style="margin-left: 20px;"><el-input v-model="search" size="large" placeholder="搜索" style="width: 120px;"/></span>
            <!-- 与clusterId双写绑定，当选择发生变化时 使用change方法触发request请求 -->
            <el-select
              v-model="clusterId"
              placeholder="Select"
              size="large"
              style="width: 180px" 
              @change="getNodeList(clusterId)"
            >
              <!-- 获取选项的值 并通过:value传给el-select的v-model -->
              <el-option
                v-for="item in clusterList"
                :key="item.id"
                :label="item.displayname"
                :value="item.id"
                :disabled="item.status != 'Active'"
              />
            </el-select>
          </div>
      </div>
    </template>

    <el-table 
      v-loading="loading" 
      :data="filterTableData" 
      border 
      
      style="width: 100%" 
      height="550"
      :default-sort="{ prop: 'name', order: 'inscending' }"
      >

      <el-table-column prop="name" label="主机名" sortable  width="200" align="center" >
        <template #default="scope">
          <span>{{scope.row.metadata.name}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="节点IP" width="200" align="center"> 
        <template #default="scope">
          <span>{{scope.row.status.addresses[0].address}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="节点状态" width="200" align="center">
        <template #default="scope">
          <el-text v-if="scope.row.status.conditions[4].type === 'Ready' && scope.row.status.conditions[4].status === 'True'" type="success">{{ scope.row.status.conditions[4].type }}</el-text>
          <el-text v-else type="danger">{{ scope.row.status.conditions[4].type }}</el-text>
        </template>
      </el-table-column>

      <el-table-column prop="roles" label="角色" width="200" align="center">
        <template #default="scope">
          <span v-if="scope.row.metadata.labels.hasOwnProperty('kubernetes.io/role')">{{scope.row.metadata.labels['kubernetes.io/role']}}</span>
          <span v-else>空</span>
        </template>
      </el-table-column>



      <el-table-column prop="scheduleStatus" label="禁止调度" align="center">
        <el-switch v-model="value1"> </el-switch>
      </el-table-column>

      <el-table-column prop="drain" label="驱逐" align="center">
        <el-switch v-model="value1"> </el-switch>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <!-- scope绑定当前操作的行 -->
        <template #default="scope">
          <el-button link type="primary" size="small" @click="configInfo(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.div-header {
  display: flex;
  /* justify-content: space-between; */
  flex-direction: row-reverse;
  align-items: center;
  width: 500px;

}
</style>