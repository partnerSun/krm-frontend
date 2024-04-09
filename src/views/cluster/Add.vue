<script  setup>
import { reactive,ref,toRefs,onMounted } from 'vue';
import {addClusterHandler, updateClusterHandler} from '../../api/cluster.js';
import { ElMessage } from 'element-plus';

const data = reactive({
    clusterForm:{
        id: '',
        displayname: '',
        area: '',
        city: '',
        kubeconfig: '',
     }

})
const props = defineProps({
    method: {
        String,
        default: "Create"
    },
    clusterForm: {
        Object
    }
})

// 生命周期，注意数据挂载的顺序
// onBeforeMount(() => {
onMounted(() => {
    //这种方法存在问题：浅拷贝 
    // data.userForm=props.userForm
    // 先把对象转换成json字符串
    const jsonString = JSON.stringify(props.clusterForm)
    //再把json转换成object
    data.clusterForm = JSON.parse(jsonString)

})

// 转换为普通对象 给template使用
const {clusterForm} = toRefs(data)
//此变量用于绑定form表单的属性
const clusterFormRef=ref()

//重置输入框
const resetForm = () => {
//   if (!userFormRef) return
    clusterFormRef.value.resetFields()
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
    clusterFormRef.value.validate((valid)=>{
         //如果valid为true 代表表单校验成功
        if (valid) {
        loading.value=true
        if (props.method=="Create"){
            addClusterHandler(data.clusterForm)
            .then((response)=>{
                ElMessage({
                    message: response.data.Message,
                    type: response.data.Type,
                })
                loading.value=false
            })

        }else if (props.method=="Edit"){
            updateClusterHandler(data.clusterForm)
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
    :model="clusterForm" 
    el-form--label-left
    ref="clusterFormRef" 
    v-loading="loading"
    :rules="rules"
    
    >
    <div class="div-form">
        <div>
            <!-- 集群信息 -->
            <el-form-item class="form-item" prop="id" label="集群ID" label-width="84px">
                <el-input v-if="props.method === 'Create'" v-model="clusterForm.id" autocomplete="off" placeholder="请输入集群ID" />
                <el-input v-else v-model="clusterForm.id" autocomplete="off" placeholder="请输入集群ID" disabled />
            </el-form-item>

            <el-form-item class="form-item" prop="displayname" label="集群名称" label-width="84px">
                <el-input v-model="clusterForm.displayname" autocomplete="off" placeholder="请输入集群名称"/>
            </el-form-item>

            <el-form-item  label="位置" label-width="78px" >
                <el-col :span="8">
                    <el-form-item class="col-form-item" prop="city" >
                        <el-input v-model="clusterForm.city" autocomplete="off" placeholder="城市"/>
                    </el-form-item>
                </el-col>
                <span> - </span>
                <el-col :span="8">
                    <el-form-item class="col-form-item" prop="area" >
                        <el-input v-model="clusterForm.area" autocomplete="off" placeholder="所在区"/>
                    </el-form-item>
                </el-col>
            </el-form-item>
        </div>
        <div>
            <!-- kubeconfig -->
            <el-form-item class="form-item-config" prop="kubeconfig" label-width="84px">
                <el-input v-model="clusterForm.kubeconfig" autocomplete="off" placeholder="kubeconfig" type="textarea" :rows="6" style="width: 300px;"/>
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

<style>
.form-item{
    width: 75%;
    margin: 20px 0;
}
.form-item-config{
    /* width: 85%; */
    margin: 20px 0;
}
.col-form-item{
    margin: 0 5px;
}
.div-form{
    display: flex;

}
</style>