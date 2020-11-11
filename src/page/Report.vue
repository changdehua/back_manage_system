<template>
  <div>
    <bread-crumb
    path1='数据统计'
    path2='数据报表'
    ></bread-crumb>

    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from  '@/components/BreadCrumb'
import echarts from 'echarts'
import {getReports} from '../api/api'
import _ from 'lodash'
export default {
  name:'Report',
  data(){
    return {
      option : {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: []
        },
        yAxis: {
          type:'value'
        },
        series: [{
            name: '销量',
            type: 'bar',
            data: []
        }]
      },
      new_option:{}
    }
  },
  components:{
    'bread-crumb':BreadCrumb
  },
  async mounted(){
    let myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(this.option);

    let res= await getReports()

    myChart.setOption({
            series: [{
              data: res.data.series  //将异步请求获取到的数据进行装载
            }],
            xAxis:[{
              data:res.data.xAxis
            }]
          });
    

    
  },
  methods:{
    async getRep(){
      let res= await getReports()
      return res
    }
  },
  created(){
  },
  watch:{
    ['option.xAxis'](val){
      // console.log(val);
    },
    ['option.series'](val){
      // console.log(val);
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>