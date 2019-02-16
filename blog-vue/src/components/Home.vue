<template>
  <div id='Home'>
  <Menu></Menu>
    <div>
      <h2>MyBlogs</h2>
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
    // 
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
  methods:{

  // ,
  //   submit(){
  //     var title=this.blogtitle
  //     var blog=this.blogcontent
  //     if(!title.match(/^ *$/)){
  //       if(!blog.match(/^ *$/)){
  //       this.$http.post("http://localhost:3000/api/"+this.username+"/newblog",{
  //         title : title,
  //         newblog: blog
  //       }).then(
  //         res=>{
  //           this.$message(res.data.message)
  //         },
  //         err=>{
  //           console.log(err)
  //           this.$message("提交失败了~请重试~")
  //         })
  //       }else{
  //         this.$message("正文请勿输入空白~")
  //       }
  //     }else{
  //       this.$message("标题请勿输入空白~")
  //     }
  //   }
  }
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
