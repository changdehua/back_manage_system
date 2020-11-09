<template>
  <div>
    <el-table
    :data="tableData"
    :border="border"
    >
      <el-table-column v-for="(item,i)  in columsWithoutSlot" :key="i"
        :prop="item.prop"
        :label="item.label"
        :type="item.type"
        :width="item.width"
      >
      
      </el-table-column>

      <el-table-column v-for="(item1,i1)  in columsWithSlot" :key="(i1*-1)-1"
        :prop="item1.prop"
        :label="item1.label"
        :type="item1.type"
        :width="item1.width"
      >
        <template slot-scope="scope">
          <div>
            <!-- {{ scope.row }} -->
            <slot :name="item1.slotName" :slot_data="scope.row">
            <!-- {{scope.row}} -->
            </slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props:{
    tableData:{
      type:Array,
      default(){
        return []
      }
    },
    colums:{
      type:Array,
      default(){
        return [
          {
            prop:'',
            label:'',
            width:'',
            slotName:'',
            type:''
          }
        ]
      }
    },
    type:{
      type:String,
      default:'index'
    },
    border:{
      type:Boolean,
      default:true
    }
  },
  computed:{
    columsWithSlot(){
      return this.colums.filter(item=>item.slotName)
    },
    columsWithoutSlot(){
      return this.colums.filter(item=>!item.slotName)
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>