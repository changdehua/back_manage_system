<template>
  <el-container>
    <el-header>
      <h3>后台管理系统</h3>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleMenus">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router>
          <el-submenu :index="item.id+''" v-for="(item, index) in menusList" :key="index">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="(subItem) in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import {menus} from '../api/api'
export default {
  name:'Home',
  data(){
    return {
      menusList:[],
      iconObj:{
        "125":'el-icon-s-check',
        "127":'el-icon-lock',
        "129":'el-icon-goods',
        "130":'el-icon-notebook-1',
        "139":'el-icon-s-data',
      },
      isCollapse:false
    }
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    getMenus(){
      menus().then(data=>{
        // console.log(data);
        this.menusList=data.menus
      })
    },
    toggleMenus(){
      this.isCollapse=!this.isCollapse
    }
  },
  created(){
    this.getMenus()
  }
}
</script>
<style lang="less" scoped>
  .el-container{
    height: 100%;
    .el-header{
      background-color: #B3C0D1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-aside{
      background-color: #D3DCE6;
      .el-menu{
        border-right: none;
      } 
    }
    .el-main{
      background-color: #E9EEF3;
    }
    .toggle-button{
      background-color: rgb(166, 172, 177);
      text-align: center;
      cursor: pointer;
      font-size: 18px;
      color:#fff
    }
  }
</style>