<template>
  <div>
    <div class="head">
      <div class="Label-left" style="float:left;margin-bottom:20px;">
        审核状态：<el-select
          v-model="state"
          clearable
          placeholder="请选择"
          @change="statusselectedvalue(state)"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>
      <div class="Label-right" style="float:right">
        <div class="block">
          <span class="demonstration">时间范围：</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            clearable
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px;margin-left:10px;"
            @change="dateselectedvalue"
          >
          </el-date-picker>
          <el-input
            placeholder="请输入内容标题"
            v-model="input3"
            clearable
            class="input-with-select"
            style="width:208px;margin-left:10px;"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </div>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column fixed prop="title" label="内容标题"></el-table-column>
      <el-table-column label="内容类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type == '1'">图片</p>
          <p v-if="scope.row.type == '2'">视频</p>
        </template>
      </el-table-column>
      <el-table-column prop="createdByName" label="提交者"></el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{ scope.row.createdDateTime | timestampToTime }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <div class="tipsbox">
            <el-tag v-if="scope.row.auditStatus === 1" type="info"
              >未提交审核</el-tag
            >
            <el-tag v-if="scope.row.auditStatus === 2" type="warning"
              >审核中</el-tag
            >
            <el-tag v-if="scope.row.auditStatus === 3" type="success"
              >审核通过</el-tag
            >
            <el-tag v-if="scope.row.auditStatus === 4" type="danger"
              >审核不通过</el-tag
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="auditByName"
        label="审核人"
        v-if="hidecolumns"
      ></el-table-column>
      <el-table-column label="审核时间" v-if="hidecolumns"
        ><template slot-scope="scope">
          {{ scope.row.auditDateTime | timestampToTime }}
        </template></el-table-column
      >
      <el-table-column
        prop="auditRemark"
        label="审核意见"
        v-if="hidecolumns"
      ></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="formdetails(scope.row.id)"
            v-if="scope.row.auditStatus === 2"
            >审核</el-button
          >
          <el-button
            type="text"
            @click="formdetails(scope.row.id)"
            v-if="scope.row.auditStatus === 3 || scope.row.auditStatus === 4"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
    <!-- 详情弹窗 -->
    <el-dialog title="内容详情" :visible.sync="dialogVisible" width="25%">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="内容标题">
          <el-input v-model="details.title" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            type="textarea"
            v-model="details.text"
            :disabled="true"
            resize="none"
            :autosize="{ maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" v-if="picture">
          <img
            v-for="index in newimg"
            :label="index.name"
            :src="index.url"
            :key="index.id"
            style="width:100px;margin:10px"
          />
        </el-form-item>
        <el-form-item label="视频" v-if="newvideo">
          <video
            ref="elememt"
            controls
            :src="video"
            style="width:100%;"
            preload="metadata"
          ></video>
        </el-form-item>
        <el-form-item label="审核状态：" v-if="Auditstatus">
          <el-radio-group v-model="form.resource">
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核不通过"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见：" v-if="Auditstatus">
          <el-input
            type="textarea"
            v-model="auditopinion"
            resize="none"
            :autosize="{ maxRows: 8 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="Auditstatus">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="Submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  toexamine,
  articleDetail,
  articleAudit,
} from '@/services/agriculturalexperts'
import Pagination from '@/components/Pagination'
import { format } from 'date-fns'
export default {
  components: {
    Pagination,
  },
  name: 'managementcontent',
  data() {
    return {
      input: '',
      dialogVisible: false,
      newvalue: '',
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      contenttype: '',
      picture: false,
      newvideo: false,
      toexamine: false,
      todetails: false,
      video: '',
      state: '审核中',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      options: [
        // {
        //   label: '未提交审核',
        // },
        {
          label: '审核中',
        },
        {
          label: '审核通过',
        },
        {
          label: '审核不通过',
        },
      ],
      options1: [
        {
          label: '图文',
        },
        {
          label: '视频',
        },
      ],
      value: '',
      value1: '',
      input3: '',
      type: '',
      auditStatus: '',
      starttime: '',
      endtime: '',
      keyword: '',
      details: {},
      Auditstatus: false,
      hidecolumns: false,
      newimg: [],
      articleId: '',
      SubmitStatus: '',
      auditopinion: '',
      loading: false,
    }
  },
  filters: {
    timestampToTime(val) {
      if (!val) {
        return ''
      }
      return format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
    },
  },
  created() {
    this.auditStatus = 2
    this.bydefault()
  },
  methods: {
    // 默认选中审核中请求的数据
    bydefault() {
      toexamine({
        page: this.page,
        limit: this.limit,
        auditStatus: this.auditStatus,
        keyword: this.keyword,
        beginDate: this.starttime,
        endDate: this.endtime,
      }).then(res => {
        this.loading = true
        if (res.code === 200) {
          this.loading = false
          this.tableData = res.data.docs
          this.total = res.data.total
        }
      })
    },
    DataPageinitialization() {
      toexamine({
        page: this.page,
        limit: this.limit,
        auditStatus: this.auditStatus,
        keyword: this.keyword,
        beginDate: this.starttime,
        endDate: this.endtime,
      }).then(res => {
        this.tableData = res.data.docs
        this.total = res.data.total
        this.tableData.forEach(res => {
          if (res.auditStatus === 1 || res.auditStatus === 2) {
            this.toexamine = true
            this.todetails = false
          }
          if (res.auditStatus === 3 || res.auditStatus === 4) {
            this.toexamine = false
            this.todetails = true
          }
        })
      })
    },
    // 分页
    pagination() {
      this.DataPageinitialization()
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false
    },
    // 日期选中的值
    dateselectedvalue() {
      if (this.value1 === null) {
        this.starttime = ''
        this.endtime = ''
        this.page = 1
        this.DataPageinitialization()
      } else {
        this.starttime = this.value1[0]
        this.endtime = this.value1[1]
        this.page = 1
        this.DataPageinitialization()
      }
    },
    // 搜索按钮
    search() {
      this.keyword = this.input3
      this.page = 1
      this.DataPageinitialization()
    },
    // 状态选中的值
    statusselectedvalue(state) {
      if (state === '未提交审核') {
        this.auditStatus = 1
        this.hidecolumns = false
      } else if (state === '审核中') {
        this.auditStatus = 2
        this.hidecolumns = false
      } else if (state === '审核通过') {
        this.auditStatus = 3
        this.hidecolumns = true
      } else if (state === '审核不通过') {
        this.auditStatus = 4
        this.hidecolumns = true
      } else {
        this.auditStatus = ''
        this.hidecolumns = false
      }
      this.page = 1
      this.DataPageinitialization()
    },
    // 详情提交
    Submit() {
      if (this.form.resource === '未提交审核') {
        this.SubmitStatus = 1
      } else if (this.form.resource === '审核中') {
        this.SubmitStatus = 2
      } else if (this.form.resource === '审核通过') {
        this.SubmitStatus = 3
      } else if (this.form.resource === '审核不通过') {
        this.SubmitStatus = 4
      } else {
        this.SubmitStatus = ''
      }
      articleAudit({
        id: this.articleId,
        auditStatus: this.SubmitStatus,
        auditRemark: this.auditopinion,
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            duration: 1200,
            message: '提交成功',
            type: 'success',
          })
          this.dialogVisible = false
          this.DataPageinitialization()
        }
      })
    },
    // 表格详情按钮
    formdetails(id) {
      this.articleId = id
      this.dialogVisible = true
      articleDetail({
        id: this.articleId,
      }).then(res => {
        this.details = res.data
        this.newimg = res.data.images
        this.auditopinion = res.data.auditRemark
        if (res.data.auditStatus === 1 || res.data.auditStatus === 2) {
          this.Auditstatus = true
        }
        if (res.data.auditStatus === 3 || res.data.auditStatus === 4) {
          this.Auditstatus = false
        }
        if (res.data.type === 1) {
          this.picture = true
          this.newvideo = false
        } else if (res.data.type === 2) {
          this.picture = false
          this.newvideo = true
          this.video = res.data.videos[0].url
        }
      })
    },
  },
}
</script>

<style scoped></style>
