<template>
  <div>
    <bread-crumb :path1="'订单管理'" :path2="'订单列表'"></bread-crumb>
    <el-card>
        <el-row>
            <el-col :span="12">
              <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
        </el-row>

        <table-list
        :tableData="orders"
        :colums="colums">
          <template v-slot:is_send="scope">
            <div>
              <!-- {{ scope.slot_data.is_send}} -->
              <el-tag size="medium" type="success" v-if="scope.slot_data.is_send">已发货</el-tag>
              <el-tag size="medium" type="danger" v-else>未发货</el-tag>
            </div>
          </template>
          <template v-slot:pay_status="scope">
            <div>
              <!-- {{ scope.slot_data }} -->
              <el-tag size="medium" type="success" v-if="scope.slot_data.pay_status===1">已付款</el-tag>
              <el-tag size="medium" type="danger" v-else>未付款</el-tag>

            </div>
          </template>
          <template v-slot:opts="scope">
            <div>
              <!-- {{ scope.slot_data }} -->
              <el-button type="primary" icon="el-icon-edit" @click="edit(scope.slot_data)"></el-button>
              <el-button type="success" icon="el-icon-location" @click="prcDetail(scope.slot_data)"></el-button>
            </div>
          </template>
        </table-list>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editOrderDialogVisible"
      width="50%"
      @close="handleClose">
      <el-form :model="editOrderForm" :rules="editOrderRules" ref="editOrderRef" label-position="left" label-width="80px">
        <el-form-item label="省/市" prop="address1">
          <el-cascader
            v-model="editOrderForm.address1"
            :options="cities"
            :props="cascaderProps"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editOrderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 参看进度对话框 -->

    <el-dialog
      title="物流进度"
      :visible.sync="processDialogVisible"
      width="50%"
      >

        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logis"
            :key="index"
            :timestamp="activity.time"
            :color="'#0bbd87'">
            {{activity.context}}
          </el-timeline-item>
    </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from  '@/components/BreadCrumb'
import TableList from '@/components/Table'
import {getOrders,getproCities,getLogistics} from '../api/api'
export default {
  name:'Order',
  data(){
    return {
      queryInfo:{
        query:'',
        page:1,
        pagesize:2
      },
      total:0,
      orders:[],
      colums:[
        {
          type:'index',
          label:'#'
        },
        {
          label:'订单编号',
          prop:'order_num'
        },
        {
          label:'订单价格',
          prop:'order_price'
        },
        {
          label:'下单时间',
          prop:'create_time'
        },
        {
          label:'是否发货',
          prop:'is_send',
          slotName:'is_send'
        },
        {
          label:'是否付款',
          prop:'pay_status',
          slotName:'pay_status'

        },
        {
          label:'操作',
          slotName:'opts'
        }
      ],
      editOrderDialogVisible:false,
      editOrderForm:{
        address1:[],
        address2:''
      },
      editOrderRules:{
        address1:[
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cities:[],
      cascaderProps:{
        expandTrigger: 'hover',
        value:'id',
        label:'name'
      },
      processDialogVisible:false,
      logis:[]
    }
  },
  components:{
    'bread-crumb':BreadCrumb,
    'table-list':TableList
  },
  created(){
    this.getAllOrders()
  },
  methods:{
    async getAllOrders(){
      let res= await getOrders(this.queryInfo)
      // console.log(res);
      this.orders=res.data
      this.total=res.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getAllOrders()

    },
    handleCurrentChange(newPage){
      this.queryInfo.page=newPage
      this.getAllOrders()
    },
    handleClose(){
      // this.editOrderDialogVisible=true
      // this.editOrderForm.address1=[]
      this.$refs.editOrderRef.resetFields()
    },
    async edit(item){
      this.editOrderDialogVisible=true
      // console.log(item.order_id)
      let res=await getproCities(item.order_id)
      // console.log(res);
      this.cities=res.data
    },
    async prcDetail(item){
      this.processDialogVisible=true
      // console.log(item);
      let res=await getLogistics({
        id:item.order_id
      })

      // console.log(res);
      this.logis=res.data
    }
  }

}
</script>
<style lang="less" scoped>
  
</style>