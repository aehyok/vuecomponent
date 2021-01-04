<template>
  <div>
    <el-form>
    <FormView
     :columnList="formListItem"
     :formData="formData"
     />
     </el-form>
  </div>
</template>
<script>
import FormView from '@/components/input/formView'
export default {
  components: {
    FormView,
  },
  data() {
    return {
      // Form表单自定义列表
      formListItem: [
        {columnName: 'name',type: 'string',title: '栏目名称', order: 10},
        {columnName: 'total',type: 'number',title: '栏目数量', order: 20 },
        {columnName: 'createDate',type: 'date',title: '栏目创建日期', order: 30 },
      ],
      formData: {
        name: '主菜单栏目',
        total: 35,
        createDate: Date.now(),
      },
    }
  },
}
</script>
<style scoped>

</style>
