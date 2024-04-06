<script  setup>
    import Aside from './components/Aside.vue';
    import Footer from './components/Footer.vue'
    import Main from './components/Main.vue'
    import Header from './components/Header.vue'
</script>

<template>
  
  <div class="common-layout">
    <el-container class="el-container">
      <Aside></Aside>

      <el-container class="el-container__el-container">
        <Header></Header>
        <Main></Main>
        <!-- <Footer></Footer>         -->
      </el-container>

    </el-container>
  </div>
</template>

<style scoped>

.el-container {
  height: 100vh;
  width: 100vw;
  /* margin: ; */
}

.el-container__el-container{
    display: flex;
    flex-direction: column;
}
</style>