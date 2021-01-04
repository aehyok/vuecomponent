<template>
  <div>
    <div class="controlbox">
      <el-button
        type="primary"
        class="let-bottons"
        @click="addSysParam"
        v-permission="'create'"
      >
        新增参数
      </el-button>
      <el-input
        style="width: 300px"
        placeholder="请输入参数/参数描述"
        v-model="keyword"
        class="input-with-select"
        @keypress.native.enter="searchBtn"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchBtn"
        ></el-button>
      </el-input>
    </div>
    <div style="margin-top: 20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column prop="paramName" label="参数"></el-table-column>
        <el-table-column prop="paramValue" label="参数值"></el-table-column>
        <el-table-column prop="paramDesc" label="参数描述"></el-table-column>
        <el-table-column label="应用范围">
          <template slot-scope="scope">{{
            ['运营支撑平台', 'EPG'][scope.row.usage - 1]
          }}</template>
        </el-table-column>
        <el-table-column label="运营商">
          <template slot-scope="scope">{{
            ['电信', '移动', '联通'][scope.row.serviceProvider - 1]
          }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getDetail(scope.row, 'edit')"
              v-permission="'update'"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :page.sync="page"
        :limit.sync="limit"
        :total="total"
        @pagination="pagination"
      ></Pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="diaTit"
      :visible.sync="dialogTableVisible"
      @close="resetForm('form')"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        v-loading="dialogLoading"
      >
        <el-form-item prop="id" style="display: none;"></el-form-item>
        <el-form-item label="参数：" prop="paramName">
          <el-input v-model="form.paramName" v-if="dioType !== 1"></el-input>
          <span v-else>{{ form.paramName }}</span>
        </el-form-item>
        <el-form-item label="参数值：" prop="paramValue">
          <el-input v-model="form.paramValue" v-if="dioType !== 1"></el-input>
          <span v-else>{{ form.paramValue }}</span>
        </el-form-item>
        <el-form-item label="参数描述：" prop="paramDesc">
          <el-input
            v-model="form.paramDesc"
            type="textarea"
            resize="none"
            v-if="dioType !== 1"
          />
          <span v-else>{{ form.paramDesc | noData }}</span>
        </el-form-item>
        <el-form-item label="应用范围：" prop="usage">
          <el-select v-model="form.usage">
            <el-option label="运营支撑平台" :value="1"></el-option>
            <el-option label="EPG" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="应用运营商："
          prop="serviceProvider"
          v-if="form.usage === 2"
        >
          <el-select v-model="form.serviceProvider">
            <el-option
              v-for="i in operatorList"
              :key="i.id"
              :value="i.operatorId"
              :label="i.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { systemparameter, systemparameterSave } from '@/services/systemManage'
import { getOperatorList } from '@/services/iptv'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      dialogLoading: false,
      id: '', // 当前打开的ID
      isLoading: false,
      dialogTableVisible: false,
      diaTit: '添加参数',
      keyword: '',
      tableData: [],
      operatorList: [],
      form: {
        id: '',
        paramName: '', // 参数
        paramValue: '', // 参数值
        paramDesc: '', // 参数描述
        usage: '',
        serviceProvider: '',
      },
      rules: {
        paramName: [{ required: true, message: '请输入参数', trigger: 'blur' }],
        usage: [{ required: true, message: '请选择应用范围' }],
        paramValue: [
          { required: true, message: '请输入参数值', trigger: 'blur' },
        ],
      },
      page: 1,
      limit: 10,
      total: 0,
    }
  },
  computed: {
    dioType() {
      console.log(this.diaTit, 'dioType')
      if (this.diaTit === '查看参数') {
        return 1
      } else {
        return 2
      }
    },
  },
  filters: {
    noData(val) {
      if (val.length > 0) {
        return val
      } else {
        return '--'
      }
    },
  },
  methods: {
    // 新增参数
    addSysParam() {
      this.diaTit = '添加参数'
      this.dialogTableVisible = true
      this.dialogLoading = false
    },
    // 获取详情
    getDetail(row) {
      this.dialogTableVisible = true
      setTimeout(() => {
        this.form = {
          id: row.id,
          paramName: row.paramName,
          paramValue: row.paramValue,
          paramDesc: row.paramDesc,
          usage: row.usage,
          serviceProvider: row.serviceProvider,
        }
      }, 100)
    },
    // 提交数据
    async postData() {
      const data = {
        ...this.form,
      }
      if (this.id) {
        data.id = this.id
      }
      const res = await systemparameterSave({
        ...data,
      })
      if (res.code === 200) {
        if (this.id) {
          this.$message.success('修改成功')
        } else {
          this.$message.success('添加成功')
        }
        this.resetForm('form')
        this.system()
      }
      console.log(res)
    },
    async getOperators() {
      try {
        const res = await getOperatorList({ page: 1, limit: 10000 })
        this.operatorList = res.data.docs
      } catch (error) {
        console.error(error)
      }
    },
    // 获取列表信息
    async system() {
      this.isLoading = true
      const res = await systemparameter({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        sort: {
          createdAt: -1,
        },
      })
      if (res.code === 200) {
        this.tableData = res.data.docs
        this.total = res.data.total
      }
      this.isLoading = false
    },
    searchBtn() {
      this.page = 1
      this.system()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogTableVisible = false
      this.id = ''
    },
    pagination(val) {
      this.system()
    },
  },
  created() {
    this.system()
    this.getOperators()
  },
}
</script>

<style lang="scss" scoped>
.controlbox {
  text-align: right;
  &:after {
    content: ' ';
    clear: both;
  }
}
.let-bottons {
  float: left;
}
</style>
