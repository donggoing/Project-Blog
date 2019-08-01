<template>
  <div id="container">
      <div id="edit">
            <!-- textarea之间不要有空格 -->
            <el-input type='textarea' id='editArea' placeholder="请输入博客内容" v-model='content'></el-input>
      </div>
      <div id="preview">
            <div id="show-content"></div>
      </div>
  </div>
</template>
<script>
import {supportTab} from '@/assets/js/textarea_extend'
export default {
    name:'Edit',
    props:['blogcontent'],
    data () {
        return {
            content:this.blogcontent
            // 'content':'',
            // 'converter':null
        }
    },
    watch:{
        'content':'contentChanged'
    },
    mounted(){ 
        this.contentChanged()
        supportTab('editArea')
    },

    methods: {
        // init(){
        //     var showdown  = require('showdown');
        //     var converter = new showdown.Converter();
        //     this.converter = converter;
        // },
        contentChanged(){ 
           var html = this.converter.makeHtml(this.content);
           document.getElementById('show-content').innerHTML = html;
        }
    }
}
</script>
<style scoped>
    #container{
        width:100%;
        min-width:1200px;
        position: relative;
        text-align: left;
        height: 600px;
    }

    #edit{
        display:inline-block;
        width:50%;
        height:520px;
        max-height: 600px;
        position:absolute;
        left:0;
    }

     #edit >>> #editArea{
        color:white;
        width: 100%;
        padding:5px;
        min-height: 520px !important;
        max-height: 600px !important; 
        background-color: dimgrey;
    }

    #preview{
        background-color:ghostwhite;
        /* border:1px solid grey; */
        display:inline-block;
        width:50%;
        position:absolute;
        right:0;
        overflow: scroll;
    }

    #show-content{
        width:100%;
        height: 500px;
        max-height: 600px;
        padding:10px 0 0 20px;
    }
</style>