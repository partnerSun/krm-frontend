<script  setup>
  import { GoldMedal ,Document,Menu as IconMenu,Location, Setting, } from '@element-plus/icons-vue'
  import {MENU_CONFIG} from '../../../config/menu.js'
  import { storeToRefs } from "pinia";
  import '../../../assets/iconfont/iconfont.css'
//   import {ref} from 'vue'
  import {useisCollapseStore} from '../../../store/index.js'
    //   菜单折叠开关
  
//   const iscoll = useisCollapseStore2()
//   const isCollapse = iscoll.isCollapse
  const {isCollapse} = storeToRefs(useisCollapseStore())

  const handleOpen = (key, keyPath) => {
        console.log("打开:",key, keyPath)
    }
  const handleClose = (key, keyPath) => {
         console.log("关闭:",key, keyPath)
    }   
</script>

<template>
    <el-aside class="el-aside" :style="{ width: isCollapse?'63px':'250px'}">
     <div class="aside-div">
        <router-link to="/">
          <el-button text style="font-size: 20px;">
            <el-icon style="margin-right: 5px;padding-left: 12px;"><GoldMedal /></el-icon>
              <span v-show="!isCollapse">KRM</span>
          </el-button>
        </router-link>
     </div>
     <div>
        <el-row class="tac">
        <el-col >
        <el-menu
            :default-active="$route.path" 
            class="el-menu-vertical-demo"
            router
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
            :collapse-transition="false"
            >
            <el-sub-menu v-for="(menu) in MENU_CONFIG" :key="menu.index" :index="menu.index">
                <template #title>
                    <el-icon><span style="font-size: 20px;" :class="menu.icon"></span></el-icon>
                    <span>{{ menu.title }}</span>
                </template>
                <!-- 判断是否有子菜单 -->
                <!-- if-else放在template中，否则需要多加一层el-sub-menu和el-menu-item -->
                <template v-if="menu.subMenu">
                    <el-sub-menu v-for="(submenu) in menu.subMenu" :key="submenu.index" :index="submenu.index">
                        <template #title>
                            <el-icon><span style="font-size: 20px;" :class="submenu.icon"></span></el-icon>
                            <span> {{ submenu.title }} </span>
                        </template>
                        <el-menu-item v-for="(subitem) in submenu.items" :key="subitem.index" :index="subitem.index">
                            <template #title> {{ subitem.title }}</template>
                        
                        </el-menu-item>
                    </el-sub-menu>
                </template>

                <template v-else>
                    <el-menu-item v-for="item in menu.items" :key="item.index" :index="item.index">
                    <template #title> 
                        <span style="font-size: 14px;">  {{ item.title }} </span>
                    </template>
                    
                    </el-menu-item>
                </template>

            </el-sub-menu>



        </el-menu>
        </el-col>
        </el-row>
    </div>
    </el-aside>
</template>

<!-- lang="less" -->
<style lang="less" scoped>

.el-aside{
    width: 250px;
    border-right: 1px solid #ccc;
    overflow: hidden;
    transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -moz-transition: width 0.25s;
    -o-transition: width 0.25s;
    .aside-div{
        height: 50px;
        width:"100%";
        button {
            height: 100%;
            width: 100%;
            }
    }
}
// 解决点击button有黑框的问题
button:focus { outline: none; }
// 解决卡顿后 动作僵硬的问题
// .aside{
//     overflow: hidden;
//     transition: width 0.25s;
//     -webkit-transition: width 0.25s;
//     -moz-transition: width 0.25s;
//     -o-transition: width 0.25s;

// }

</style>