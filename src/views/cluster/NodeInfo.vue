<script  setup>
import { reactive,ref,toRefs,onMounted } from 'vue';
import { updateNodeHandler} from '../../api/node.js';
import { ElMessage } from 'element-plus';
import {object2List,deleteTableRow,addTableRow,list2Object} from '../../utils/index.js'

const data = reactive({
    nodeItems:{},
    labelList:[],
    taintList:[],
    taintOption:[
        {
            value: 'NoSchedule',
            label: '禁止调度'
        },
        {
            value: 'NoExecute',
            label: '立即驱逐'
        },
        {
            value: 'PreferNoSchedule',
            label: '尽量不调度'
        },
    ],
    updateNodeInfo:{
        metadata:{
            labels:{}
        },
        spec:{
            taints:[]
        }
    }
})
const props = defineProps({
    nodeItems: {
        Object
    },
    clusterId:{
        String
    },
})

// 生命周期，注意数据挂载的顺序
// onBeforeMount(() => {
onMounted(() => {
    //这种方法存在问题：浅拷贝 
    // data.userForm=props.userForm
    // 先把对象转换成json字符串
    const jsonString = JSON.stringify(props.nodeItems)
    //再把json转换成object
    data.nodeItems = JSON.parse(jsonString)
    data.labelList = object2List(data.nodeItems.metadata.labels)

    if (data.nodeItems.spec.taints == undefined){
        data.taintList = []
    }else{
        data.taintList = data.nodeItems.spec.taints
    }

})

// 转换为普通对象 给template使用
const {nodeItems,labelList,taintList,taintOption} = toRefs(data)
//此变量用于绑定form表单的属性
const nodeItemsRef=ref()


const loading =ref(false)

// 添加集群后 需要重新获取集群列表，这个操作不能直接在当前组件中执行，因为添加集群是在List组件调用的，所以子组件需要通过事件去通知给父组件（list组件）
const emit = defineEmits(['callback'])
const submit = () =>{
    //通过validate函数判断表单是否符合input中的规则
    loading.value=true
    //转换后的label
    const nLabel = list2Object(data.labelList)
    data.nodeItems.metadata.labels = nLabel
    // 返回所需的信息

    updateNodeHandler(props.clusterId,data.nodeItems.metadata.name,data.nodeItems.metadata.labels,data.taintList)
    .then((response)=>{
        ElMessage({
            message: response.data.Message,
            type: response.data.Type,
        })
        loading.value=false
        emit('callback')
    }) 
}


</script>

<template>
    <el-form 
    :model="nodeItems" 
    el-form--label-left
    ref="nodeItemsRef" 
    v-loading="loading"
    >
    <div class="div-tab">
        <el-tabs>
            <!-- 标签label -->
            <el-tab-pane label="标签配置" style="width: 100%">
              <el-table :data="labelList" height="220" align="center" border  >
                <el-table-column prop="key" label="Key"  align="center"  width="320px">
                    <template #default="rows">
                        <el-input v-model="rows.row.key" placeholder="请输入标签的key"/>
                    </template>
                </el-table-column>

                <el-table-column prop="value" label="Value" align="center" width="320px">
                    <template #default="rows">
                        <el-input v-model="rows.row.value" placeholder="请输入标签的value"/>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" align="center" width="80px">
                    <template #header>
                      <el-button link type="primary" size="small" @click="addTableRow(labelList)">添加</el-button>
                    </template>

                    <template #default="scope">
                        <el-button link type="danger" size="small" @click="deleteTableRow(labelList,scope.$index)">删除</el-button>
                    </template>

                </el-table-column>

              </el-table>
            </el-tab-pane>
<!-- 污点 -->
            <el-tab-pane label="污点配置" style="width: 100%">
                <el-table :data="taintList" height="220" align="center" border  >

                <el-table-column prop="key" label="Key"  align="center"  width="215px">
                    <template #default="rows">
                        <el-input v-model="rows.row.key" placeholder="请输入污点的key" />
                    </template>
                </el-table-column>

                <el-table-column prop="value" label="Value" align="center" width="215px">
                    <template #default="rows">
                        <el-input v-model="rows.row.value" placeholder="请输入污点的value"/>
                    </template>
                </el-table-column>

                <el-table-column prop="effect" label="Effect" align="center" width="210px">
                    <template #default="rows">
                        <!-- <el-input v-model="rows.row.effect" placeholder="请输入污点的effect"/> -->
                        <el-select
                            v-model="rows.row.effect"
                            placeholder="Select"
                            >
                            <el-option
                                v-for="item in taintOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" align="center" width="80px">
                    <template #header="h">
                      <el-button link type="primary" size="small"  @click="addTableRow(taintList)">添加</el-button>
                    </template>

                    <template #default="scope">
                        <el-button link type="danger" size="small" @click="deleteTableRow(taintList,scope.$index)">删除</el-button>
                    </template>

                </el-table-column>

              </el-table>        
            </el-tab-pane>
        </el-tabs>
    </div>

    <span>
        <!-- <el-button @click="resetForm()">重置</el-button> -->
        <el-button type="primary"  @click="submit()">更新</el-button>
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


.div-tab{
    display: flex;
    flex-direction:row;
    height: 300px;

}
</style>