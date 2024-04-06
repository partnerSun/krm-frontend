<script  setup>
import {SwitchButton} from '@element-plus/icons-vue';
import '../../../assets/iconfont/iconfont.css';
import { logoutHandler } from '../../../api/logout.js';
import { CONFIG } from '../../../config/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import {useRouter} from 'vue-router';
import {useisCollapseStore} from '../../../store/index.js'
import { storeToRefs } from "pinia";

const router=useRouter()

const logout =() =>{
// 1.后端没有存储token，直接删除localStorage中的Authorization
// 2. 后端存储了token，需要先调用后端的退出接口，进行正常处理后，再去删除本地的token
    ElMessageBox.confirm(
        '确认退出吗？',
        'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
  .then(() => {
        logoutHandler()
      .then((response) => {
        ElMessage({
          message: response.data.message,
          type: 'success',
        })
        window.localStorage.removeItem(CONFIG.TOKEN_NAME)
        router.replace({ path: '/login' })
      })
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '取消退出',
    })
  })

}

const changeCollapse = () =>{
  const iscoll = useisCollapseStore()
  iscoll.changeisCollapse()
}
const {isCollapse} = storeToRefs(useisCollapseStore())
</script>

<template>
        <el-header class="el_header">
                <el-button class="el_button" @click="changeCollapse()">
                        <!-- <el-icon v-if="isCollapse" class="iconfont icon-oftenicon_dakaicebianlan"></el-icon>
                        <el-icon v-else class="iconfont icon-oftenicon_shouqicebianlan"></el-icon> -->
                        <el-icon v-show="isCollapse" class="iconfont icon-icon_dakaicebianlan"></el-icon>
                        <el-icon v-show="!isCollapse" class="iconfont icon-icon_shouqicebianlan"></el-icon>
                </el-button>
                <el-button class="el_button" @click="logout()">
                        <el-icon><SwitchButton /></el-icon>
                </el-button>
        </el-header>
</template>

<style scoped>
.el_button{
        font-size: 18px;
        border: 0;

}
.el_header{
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items:center;
}

/* // 解决点击button有黑框的问题 */
button:focus { outline: none; }
</style>