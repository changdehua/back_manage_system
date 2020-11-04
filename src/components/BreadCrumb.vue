<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{path1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{path2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  props:{
    path1:{
      type:String,
      default:''
    },
    path2:{
      type:String,
      default:''
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>