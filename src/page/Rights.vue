<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table
        :data="rights"
        stripe
        style="width: 100%"
        border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-tag v-if="scope.row.level===0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level===1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level===2">三级</el-tag>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {getAllRights} from '../api/api'
export default {
  name:'Rights',
  created(){
    this.getRights()
  },
  methods:{
    async getRights(){
      let {data:res}=await getAllRights('list')
      // console.log(res);
      this.rights=res
      
    }
  },
  data(){
    return {
      rights:[]
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>