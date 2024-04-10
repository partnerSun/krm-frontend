namespaceForm<script  setup>
import {getNamespaceListHandler,delNamespaceHandler} from '../../api/namespace.js';

import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref,computed  } from 'vue'
import Add from './Add.vue';

const dialogFormVisible = ref(false)

const loading = ref(true)

const data = reactive({
  items: [],
  namespaceForm:{
    name: '',
    uid: '',
    status:'',
  },
})
const defaultMethod=ref('Create')

const getNamespaceList = () =>{
  loading.value=true
  getNamespaceListHandler()
    .then((response) => {
        console.log("命名空间列表",response.data.Data.items)
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
  getNamespaceList()
}
const {items,namespaceForm} = toRefs(data)

// 使用生命周期，在打开页面时自动加载数据
onBeforeMount(() => {
    // getUser()
    getNamespaceList()
})

//删除集群+弹窗提示
const delNamespace = (row) => {
  ElMessageBox.confirm(
    '确认删除集群 '+row.name+' 吗',
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
    delNamespaceHandler(row.name)
      .then((response) => {
        // console.log("获取成功，response:",response)
        ElMessage({
          message: response.data.Message,
          type: response.data.Type,
        })
        getNamespaceList()
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
const addNamespace = () =>{
  data.namespaceForm={}
  dialogFormVisible.value=true
  defaultMethod.value='Create'
}

//编辑、更新用户，使用dialog组件
const editNamespace = (row) =>{
  dialogFormVisible.value=true
  defaultMethod.value='Edit'
  data.namespaceForm=row
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
        <span>命名空间列表</span>
        <el-button color="#626aef" @click="addNamespace()">创建命名空间</el-button>
      </div>
    </template>

    <el-table 
      v-loading="loading" 
      :data="items" 
      border 
      style="width: 100%" 
      height="550"
      :default-sort="{ prop: 'id', order: 'inscending' }"
      >
      <!-- <el-table v-for="(userinfo) in userList" :key="userinfo.id" :data="userinfo" style="width: 100%">  -->
      <el-table-column prop="name" label="名称" sortable  width="220" align="center"/>
        
      
      <el-table-column prop="uid" label="UID" width="460"  align="center"/>
      <el-table-column prop="status" label="状态" width="180" align="center">
        <template #default="scope">
          <el-text v-if='scope.row.status == "Active"' type="success">{{scope.row.status}}</el-text>
          <el-text v-else  type="danger">{{scope.row.status}}</el-text>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Operations" align="center">
        <!-- scope绑定当前操作的行 -->
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editNamespace(scope.row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="delNamespace(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加时的弹窗,关闭窗口时触发重新获取列表的事件 -->
  <el-dialog 
    @closed="closeRefresh()" 
    v-model="dialogFormVisible" 
    destroy-on-close
    :title="defaultMethod=='Create'?'创建命名空间':'更新命名空间'" 
    width="20%"
    >
    
    <!-- 触发事件 -->
    <Add :namespaceForm="namespaceForm" :method="defaultMethod" @callback="callback()"></Add> 
  </el-dialog>

  
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>