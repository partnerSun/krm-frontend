<script setup>
import {computed,ref} from 'vue'
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from '@element-plus/icons-vue'

const props = defineProps({
    nodeDetailItems: {
        Object
    },
    clusterId:"",
    nodeName:"",

})

const size = ref('large')

const iconStyle = computed(() => {
    // vue会把驼峰式 自动转换成margin-right
  return {marginRight: '8px'}
})


</script>

<template>
    <!-- <h2>节点信息展示</h2>
    <div>{{ props.nodeDetailItems }}</div> -->
    <el-descriptions
    class="margin-top"
    :title="'集群: '+ props.clusterId + '  节点: ' + props.nodeName" 
    :column="3"
    size="large"
    border
  >
  <!-- 主机名 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle"> <user /></el-icon>
          <span>主机名</span>
        </div>
      </template>
      {{props.nodeDetailItems.metadata.name}}
    </el-descriptions-item>
  <!-- 节点ip -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle"><iphone /></el-icon>
          <span>IP</span>
        </div>
      </template>
      {{props.nodeDetailItems.status.addresses[0].address}}
    </el-descriptions-item>
  <!-- 节点角色 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon style="margin-right: 8px;">
            <location />
          </el-icon>
          <span>角色</span>
        </div>
      </template>
      <span v-if="props.nodeDetailItems.metadata.labels.hasOwnProperty('kubernetes.io/role')">{{props.nodeDetailItems.metadata.labels['kubernetes.io/role']}}</span>
      <span v-else>无</span>
    </el-descriptions-item>
  <!-- 节点状态 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          <span>节点状态</span>
        </div>
      </template>
      <el-tag v-if="props.nodeDetailItems.status.conditions[4].type === 'Ready' && props.nodeDetailItems.status.conditions[4].status === 'True'" style="color: #529b2e;" size="large">{{ props.nodeDetailItems.status.conditions[4].type }}</el-tag>
      <el-tag v-else style="color: #f89898;" size="large">{{ props.nodeDetailItems.status.conditions[4].type }}</el-tag>
    </el-descriptions-item>
 <!-- POD -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>pod</span>
        </div>
      </template>
      <el-button link type="primary">查看</el-button>
    </el-descriptions-item>
  <!-- 操作系统 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>系统</span>
        </div>
      </template>
      {{props.nodeDetailItems.status.nodeInfo.osImage}}
    </el-descriptions-item>
  <!-- 容器运行时 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>Runtime</span>
        </div>
      </template>
      {{props.nodeDetailItems.status.nodeInfo.containerRuntimeVersion}}
    </el-descriptions-item>
  <!-- cpu架构 -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>CPU架构</span>
        </div>
      </template>
      {{props.nodeDetailItems.status.nodeInfo.architecture}}
    </el-descriptions-item>

  <!-- k8s版本 -->
    <el-descriptions-item >
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>版本</span>
        </div>
      </template>
        <el-tag>Kubelet: {{props.nodeDetailItems.status.nodeInfo.kubeletVersion}}</el-tag>
        <el-tag>KubeProxy: {{props.nodeDetailItems.status.nodeInfo.kubeProxyVersion}}</el-tag> 
    </el-descriptions-item>
  <!-- 操作系统内核 -->
    <el-descriptions-item >
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          <span>系统内核</span>
        </div>
      </template>
      <span>{{props.nodeDetailItems.status.nodeInfo.kernelVersion}}</span>
    </el-descriptions-item>


  </el-descriptions>
</template>


<style scoped>
.el-descriptions {
  margin-top: 20px;

}
.cell-item {
  display: flex;
  align-items: center;
  width: 80px;
}
.margin-top {
  /* margin-top: 300px; */
    margin-bottom: 20px;
}
</style>