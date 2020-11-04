<template>
  <div>
    <bread-crumb :path1="'商品管理'" :path2="'商品列表'"></bread-crumb>
    <el-card>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getAllGoods">
            <el-button slot="append" icon="el-icon-search" @click="getAllGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加分类</el-button>
        </el-col>
      </el-row>

      <table-list
        :tableData="goods"
        :colums="colums"
        >
          <template slot="time" slot-scope="scope">
            {{scope.slot_data.create_time|date-format}}          
          </template>

          <template slot="opts" slot-scope="scope">
            
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.slot_data.id)">删除</el-button>

          </template>
      </table-list>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>
<script>
import BreadCcrumb from  '../components/BreadCrumb'
import TableList from '../components/Table'
import {getGoods} from '../api/api'
export default {
  name:'GoodList',
  components:{
    'bread-crumb':BreadCcrumb,
    'table-list':TableList
  },
  data(){
    return {
      queryInfo:{
        query:'',
        page:1,
        pagesize:2
      },
      total:0,
      goods:[],
      colums:[
        {
          type:'index',
          label:'#'
        },
        {
          prop:'goodName',
          label:'商品名称'
        },
        {
          prop:'price',
          label:'价格'
        },
        {
          prop:'weight',
          label:'重量'
        },
        {
          prop:'create_time',
          label:'创建时间',
          slotName:'time',
          width:'160px'
        },
        {
          label:'操作',
          slotName:'opts',
          width:'190px'
        }
      ],

    }

  },
  created(){
    this.getAllGoods()
  },
  methods:{
    async getAllGoods(){
      let res= await getGoods(this.queryInfo)
      // console.log(res);
      if(res.status===200){
        this.goods=res.data
        this.total=res.data.length
      }
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getAllGoods()
    },
    handleCurrentChange(newPage){
      this.queryInfo.page=newPage
      this.getAllGoods()
    },
    removeById(id){
      // console.log(id);
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let i=this.goods.findIndex(item=>item.id===id)
          this.goods.splice(i,1)
          this.$message({
            type: 'success',
            message: '删除成功!(未调用接口)'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>