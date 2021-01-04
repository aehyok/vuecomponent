<template>
  <div>
    <div class="controlbox">
      <span>审核状态：</span>
      <el-select
        v-model="auditStatus"
        placeholder="请选择"
        class="mgr20"
        @change="auditChange"
      >
        <el-option
          v-for="(item, index) in auditStatusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>时间范围：</span>
      <el-date-picker
        class="mgr20"
        v-model="seldate"
        type="daterange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
      >
      </el-date-picker>
      <el-input
        style="width: 300px"
        placeholder="请输入消息名称"
        v-model="keyword"
        class="input-with-select"
        @keypress.native.enter="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search" />
      </el-input>
    </div>
    <div class="mart20">
      <!-- 审核中 -->
      <UnderReview
        :list="list"
        v-if="auditStatus === 2"
        v-loading="isLoading"
        @getDetail="getDetail"
      />
      <!-- 审核通过 -->
      <PassReview
        :list="list"
        v-if="auditStatus === 3"
        v-loading="isLoading"
        @getDetail="getDetail"
      />
      <!-- 审核不通过 -->
      <noPassReview
        :list="list"
        v-if="auditStatus === 4"
        v-loading="isLoading"
        @getDetail="getDetail"
      />
    </div>
    <Pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
    <component
      :is="componentName"
      :visible.sync="visible"
      :source="detail"
      thisType="detail"
      setTitle="栏目内容审核"
      @saved="resetPageAndFetch"
      @closed="closedBtn"
    >
      <template v-if="auditStatus === 2">
        <el-form :model="auditForm" label-width="120px" :rules="auditFormRules">
          <el-form-item label="审核结果：" prop="auditStatus">
            <el-radio-group v-model="auditForm.auditStatus">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="4">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见：" prop="textarea">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="auditForm.textarea"
              resize="none"
              :autosize="{
                minRows: 3,
                maxRows: 6,
              }"
            />
          </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
          <el-button @click="closedBtn">取消</el-button>
          <el-button type="primary" @click="postAuditData">确定</el-button>
        </div>
      </template>
    </component>
  </div>
</template>

<script>
import UnderReview from './underReview'
import PassReview from './passReview'
import noPassReview from './nopassReview'
import { getFormatList, auditFormatPost } from '@/services/columnReview'
// import { getContentDetail } from '@/services/columnIssued'
import Pagination from '@/components/Pagination'
import PictureLayout from '@/views/columnContentIssued/PictureLayout'
import PictureListLayout from '@/views/columnContentIssued/PictureListLayout'
import VideoLayout from '@/views/columnContentIssued/VideoLayout'
import ImageTextLayout from '@/views/columnContentIssued/ImageTextLayout'
import TextListLayout from '@/views/columnContentIssued/TextListLayout'
import InvestigateLayout from '@/views/columnContentIssued/InvestigateLayout'
import { getAuditRecordDetail } from '@/services/audit'
export default {
  components: {
    UnderReview,
    PassReview,
    noPassReview,
    Pagination,
    PictureLayout,
    PictureListLayout,
    VideoLayout,
    ImageTextLayout,
    TextListLayout,
    InvestigateLayout,
  },
  computed: {
    componentName() {
      const componentMap = {
        2: 'PictureLayout',
        3: 'VideoLayout',
        4: 'ImageTextLayout',
        5: 'TextListLayout',
        6: 'PictureListLayout',
        7: 'InvestigateLayout',
      }
      return componentMap[this.columnLayout]
    },
  },
  data() {
    return {
      id: '',
      auditForm: {
        auditStatus: 3, // 审核状态  3审核通过，4审核不通过
        textarea: '',
      },
      auditFormRules: {
        auditStatus: [{ required: true, message: '请选择' }],
      },
      visible: false,
      isLoading: false,
      columnLayout: -1,
      auditStatus: 2, // 1待审核，2审核中，3审核通过，4审核不通过
      auditStatusList: [
        { label: '审核中', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核不通过', value: 4 },
      ],
      seldate: null, // 时间范围
      keyword: '',
      detail: {},
      page: 1,
      limit: 10,
      total: 0,
      list: [],
    }
  },
  methods: {
    closedBtn() {
      this.detail = {}
      this.id = ''
      this.name = name
      this.visible = false
      this.auditForm.auditStatus = 3
      this.auditForm.textarea = ''
    },
    // 提交审核结果
    async postAuditData() {
      console.log(this.auditStatus)
      const res = await auditFormatPost({
        id: this.id,
        contentId: this.contentId,
        name: this.name,
        auditStatus: this.auditForm.auditStatus,
        auditReason: this.auditForm.textarea,
      })
      if (res.code === 200) {
        // this.$message.success('数据提交成功')
        this.$message({
          duration: 1200,
          message: '提交成功',
          type: 'success',
        })

        this.getList()
        this.closedBtn()
      }
      console.log(res)
    },
    async getDetail({ id, name }) {
      // this.detail = row
      this.id = id
      this.name = name
      const loading = this.$loading({
        background: 'transpanrent',
      })
      // const res = await getContentDetail({ id })

      const res = await getAuditRecordDetail({ id })
      // if (auditStatus === 2) {
      //   res = await getContentDetail({ id })
      // } else {
      //   res = await getAuditRecordDetail({ id })
      // }

      loading.close()
      if (res.code === 200) {
        this.detail = res.data.afterContent || {}
        this.contentId = this.detail.id
        this.columnLayout =
          this.detail.contentType || this.detail.formatType || ''
        this.visible = true
        console.log('columnLayout: ' + this.columnLayout)
      }
    },
    resetPageAndFetch() {
      this.getList()
    },
    search() {
      this.page = 1
      this.getList()
    },
    auditChange() {
      console.log(this.auditStatus)
      this.page = 1
      this.seldate = null
      this.keyword = ''
      this.getList()
    },
    timeChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.isLoading = true
      const res = await getFormatList({
        auditStatus: this.auditStatus, // 审核状态  1待审核，2审核中，3审核通过，4审核不通过
        page: 1,
        limit: 10,
        keyword: this.keyword,
        beginDateTime: this.seldate ? this.seldate[0] : '', // 开始日期
        endDateTime: this.seldate ? this.seldate[1] : '', // 结束日期
      })
      if (res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
      this.isLoading = false
      console.log(res)
    },
    pagination() {
      this.getList()
      console.log(this.page, this.limit)
    },
  },
  created() {
    this.getList()
  },
}
</script>

<style lang="scss" scoped>
.mgr20 {
  margin-right: 20px;
}
.mart20 {
  margin-top: 20px;
}
.controlbox {
  text-align: right;
}
</style>
