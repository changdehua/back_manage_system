<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="警告提示的文案"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>

        <el-row class="good_cate_ops">
          <el-col>
            <span>选择商品分类: </span>
            <el-cascader
              v-model="selectedCates"
              :options="goodCates"
              :props="cateProps"
              @change="handleChange"
              clearable>
            </el-cascader>
          </el-col>
        </el-row>

        <!-- tab切换 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="additionBtnDisabled" @click="addParamsDialogVisible=true">添加参数</el-button>
            <el-table
              :data="manyParams"
              style="width: 100%"
              border
              strip>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div>
                    <!-- {{ scope.row }} -->
                    <el-tag closable v-for="(item, index) in scope.row.attr_val" :key="index"
                      @close="handleClose(index,scope.row.attr_val)"
                    >{{item}}</el-tag>

                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      clearable
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                      
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
              type="index"
              label="#">
              </el-table-column>
              <el-table-column
                prop="cateName"
                label="参数名称"
                >
              </el-table-column>
              <el-table-column
              label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsDialog(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete"  @click="deleteParams(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="additionBtnDisabled" size="mini" @click="addParamsDialogVisible=true">添加属性</el-button>
            <el-table
              :data="onlyParams"
              style="width: 100%"
              border
              strip>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div>
                    <!-- {{ scope.row }} -->
                    <el-tag v-for="(item, index) in scope.row.attr_val" :key="index" closable>{{item}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                  </div>
                </template>
              </el-table-column>
              <el-table-column
              type="index"
              label="#">
              </el-table-column>
              <el-table-column
                prop="cateName"
                label="属性名称"
                >
              </el-table-column>
              <el-table-column
              label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParamsDialog(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>
    </el-card>


    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+dialogText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClose"
      >
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsRuleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item :label="dialogText+'名称'" prop="para_name">
          <el-input v-model="addParamsForm.para_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+dialogText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsDialogClose"
      >
      <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsRuleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item :label="dialogText+'名称'" prop="para_name">
          <el-input v-model="editParamsForm.para_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {getAllCates,getCateByIdAndType} from '../api/api'
export default {
  name:'GoodParams',
  data(){
    return {
      goodCates:[],
      selectedCates:[],
      cateProps:{
        expandTrigger: 'hover',
        label:'cateName',
        value:'id'
      },
      activeName:'many',
      manyParams:[],
      onlyParams:[],
      addParamsDialogVisible:false,
      editParamsDialogVisible:false,
      addParamsForm:{
        para_name:''
      },
      addParamsFormRules:{
        para_name:{ required: true, message: '请输入参数名称', trigger: 'blur' },
      },
      editParamsForm:{
         para_name:''
      },
      editParamsFormRules:{
        para_name:{ required: true, message: '请输入参数名称', trigger: 'blur' },
      },
      attr_id:'',
      // inputVisible:false,
      // inputValue:''
    }
  },
  methods:{
    async getCates(){
      let res=await getAllCates()
      if(res.status===200){
        this.goodCates=res.data
      }
    },
    handleChange(val){
      this.getCateParams()

    },
    handleClick(tab,e){
      this.getCateParams()
    },
    async getCateParams(){
      if(this.selectedCates.length<3){
        this.selectedCates=[]
        this.manyParams=[]
        this.onlyParams=[]
        return
      }
      let res= await getCateByIdAndType({
        id:this.selectedId,
        type:this.activeName
      })
      // console.log(res);
      res.data.forEach(element => {
        element.attr_val=element.attr_val===""?[]:element.attr_val.split(' ')
        element.inputVisible=false
        element.inputValue=''
      });
      // console.log(res);

      // console.log(this.activeName);
      if(this.activeName==='many'){
        this.manyParams=res.data
        // console.log(res.data);
      }else if(this.activeName==='only'){
        this.onlyParams=res.data
      }

    },
    addParamsDialogClose(){
      this.$refs.addParamsRuleForm.resetFields()
    },
    addParams(){
      this.$refs.addParamsRuleForm.validate(valid=>{
        if(!valid){
          return
        }else{
          const datas={
            id:this.selectedId,
            attr:this.addParamsForm.para_name
          }
          console.log(datas);
          this.addParamsDialogVisible=false
          this.getCateParams()
        }
      })
    },
    editParamsDialogClose(){
      this.$refs.editParamsRuleForm.resetFields()
    },
    editParams(){
      this.$refs.editParamsRuleForm.validate(valid=>{
        if(!valid){
          return
        }else{
          const data={
            body:{
              prop_name:this.editParamsForm.para_name,
              attr_type:this.activeName
            },
            id:this.selectedId,
            attrId:this.attr_id

          } 
          console.log(data); 
          this.$message({
            message:'修改成功',
            type:'success'
          }) 
          this.editParamsDialogVisible=false
          this.getCateParams()    
        }
      })
    },
    editParamsDialog(item){
      // console.log(item);
      this.editParamsDialogVisible=true
      this.attr_id=item.id
      let data={
        id:this.selectedId,
        attr_id:this.attr_id,
        type:this.activeName
      }
      this.editParamsForm.para_name=item.cateName
      // console.log(data);
    },
    deleteParams(item){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data={
            id:this.selectedId,
            attr_id:item.id,
            type:this.activeName
          }
          console.log(data);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleInputConfirm(item){
      item.inputVisible = false
      if(item.inputValue.trim().length===0){
        item.inputValue=''
        item.inputVisible=false
        return
      }
      item.attr_val.push(item.inputValue)

      // 调用接口
      const data={
        cateId:this.selectedId,
        attr_id:item.id,
        attr_val:item.inputValue
      }
      console.log(data);
      item.inputValue=''
      item.inputVisible=false
      this.$message({
        message:'新增成功',
        type:'success'
      })

    },
    showInput(item){
      item.inputVisible=true
      this.$nextTick()
      .then(res=>{
        this.$refs.saveTagInput.focus()
      })
    },
    handleClose(i,attr_val){
      // console.log(i);
      // console.log(attr_val);
      attr_val.splice(i,1)
      // console.log(attr_val);
      this.$message({
        message:'删除成功(未调用接口)',
        type:'success'
      })
    }
  },
  created(){
    this.getCates()
  },
  computed:{
    additionBtnDisabled(){
      return this.selectedCates.length !== 3
    },
    selectedId(){
      if(this.selectedCates.length===3){
        return this.selectedCates[this.selectedCates.length-1]
      }else{
        return null
      }
    },
    dialogText(){
      if(this.activeName==='many'){
        return '参数'
      }else if(this.activeName==='only'){
        return '属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .good_cate_ops{
    margin:15px 0;
  }
  .el-tag{
    margin: 0px 5px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
