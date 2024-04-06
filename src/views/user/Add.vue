<script  setup>
import { reactive,ref,toRefs,onMounted } from 'vue';
import {addUserHandler, updateUserHandler} from '../../api/user.js';
import { ElMessage } from 'element-plus';

const data = reactive({
    userForm:{
        username: '',
        qq: '',
        address: '',
    },

})
const props = defineProps({
    method: {
        String,
        default: "Create"
    },
    userForm: {
        Object
    }
})

// 使用生命周期，在自动赋值，props的值不能直接使用
// onBeforeMount(() => {
onMounted(() => {
    //这种方法存在问题：浅拷贝 
    // data.userForm=props.userForm
    // 先把对象转换成json字符串
    const jsonString = JSON.stringify(props.userForm)
    //再把json转换成object
    data.userForm = JSON.parse(jsonString)

})

// 转换为普通对象 给template使用
const {userForm} = toRefs(data)
//此变量用于绑定form表单的属性
const userFormRef=ref()
//重置输入框
const resetForm = () => {
//   if (!userFormRef) return
  userFormRef.value.resetFields()
}

const rules = reactive({
    // 和prop标签对应
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
     ],
    qq: [
      { required: true, message: '请输入qq号码', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})

const emit = defineEmits(['callback'])

const loading =ref(false)
// 添加用户
// 添加用户后 需要重新获取用户列表，这个操作不能直接在当前组件中执行，因为添加用户是在List组件调用的，所以子组件需要通过事件去通知
// const emit = defineEmits(['callback'])
const submit = () =>{
    //通过validate函数判断表单是否符合input中的规则
    userFormRef.value.validate((valid)=>{
         //如果valid为true 代表表单校验成功
        if (valid) {
        loading.value=true
        if (props.method=="Create"){
            addUserHandler(data.userForm)
            .then((response)=>{
                ElMessage({
                message: response.data.message,
                type: 'success',
                })
                loading.value=false
            })
        }else if (props.method=="Edit"){
            updateUserHandler(data.userForm)
            .then((response)=>{
                ElMessage({
                message: response.data.message,
                type: 'success',
                })

                loading.value=false
                emit('callback')
            }) 
        }

      } else {
        ElMessage({
            message: "输入信息不完整",
            type: 'error',
        })
      }
    })
}

</script>

<template>
    <el-form 
    :model="userForm" 
    el-form--label-left
    ref="userFormRef" 
    v-loading="loading"
    :rules="rules"
    >
    <el-form-item class="form-item" prop="username" label="姓名" label-width="64px">
        <el-input v-model="userForm.username" autocomplete="off"/>
    </el-form-item>

    <el-form-item class="form-item" prop="qq" label="QQ" label-width="64px">
        <el-input v-model="userForm.qq" autocomplete="off"/>
    </el-form-item>

    <el-form-item class="form-item" prop="address" label="地址" label-width="64px">
        <el-input v-model="userForm.address" autocomplete="off"/>
    </el-form-item>

    </el-form>
    <span>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submit()">
            {{ props.method=="Create"?"添加":"更新" }}
        </el-button>

    </span>
</template>

<style>
.form-item{
    width: 85%;
    margin: 20px auto;
}
</style>