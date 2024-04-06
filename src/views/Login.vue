<script  setup>
  import { reactive, ref, watch } from 'vue';
  import { User, Lock } from '@element-plus/icons-vue'
  import { login } from '../api/login.js';
  import { ElMessage } from 'element-plus'
  import { CONFIG } from '../config/index.js';
  import {useRouter} from 'vue-router';

  const router=useRouter()

  const loginInfo = reactive({
    pass: '',
    username: '',
  })
  const LoginRef = ref("")
  const rules = reactive({
    // 和prop标签对应
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
     ],
    pass: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
  })


let loginState = ref(true)
//监听用户名和密码的变化
watch([()=>loginInfo.username,()=>loginInfo.pass], () => {
  //LoginRef和表单绑定
  //通过validate函数判断表单是否符合input中的规则
  LoginRef.value.validate((valid)=>{
    //如果valid为true 代表表单校验成功
    if (valid) {
      loginState.value = false
      } else {
        loginState.value = true
      }
    })
})

  //登录接口
const submitForm = () =>{
  login(loginInfo.username,loginInfo.pass)
  .then((response) => {
      //打印是否登录
    console.log("登录成功，response:",response)
    // response.status http请求的状态,axios自动返回的
    // response.data.status 后端返回的状态，需要后端提供data.status
    if ( response.data.status == 200 ){
      //token存到本地
      const token = response.data.data.token
      //将token存储到localStorage的Authorization字段中
      window.localStorage.setItem(CONFIG.TOKEN_NAME,token)
      // 登录成功提示
      ElMessage({
        message: response.data.message,
        type: 'success',
      })
      router.replace({ path: '/' })
    }
  })
     //.catch错误在守卫中处理
  
  }

</script>

<template>
  <div style="width: 100vw;">
    <el-card class="el-card" >
      <h4>后台管理系统</h4>
      <el-form
        :model="loginInfo"
        :rules="rules"
        ref="LoginRef"
      >
      <el-form-item prop="username" class="form-item">
        <el-input :prefix-icon="User" v-model="loginInfo.username" placeholder="请输入用户名" clearable/>
      </el-form-item>

      <el-form-item prop="pass" class="form-item">
        <el-input :prefix-icon="Lock" show-password v-model="loginInfo.pass" type="password" autocomplete="off" placeholder="请输入密码" clearable />
      </el-form-item>


      <el-button type="primary" @click="submitForm()"  :disabled="loginState" style="margin: 5px auto 0px auto;">
          登录
      </el-button>


    </el-form>
    </el-card>
  </div>

</template>

<style scoped>

.el-card{
  width: 320px; 
  margin: auto;
}
/* .card-body {
  display: flex;
  place-items: center;
} */

.form-item {
  width: 240px; 
  margin: 0px auto 17px auto;
}
</style>