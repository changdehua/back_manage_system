<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- treeTable -->
      <tree-grid-table
        :data="goodCates"
        :columns="columns"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
        stripe
        class="mt"
      >
        <template slot="valided" scope="scope">
          <i class="el-icon-success" v-if="scope.row.isValided" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template v-slot:order="scope">
          <!-- {{scope.row}} -->
          <el-tag v-if="scope.row.sort===0">等级一</el-tag>
          <el-tag v-else-if="scope.row.sort===1" type="success">等级二</el-tag>
          <el-tag v-else-if="scope.row.sort===2" type="warning">等级三</el-tag>
          <el-tag v-else-if="scope.row.sort===3" type="info">等级四</el-tag>
        </template>
        <template v-slot:options="scope">
          <div>
            <!-- {{ scope.row }} -->
            <el-button  size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button  size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </div>
        </template>
      </tree-grid-table>


      <!-- 分页 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>


    <!-- 添加分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCatedDialog"
      width="30%"
      @close="dialogClose"
    >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateRef" label-width="84px" class="demo-ruleForm">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父类分级:">
             <el-cascader
                v-model="cascaderParentId"
                :options="parentCates"
                :props="cascaderProps"
                @change="handleChange"
                clearable
                >
              </el-cascader>
          </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCates">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {getAllCates,getParentCates} from '@/api/api'
export default {
  data(){
    return{
      addCatedDialog:false,
      queryInfo:{
        page:1,
        pageSize:5,
        type:1
      },
      total:0,
      goodCates:[],
      parentCates:[],
      columns:[
        {
          label:'分类名称',
          prop:'cateName'
        },
        {
          label:'是否有效',
          prop:'isValided',
          type: 'template',
          template: 'valided',

        },
        {
          label:'排序',
          type: 'template',
          template: 'order',

        },
        { 
          label:'操作',
          type: 'template',
          template: 'options',
          minWidth: '200px'
        }
      ]
      ,
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addCateFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cascaderParentId:[],
      cascaderProps:{
        expandTrigger: 'hover',
        value:'id',
        label:'cateName',
        checkStrictly: true
      }
    }
  },
  methods:{
    async getCates(){
      let {data:res}=await getAllCates(this.queryInfo)
      // console.log(res);
      this.goodCates=res
      this.total=10
    },
    handleSizeChange(size){
      this.queryInfo.pageSize=size
      this.getCates()
    },
    handleCurrentChange(page){
      this.queryInfo.page=page
      this.getCates()
    },
    async addCate(){
      let res=await getParentCates()
      // console.log(res);
      if(res.status===200){
        this.parentCates=res.data
      }
      this.addCatedDialog=true
    },
    handleChange(val){
      // console.log(val);
      // console.log(this.cascaderParentId);
      if(this.cascaderParentId.length>0){
        this.addCateForm.cat_pid=this.cascaderParentId[this.cascaderParentId.length-1]
        this.addCateForm.cat_level=this.cascaderParentId.length
      }else{
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0

      }
    },
    submitCates(){
      // console.log(this.addCateForm);
      this.$refs.addCateRef.validate(valid=>{
        if(!valid) return 
        console.log(this.addCateForm)
        this.$message({
          message:'提交成功,未调用接口',
          type:'success'
        })
        this.addCatedDialog=false
        this.getCates()
      })

    },
    dialogClose(){
      this.$refs.addCateRef.resetFields()
      this.cascaderParentId=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    }
  },
  created(){
    this.getCates()
  }
}
</script>
<style lang="less" scoped>
  .mt{
    margin-top: 10px;
  }
  .el-row{
    display: flex;
    justify-content: flex-end;
  }
</style>