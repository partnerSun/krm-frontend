<script  setup>
import { reactive,ref,toRefs,onMounted } from 'vue';
import {addNamespaceHandler, updateNamespaceHandler} from '../../api/namespace.js';
import { ElMessage } from 'element-plus';

const data = reactive({
    namespaceForm:{
        name: '',
        uid: '',
        status: '',
     }

})
const props = defineProps({
    method: {
        String,
        default: "Create"
    },
    namespaceForm: {
        Object
    }
})

// 生命周期，注意数据挂载的顺序
// onBeforeMount(() => {
onMounted(() => {
    //这种方法存在问题：浅拷贝 
    // data.userForm=props.userForm
    // 先把对象转换成json字符串
    const jsonString = JSON.stringify(props.namespaceForm)
    //再把json转换成object
    data.namespaceForm = JSON.parse(jsonString)

})

// 转换为普通对象 给template使用
const {namespaceForm} = toRefs(data)
//此变量用于绑定form表单的属性
const namespaceFormRef=ref()

//重置输入框
const resetForm = () => {
//   if (!userFormRef) return
    namespaceFormRef.value.resetFields()
}

const rules = reactive({
    // 和prop标签对应
    name: [
      { required: true, message: '请输入ns名称', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
     ]
})


// const emit = defineEmits(['callback'])

const loading =ref(false)

// 添加集群后 需要重新获取集群列表，这个操作不能直接在当前组件中执行，因为添加集群是在List组件调用的，所以子组件需要通过事件去通知给父组件（list组件）
const emit = defineEmits(['callback'])
const submit = () =>{
    //通过validate函数判断表单是否符合input中的规则
    namespaceFormRef.value.validate((valid)=>{
         //如果valid为true 代表表单校验成功
        if (valid) {
        loading.value=true
        if (props.method=="Create"){
            addNamespaceHandler(data.namespaceForm)
            .then((response)=>{
                ElMessage({
                    message: response.data.Message,
                    type: response.data.Type,
                })
                loading.value=false
            })

        }else if (props.method=="Edit"){
            updateNamespaceHandler(data.namespaceForm)
            .then((response)=>{
                ElMessage({
                    message: response.data.Message,
                    type: response.data.Type,
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
    :model="namespaceForm" 
    el-form--label-left
    ref="namespaceFormRef" 
    v-loading="loading"
    :rules="rules"
    
    >
    <div class="div-form">
        <div>
            <!-- ns信息 -->
            <el-form-item class="form-item" prop="name" label="名称" label-width="84px">
                <el-input v-model="namespaceForm.name" autocomplete="off" placeholder="namespace" />
            </el-form-item>

        </div>
    </div>

    </el-form>
    <span>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submit()">
            {{ props.method=="Create"?"添加":"更新" }}
        </el-button>

    </span>
</template>

<style scoped>
.form-item{
    width: 85%;
    margin: 30px auto;
}


.div-form{
    display: flex;
    height: 100px;
}
</style>