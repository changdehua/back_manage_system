<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  <el-row>
    <el-col :span="24">
      <el-button type="primary">添加角色</el-button>
    </el-col>
  </el-row>


  <el-table :data="roles"
            style="width: 100%"
            stripe
            border
            >
    <el-table-column type="expand"
    width="30px"
    >
    <template slot-scope="scope">
      <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="{'bb':true,'bt':i1===0,'fc':true}">
        <el-col :span="6">
          <el-tag closable @close="deleteAuth(scope.row,item1.id)">{{item1.authName}}</el-tag>
          <span class="el-icon-caret-right"></span>
        </el-col>
        <el-col :span="18">
          <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="{'bb':i2!==(item1.children.length-1)}">
            <el-col :span="6">
              <el-tag type="success" closable @close="deleteAuth(scope.row,item2.id)">{{item2.authName}}</el-tag>
              <span class="el-icon-caret-right"></span>
            </el-col>
            <el-col :span="18">
              <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" class="mr" closable @close="deleteAuth(scope.row,item3.id)">{{item3.authName}}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template> 
    </el-table-column>

    <el-table-column type="index"
                     label="#"
                    > 
    </el-table-column>
    <el-table-column prop="roleName"
                     label="角色名称"
                     >
    </el-table-column>
    <el-table-column prop="roleDesc"
                     label="角色描述"
                     >
    </el-table-column>
    <el-table-column label="操作" width="290px">
      <template slot-scope="scope">
        <div>
          <!-- {{ scope.row }} -->
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="setAuth(scope.row)">分配权限</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!-- 对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setAuthDialogVisible"
      width="50%"
      @close="resetCheckedKeys"
      >
      <el-tree 
        :data="roles" 
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAuthDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getAllRoles} from '@/api/api'
export default {
  name:'Roles',
  data(){
    return {
      roles:[],
      setAuthDialogVisible:false,
      defaultProps:{
        children: 'children',
        label: 'authName'
      },
      checkedKeys:[],
      roleId:''
    }
  },
  methods:{
    async getRoles(){
      let {data:res}=await getAllRoles()
      // console.log(res);
      this.roles=res
    },
    deleteAuth(role,authId){
      // console.log(role);
      // console.log(authId);
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    setAuth(role){
      // console.log(role);
      this.roleId=role.id
      this.keyLeaf(role,this.checkedKeys)
      console.log(this.checkedKeys);
      this.setAuthDialogVisible=true

      // this.$refs.tree.$forceUpdate()

    },
    resetCheckedKeys(){
      this.checkedKeys=[]
    },
    keyLeaf(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }else{
        node.children.forEach(element => {
          this.keyLeaf(element,arr)
        });
      }
    },
    allotAuth(){
      const tree=this.$refs.tree
      const authIds=[
        ...tree.getCheckedKeys(),
        ...tree.getHalfCheckedKeys()
      ]
      console.log(authIds);
    }
  },
  created(){
    this.getRoles()
  }

}
</script>
<style lang="less" scoped>
  .bb{
    border-bottom: 1px solid #eee;
  }
  .bt{
    border-top: 1px solid #eee;
  }
  .el-row{
    padding: 5px 0px;
  }
  .mr{
    margin-right: 6px;
  }
  .fc{
    display: flex;
    align-items: center;
  }
  .el-table{
    min-width: 590px;
  }
</style>