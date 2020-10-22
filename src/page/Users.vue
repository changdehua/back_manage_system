<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
            <el-button type="primary" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end" :enterable="false">
              <el-button type="primary" icon="el-icon-s-tools" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pageContainer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="100"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      </div>
    </el-card>

<!-- 添加user对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="65px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div class="add_form_btns">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
        </div>
    </el-dialog>


  <!-- 修改user对话框 -->
      <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="65px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>

        </el-form>
        <div class="add_form_btns">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
    </el-dialog>

  <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      >
      <p>姓名:{{userInfo.username}}</p>
      <p>角色:{{userInfo.role_name}}</p>
      <p>分配角色:
        <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {users,userStateChange,addOneUser,getOneUser,editOneUser,deleteOneUser,getAllRoles} from '../api/api'

export default {
  name:'Users',
  data(){
    var checkEmail = (rule, value, callback)=>{
      let reg=/([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}/
      if(!reg.test(value)){
        return callback(new Error('邮箱规则不正确'))
      }else{
        callback()
      }
    };
    var checkMobile = (rule, value, callback)=>{
      let reg=/^1(3|4|5|7|8)\d{9}$/
      if(!reg.test(value)){
        return callback(new Error('手机规则不正确'))
      }else{
        callback()
      }

    };
    return {
      setRoleDialogVisible:false,
      userInfo:{},
      roleId:'',
      userId:'',
      roles:[],
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      userList:[],
      total:0,
      dialogVisible:false,
      editDialogVisible:false,
      addForm:{
        username:'',
        email:'',
        mobile:'',
        password:''
      },
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur'},
        ]
      },
      editForm:{
        username:'',
        id:'',
        email:'',
        mobile:''
      },
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],

      }
    }
  },
  methods:{
    getUsers(){
      users(this.queryInfo).then(({data})=>{
        // console.log(data);
        this.userList=data.users
        this.total=data.total
      })
    },
    async edit(id){
      // alert(id)
      // console.log(id);
      this.editDialogVisible=true
      this.$nextTick().then(res=>{
        console.log(this.$refs.editFormRef.resetFields());
      })
      let {data:res}=await getOneUser(id)
      // console.log(res);
      this.editForm=res
    },
    handleSizeChange(size){
      // console.log(size);
      this.queryInfo.pagesize=size
      this.getUsers()
    },
    handleCurrentChange(curPage){
      this.queryInfo.pagenum=curPage
      this.getUsers()
      // console.log(curPage);
    },
    async userStateChange(userObj){
      // console.log(userObj);
      let res=await userStateChange(userObj)
      // console.log(res);
      if(res.status!==200){
        this.$message({
          message:'更新失败',
          type:'error'
        })
      }
    },
    addUser(formName){
      this.$refs[formName].validate(async valid=>{
        if(valid){
          // console.log('done');
          let res=await addOneUser(this.addForm)
          // console.log(res);
          if(res.status!==200){
            this.$message({
              message:'添加失败',
              type:'error'
            })
          }else{
            this.dialogVisible=false
            this.getUsers()
          }
        }else{
          console.log('error');
          return false
        }
      })
    },
    editUser(){
      this.$refs.editFormRef.validate(async valid=>{
        // console.log(valid);
        if(!valid){
          return false
        }
        let res = await editOneUser(this.editForm.id,this.editForm)
        // console.log(res);
        if(res.status===200){
          this.editDialogVisible=false
          this.getUsers()
        }
      })
    },
    deleteUser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let res= await deleteOneUser(id)
        // console.log(res);
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    async setRole(user){
      this.setRoleDialogVisible=true
      // console.log(user);
      this.userInfo=user
      this.userId=user.id
      let {data:res} = await getAllRoles()
      // console.log(res);
      this.roles=res
      
    },
    changeRole(){
      this.setRoleDialogVisible = false
      const req_data={
        userId:this.userId,
        roleId:this.roleId
      }
      console.log(req_data);
      this.roleId=''
      this.userInfo={}

    }
    
  },
  created(){
    this.getUsers()
  }
}
</script>
<style lang="less">
  .pageContainer{
    display: flex;
    justify-content: flex-end;
  }
  .add_form_btns{
    display:flex;
    justify-content:flex-end;
  }
  .el-dialog p{
    margin: 5px 0px;
  }
</style>