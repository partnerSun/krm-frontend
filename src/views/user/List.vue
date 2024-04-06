<script  setup>
import {getUserListHandler,delUserHandler} from '../../api/user.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import {reactive,toRefs,onBeforeMount,ref } from 'vue'
import Add from './Add.vue';

const dialogFormVisible = ref(false)

const loading = ref(true)

const data = reactive({
  items: [],
  userForm:{
    username: '',
    qq: '',
    address: '',
  },
})
const defaultMethod=ref('Create')
//获取用户列表
const getUser = () =>{
  loading.value=true
  getUserListHandler()
    .then((response) => {
        // 获取成功提示
        // ElMessage({
        //   message: response.data.message,
        //   type: 'success',
        // })
        data.items = response.data.data.items
        // console.log("用户信息",userList)
        //当拿到数据后，停止刷新的动作
        loading.value=false

    })
     //.catch错误在守卫中处理
  
}

const closeRefresh = () =>{
  getUser()
}
const {items,userForm} = toRefs(data)

// 使用生命周期，在打开页面时自动加载数据
onBeforeMount(() => {
    getUser()
})

//删除用户+弹窗提示
const delUser = (row) => {
  ElMessageBox.confirm(
    '确认删除用户 '+row.username+' 吗',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
  .then(() => {
    console.log("当前删除行：",row)
    // 刷新开关
    loading.value=true
    // console.log("刷新状态-删除用户-前",loading.value)
    // 调用删除用户方法
    delUserHandler(row.id)
      .then((response) => {
        // console.log("获取成功，response:",response)
        ElMessage({
          message: response.data.message,
          type: 'success',
        })
        // console.log("用户信息",userList)
        getUser()
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
const addUser = () =>{
  dialogFormVisible.value=true
  defaultMethod.value='Create'
}

//编辑、更新用户，使用dialog组件
const editUser = (row) =>{
  dialogFormVisible.value=true
  defaultMethod.value='Edit'
  data.userForm=row
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
        <span>用户列表</span>
        <el-button text bg @click="addUser()">添加用户</el-button>
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
      <el-table-column prop="id" label="Id" sortable  width="180" />
      <el-table-column prop="username" label="Name" width="180" />
      <el-table-column prop="qq" label="QQ" width="180" />
      <el-table-column prop="address" label="Address" />
      <el-table-column fixed="right" label="Operations">
        <!-- scope绑定当前操作的行 -->
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="delUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加用户,关闭窗口时触发重新获取用户列表的事件 -->
  <el-dialog 
    @closed="closeRefresh()" 
    v-model="dialogFormVisible" 
    destroy-on-close
    :title="defaultMethod=='Create'?'添加用户':'更新用户'" 
    width="20%"
  >
    <!-- 触发事件 -->
    <!-- <Add @callback="getUser"></Add> -->
    <Add :userForm="userForm" :method="defaultMethod" @callback="callback()"></Add> 
  </el-dialog>

  
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>