<template>
  <div class="login">
    <div class="login_box">
      <div class="avator">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form status-icon ref="ruleForm" label-width="0px" class="demo-ruleForm" :model="formData" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input type="text" autocomplete="off" placeholder="用户名" prefix-icon="el-icon-user-solid" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" autocomplete="off" placeholder="密码" prefix-icon="el-icon-lock" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<script>
import {login} from '../api/api'
export default {
  name:'Login',
  data(){
    return {
      formData:{
        username:'admin',
        password:'123456'
      },
      loginFormRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    resetForm(refName){
      this.$refs[refName].resetFields()
    },
    submitForm(refNanme){
      this.$refs[refNanme].validate(async valid=>{
        // console.log(valid);
        if(!valid){
          return false
        }else{
          // console.log(login);
          let data= await login(this.formData)
          // console.log(data);
          if(data.status===200){
            // this.$message({
            //   message:'登陆成功',
            //   type:'success'
            // })
            window.sessionStorage.setItem('token',data.token)
            this.$router.push('/home')
          }
          
        }
      })
    }
  }
  
}
</script>
<style lang="less" scoped>
.login{
    height: 100%;
    background-color: #2b4b6b;
    .login_box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .avator{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        box-shadow: 0 0 6px #ddd;
        border-radius: 50%;
        padding: 8px;
        position: absolute;
        left: 50%;
        transform :translate(-50%,-50%);
        background-color: #fff;
        img{
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
          border: 1px solid #eee;
        }
      }
      .demo-ruleForm{
        width: 100%;
        position: absolute;
        bottom: 0px;
        padding: 0px 20px;
        .btns{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>