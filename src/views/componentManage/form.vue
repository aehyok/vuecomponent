<template>
  <div>
    <el-form
     :model="formData"
     label-width="120px"
     ref="refForm">
      <FormView
      :columnList="formListItem"
      :formData="formData"
      />
     </el-form>
      <el-row>
        <el-button
          size="large"
          type="primary"
          style="margin-left: 120px;height: 50px;"
          @click="submitFormClick"
          native-type="submit"
        >
          提交
        </el-button>
      </el-row>
  </div>
</template>
<script>
import FormView from '@/components/input/formView'
import { getContentTypeList } from '@/mock/api'
export default {
  components: {
    FormView,
  },
  created(){
    getContentTypeList().then(res=>{
      console.log(res.data,'res.data.form')
    })
    // 回调函数中实现需要的功能
    window.addEventListener(
      'popstate',
      function(e) {
        console.log('rssss', e)
        alert('我监听到了浏览器的返回按钮事件啦')
      },
      false,
    )
  },
  methods:{
    submitFormClick(){
      this.$refs.refForm.validate(valid => {
        if (valid) {
          console.log(valid,'this.valid')
        }
        else {
          this.$message.warning('请完善相关数据')
          console.log(valid,'验证失败')
        }
        return false
      })
    },
  },
  data() {
    return {
      formListItem: [
        {
          name: 'name1',
          type: 'string',
          title: '栏目标题',
        },
        {
          name: 'name',
          type: 'string',
          title: '栏目名称',
          required: true,  // 必填
        },
        {
          name: 'total',
          type: 'number',
          title: '栏目数量',
          required: true,
        },
        {
          name: 'count',
          type: 'number',
          title: '浏览数量',
        },
        {
          name: 'createDate',
          type: 'date',
          title: '栏目创建日期',
        },
        {
          name: 'type',
          type: 'radio',
          title: '栏目类型',
          codeTable: 'categoryType',
        },
        {
          name: 'range',
          type: 'checkbox',
          title: '发布范围',
          required: true,
        },
        {
          name:'dateRange',
          type:'dateRange',
          title: '日期范围',
        },
        {
          name: 'content',
          type: 'textarea',
          title: '内容',
        },
        {
          name: 'creType',
          type: 'select',
          title: '证件类型',
        },
        {
          name: 'creImage',
          type: 'image',
          title: '证件上传',
        },
      ],
      formData: {
        name1: '主菜单栏目',
        name: '',
        total: null,
        count: null,
        createDate: 1606730360386,
        type: 1,
        creType:'',
        range: [],
      },
    }
  },
}
</script>
<style scoped>

</style>
