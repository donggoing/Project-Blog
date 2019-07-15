
<template>
  <div id="app">
    <Menu></Menu>
    <router-view></router-view>
    <el-footer id="footer">
      <p>Contact:<a href="mailto:374766849@qq.com">chenyd35@mail2.sysu.edu.cn</a></p>
        <p>Repo:<a href="https://github.com/donggoing/Project-Blog" target="_blank">https://github.com/donggoing/Project-Blog</a></p>

    </el-footer>
    <!-- <Footer id="footer"></Footer> -->
  </div>
</template>

<script>
import Menu from '@/components/NavMenu'
import Footer from '@/components/Footer'
export default {
  name: 'App',
  components:{Footer,Menu}
} 
</script>

<style>
  body{
    font-size: 17.5px;
    background-image:url("../src/assets/images/bg2.jpg");
    background-size: cover;
    margin:0
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }
  #footer{
        text-align: center;
        padding: 0;
        height:100px;
        bottom:20px;
        margin-top:100px;
        margin-bottom: 50px;
    }
    
    #footer a{
        color:dimgrey;
    }
</style>

