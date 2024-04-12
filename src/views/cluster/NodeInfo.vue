<script  setup>
import { reactive,ref,toRefs,onMounted } from 'vue';
// import {addClusterHandler, updateClusterHandler} from '../../api/cluster.js';
import { ElMessage } from 'element-plus';

const data = reactive({
    labelForm:{
     }

})
const props = defineProps({
    // method: {
    //     String,
    //     default: "Create"
    // },
    labelForm: {
        Object
    }
})

// 生命周期，注意数据挂载的顺序
// onBeforeMount(() => {
onMounted(() => {
    //这种方法存在问题：浅拷贝 
    // data.userForm=props.userForm
    // 先把对象转换成json字符串
    const jsonString = JSON.stringify(props.labelForm)
    //再把json转换成object
    data.labelForm = JSON.parse(jsonString)
    // console.log("labelForm:",labelForm)

})

// 转换为普通对象 给template使用
const {labelForm} = toRefs(data)
//此变量用于绑定form表单的属性
const labelFormRef=ref()

//重置输入框
const resetForm = () => {
//   if (!userFormRef) return
    labelFormRef.value.resetFields()
}

const rules = reactive({
    // 和prop标签对应
    id: [
      { required: true, message: '请输入集群id', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
     ],
    displayname: [
      { required: true, message: '请输入集群名称', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
    ,
    area: [
      { required: true, message: '请输入集群所在区', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
    ,
    city: [
      { required: true, message: '请输入所在城市', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
    ,
    kubeconfig: [
      { required: true, message: '请输入config配置', trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
    ,
    place: [
      { required: false,  trigger: 'blur' },
      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})


// const emit = defineEmits(['callback'])

const loading =ref(false)

// 添加集群后 需要重新获取集群列表，这个操作不能直接在当前组件中执行，因为添加集群是在List组件调用的，所以子组件需要通过事件去通知给父组件（list组件）
const emit = defineEmits(['callback'])
const submit = () =>{
    //通过validate函数判断表单是否符合input中的规则
    labelFormRef.value.validate((valid)=>{
         //如果valid为true 代表表单校验成功
        if (valid) {
        loading.value=true
        updateClusterHandler(data.labelForm)
        .then((response)=>{
            ElMessage({
                message: response.data.Message,
                type: response.data.Type,
            })
            loading.value=false
            emit('callback')
        }) 
        

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
    :model="labelForm" 
    el-form--label-left
    ref="labelFormRef" 
    v-loading="loading"
    >
    <div class="div-form">
        <!-- 节点信息 -->
        <el-form-item v-for="(item, index) in labelForm" :key="index" label="Confirm" prop="index" >
            <div class="div-form-item">
                <el-input v-model="labelForm[key]" autocomplete="off" />
                 <el-input v-model="labelForm[item]" autocomplete="off" />
            </div>
        </el-form-item>

    </div>

    <span>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submit()">更新</el-button>
    </span>
    </el-form>
</template>

<style scoped> 
.form-item{
    width: 75%;
    margin: 20px 0;
}
.form-item-config{
    /* width: 85%; */
    margin: 20px 0;
    width: 400px;
}
.col-form-item{
    margin: 0 5px;
}
.div-form{
    display: flex;
    flex-direction:column;
    flex-wrap:wrap;
    height: 200px;
}

.div-form-item{
    display: flex;
    flex-direction:row;
    width: 150px;

}
</style>