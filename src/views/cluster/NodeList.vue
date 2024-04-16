<script  setup>
import { useRoute } from 'vue-router';
import {getClusterListHandler} from '../../api/cluster.js';
import {getNodeListHandler} from '../../api/node.js';
import NodeInfo from './NodeInfo.vue';
// import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref,computed } from 'vue';
import NodeDetail from './NodeDetail.vue';

const showConfigDialog = ref(false)
const showNodeInfoDialog = ref(false)
const route=useRoute()
const loading = ref(true)
const search = ref('')
const value1 = ref(false)
// const value = ref('')
// const defaultMethod=ref('Create')

const data = reactive({
  items:[],
  nodeName: "",
  detailNodeName: "",
  clusterList: [],
  clusterId: "",
  nodeItems:{},
  nodeDetailItems:{},
})

const {nodeName,nodeItems,clusterList,clusterId,nodeDetailItems,detailNodeName} = toRefs(data)

const getNodeList = (id) =>{
  loading.value=true
   getNodeListHandler(id)
    .then((response) => {
        // console.log("节点列表",response.data.Data.items)
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
        // console.log("集群列表",data.clusterList)
      }
    )
}

const closeRefresh = () =>{
  //
  getNodeList(data.clusterId)
}



// 使用生命周期，在打开页面时自动加载数据
onBeforeMount( async() => {
    //加载集群列表
    await getClusterList()
    // 定义变量 接受一个默认集群id  防止传过来是个空id
    const defaultCluster = data.clusterList[0].id
    // console.log("默认集群是:",defaultCluster)
    //获取查询的集群id
    const curCluster = route.query.clusterId
    data.clusterId=curCluster?route.query.id:defaultCluster
    //加载节点列表
    getNodeList(data.clusterId)
})

// 用于search
const filterTableData = computed(() =>
  data.items.filter(
    (item) =>
      !search.value ||
      item.metadata.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.status.addresses[0].address.toLowerCase().includes(search.value.toLowerCase())
  )
)

const showConfigInfo = (row) =>{
  loading.value=true
  showConfigDialog.value=true
  // defaultMethod.value='Edit'
  data.nodeItems=row
  data.nodeName = row.metadata.name
  // console.log("节点内容:",row)
  loading.value=false
}

const showNodeInfo = (row) =>{
  loading.value=true
  showNodeInfoDialog.value=true
  // defaultMethod.value='Edit'
  data.nodeDetailItems = row
  data.detailNodeName = row.metadata.name
  console.log("节点内容:",data.nodeDetailItems)
  loading.value=false
}

</script>

<template>
  <el-card >

    <template #header>
      <div class="card-header">
          <span>节点列表</span>
          <div class="div-header">
            <span style="margin-left: 16px;"><el-input v-model="search" size="small" placeholder="搜索" style="width: 120px;"/></span>
            <!-- 与clusterId双写绑定，当选择发生变化时 使用change方法触发request请求 -->
            <el-select
              v-model="clusterId"
              placeholder="Select"
              size="small"
              style="width: 120px" 
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
      >

      <el-table-column label="主机名" sortable  width="200" align="center" >
        <template #default="scope">
          <el-button link style="color: #79bbff;"  @click="showNodeInfo(scope.row)">
            {{scope.row.metadata.name}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column  label="节点IP" width="200" align="center"> 
        <template #default="scope">
          <span>{{scope.row.status.addresses[0].address}}</span>
        </template>
      </el-table-column>

      <el-table-column  label="节点状态" width="200" align="center">
        <template #default="scope">
          <el-text v-if="scope.row.status.conditions[4].type === 'Ready' && scope.row.status.conditions[4].status === 'True'" style="color: #529b2e;">{{ scope.row.status.conditions[4].type }}</el-text>
          <el-text v-else style="color: #f89898;">{{ scope.row.status.conditions[4].type }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="角色" width="200" align="center">
        <template #default="scope">
          <span v-if="scope.row.metadata.labels.hasOwnProperty('kubernetes.io/role')">{{scope.row.metadata.labels['kubernetes.io/role']}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>



      <el-table-column label="禁止调度" align="center">
        <el-switch v-model="value1"> </el-switch>
      </el-table-column>

      <el-table-column  label="驱逐" align="center">
        <el-switch v-model="value1"> </el-switch>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <!-- scope绑定当前操作的行 -->
        <template #default="scope">
          <el-button link type="primary" size="small" @click="showConfigInfo(scope.row)">编辑配置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

    <!-- 编辑配置 弹窗 -->
    <el-dialog 
      @closed="closeRefresh()" 
      v-model="showConfigDialog" 
      destroy-on-close
      :title="'正在编辑集群: '+clusterId + '  节点: ' + nodeName" 
      width="39%"
      style="border-radius: 5px;"
    >
    <!-- 触发事件 -->
    <!-- 更新后 触发重新获取节点列表事件-->
    <NodeInfo :nodeItems="nodeItems" :clusterId="clusterId" @callback="getNodeList(clusterId)"></NodeInfo> 
  </el-dialog>

    <!--节点信息弹窗 -->
    <el-dialog 
      @closed="closeRefresh()" 
      v-model="showNodeInfoDialog" 
      destroy-on-close
      width="50%"
      style="border-radius: 8px;"
    >
    <NodeDetail :nodeDetailItems="nodeDetailItems" :clusterId="clusterId" :nodeName="detailNodeName"></NodeDetail> 
  </el-dialog>
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