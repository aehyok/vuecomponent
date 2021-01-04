<template>
  <div>
    <div class="controlbox">
      <el-button
        type="primary"
        class="let-bottons"
        @click="add"
        v-permission="'create'"
      >
        新增图片
      </el-button>
      <el-input
        style="width: 300px"
        placeholder="请输入参数/参数描述"
        v-model="keyword"
        class="input-with-select"
        @keypress.native.enter="resetPageAndFetch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="resetPageAndFetch"
        />
      </el-input>
    </div>
    <div style="margin-top: 20px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column prop="name" label="参数"></el-table-column>
        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <img
              height="50"
              :src="scope.row.url"
              :alt="scope.row.name"
              v-if="scope.row.url"
            />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark | noData }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
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
      />
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogTableVisible"
      @close="resetForm('form')"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="参数" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="id" style="display:none;"></el-form-item>
        <el-form-item label="图片上传" prop="image">
          <div style="z-index:99999">
            <!-- <p style="color: #999;">不超过20张,不超过2M</p> -->
            <PictureGroup
              :receivefatData="form.image"
              @remove="form.image = []"
              @add="getChannelImgData"
            />
          </div>
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" resize="none" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PictureGroup from '@/components/pictureGroup'
import { pictureList, savePicture } from '@/services/systemManage'
import { getOperatorList } from '@/services/iptv'

export default {
  components: {
    Pagination,
    PictureGroup,
  },
  filters: {
    noData(val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    },
  },
  data() {
    return {
      isLoading: false,
      keyword: '',
      tableData: [],
      operatorList: [],
      dialogTableVisible: false,
      form: {
        id: '',
        name: '',
        image: [],
        usage: '',
        serviceProvider: '',
        remark: '',
      },
      rules: {
        name: [{ required: true, message: '请输入参数名称' }],
        image: [{ required: true, message: '请选择图片' }],
        serviceProvider: [{ required: true, message: '请选择应用运营商' }],
        usage: [{ required: true, message: '请选择应用范围' }],
      },
      page: 1,
      limit: 10,
      total: 0,
    }
  },
  computed: {
    title() {
      return this.form.id ? '编辑图片' : '添加图片'
    },
  },
  methods: {
    add() {
      this.dialogTableVisible = true
    },
    async getOperators() {
      try {
        const res = await getOperatorList({ page: 1, limit: 10000 })
        this.operatorList = res.data.docs
      } catch (error) {
        console.error(error)
      }
    },
    // 编辑
    edit(row) {
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.form = {
          id: row.id,
          name: row.name,
          usage: row.usage,
          image: [{ id: row.image, url: row.url }],
          remark: row.remark,
          serviceProvider: row.serviceProvider,
        }
      })
    },
    // 获取列表
    async pictureList() {
      this.isLoading = true
      const res = await pictureList({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        sort: { createdAt: -1 },
      })
      if (res.code === 200) {
        this.total = res.data.total
        this.tableData = res.data.docs
      } else {
        this.$message.error(res.message)
      }
      this.isLoading = false
    },
    pagination() {
      this.pictureList()
    },
    resetPageAndFetch() {
      this.page = 1
      this.pictureList()
    },
    getChannelImgData(data) {
      this.form.image = data
    },
    submitForm(formName) {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const res = await savePicture({
          ...this.form,
          image: this.form.image[0].id,
        })
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.dialogTableVisible = false
          this.pictureList()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  created() {
    this.pictureList()
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
