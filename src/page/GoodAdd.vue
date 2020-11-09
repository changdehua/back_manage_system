<template>
  <div>
    <bread-crumb :path1="'商品列表'" :path2="'添加商品'"></bread-crumb>
    <el-card>
      <el-steps :active="Number(activeIndex)" align-center finish-status="success">
        <el-step title="基本信息">
          <template slot="description">
            <span>fjkmfkbfkb</span>
          </template>
        </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>


      <!-- form嵌套bab -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-position="top">
        <!-- tab -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="tabSwitch" @tab-click="tabClick"> 
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_num">
              <el-input v-model="addGoodsForm.goods_num"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addGoodsForm.goods_cate"
                :options="goodCates"
                :props="cascaderProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,i) in cateAttrs" :key="i" :label="item.attr_name+':'">
              <el-checkbox-group v-model="item.attr_val">
                <el-checkbox :label="attr" v-for="(attr,i) in item.attr_val" :key="i" border>{{attr}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item,i) in cateProps" :key="i" :label="item.attr_name">
              <el-input v-model="item.attr_val"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_desc"
                ref="myQuillEditor"
                >
            </quill-editor>

              <el-row >
                  <el-col class="addBtn">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                  </el-col>
              </el-row>
            
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </el-card>

    <!-- 图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgDialogVisible"
      width="50%"
      >
      <img :src="imgUrl" alt="" class="imgPreview">
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from  '../components/BreadCrumb'
import {getAllCates,getCateAttrs,getCateProps} from '../api/api'
export default {
  name:'GoodsAdd',
  data(){
    return {
      activeIndex:0,
      addGoodsForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_num:'',
        goods_cate:[],
        pics:[],
        goods_desc:''

      },
      goodCates:[],
      cateAttrs:[],
      cateProps:[],

      addGoodsRules:{
        goods_name:[
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请填写商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请填写商品重量', trigger: 'blur' }
        ],
        goods_num:[
          { required: true, message: '请填写商品数量', trigger: 'blur' }
        ],
        goods_cate:[
          { required: true, message: '请填写商品分类', trigger: 'blur' }
        ]

      },
      cascaderProps:{
        expandTrigger: 'hover',
        label:'cateName',
        children:'children',
        value:'id'
      },
      fileList:[],
      headerObj:{
        authorization:localStorage.getItem('token')||sessionStorage.getItem('token')
      },
      imgUrl:'',
      imgDialogVisible:false
    }
  },
  methods:{
    handleChange(){
      // console.log(this.addGoodsForm.goods_cate)
      if(this.addGoodsForm.goods_cate.length<3){
        return this.addGoodsForm.goods_cate=[]
      }

    },
    async getCates(){
      let res=await getAllCates()
      this.goodCates=res.data
    },
    tabSwitch(activeName,oldActiveName){
      // console.log(oldActiveName);
      if(oldActiveName==='0'&&this.addGoodsForm.goods_cate.length!==3){
        this.$message.error('请选择分类')

        return false
      }
    },
    async tabClick(tab){
      // console.log(tab);
      if(this.activeIndex==='1'){
        // console.log('ahahh');
        let res= await getCateAttrs({
          id:this.cateId
        })
        res.data.forEach(element => {
          element.attr_val=element.attr_val.trim().length===0?[]:element.attr_val.split(' ')
        });
        // console.log(res);
        this.cateAttrs=res.data
      }else if(this.activeIndex==='2'){
        let res = await getCateProps({
          id:this.cateId
        })

        this.cateProps=res.data
      }
    },
    handlePreview(file,fileList){
      this.imgDialogVisible=true
      this.imgUrl=file.url
    },
    handleRemove(file){
      // console.log(file);
      if(!file) return 
      let i=this.addGoodsForm.pics.findIndex(item=>item.url===file.url)
      this.addGoodsForm.pics.splice(i,1)

    },
    handleSuccess(response,file,fileList){
      this.addGoodsForm.pics.push({
        url:file.url
      })
      // console.log(file);
      this.fileList=fileList
    },
    addGoods(){
      this.$refs.addGoodsForm.validate(valid=>{
        if(!valid){
          return this.$message.error('请填写完整')
          
        }
      })
    }
  },
  components:{
    'bread-crumb':BreadCrumb
  },
  created(){
    this.getCates()
  },
  computed:{
    cateId(){
      if(this.addGoodsForm.goods_cate.length===3){
        return this.addGoodsForm.goods_cate[2]
      }else{
        return null
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .imgPreview{
    width: 100%;
  }
  .addBtn{
    display: flex;
    justify-content: flex-end;
  }
 
</style>