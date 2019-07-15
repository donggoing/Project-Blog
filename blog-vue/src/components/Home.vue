<template>
  <div id='Home'>
    <div>
      <h2>我的博客</h2>
       <MyBlogs id="myblogs">
       </MyBlogs>
    </div>
  </div>
</template>

<script>
import MyBlogs from './MyBlogs.vue'
import Menu from '@/components/NavMenu'
export default {
  name: 'Home',
  data () {
    return {
      username: this.$store.getters.username||'User',
      blogtitle: "",
      blogcontent: ""
    }
  },
  computed:{
      activeIndex(){
        return this.$route.path.replace('/','')
      }
  },
  components:{MyBlogs,Menu},
  methods:{}
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #Home{
    width:100%;
    margin:0;
  }

  #myblogs{
    width:80%;
    margin:0 auto;    
    position: relative;
  }

  h1, h2 {
    text-align: center;
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
