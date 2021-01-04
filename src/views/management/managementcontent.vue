<template>
  <div>
    <div class="head">
      <div class="Label-left" style="float:left;margin-bottom:20px;">
        内容类型：<el-select
          v-model="contenttype"
          clearable
          placeholder="请选择"
          style="margin-right:10px;"
          @change="contenttypeselectedvalue(contenttype)"
        >
          <el-option
            v-for="item in options1"
            :key="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        状态：<el-select
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
            style="width:202px;margin-left:10px;"
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

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="title" label="内容标题"></el-table-column>
      <el-table-column label="内容类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type == '1'">图片</p>
          <p v-if="scope.row.type == '2'">视频</p>
        </template>
      </el-table-column>
      <el-table-column prop="createdByName" label="上传人"></el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          {{ scope.row.createdDateTime | timestampToTime }}
        </template>
      </el-table-column>
      <!-- 1 TV上线，2运营商审核中 3运营商审核不通过，4用户删除，5业务审核中，6业务审核不通过 status-->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div class="tipsbox">
            <el-tag v-if="scope.row.status === 1" type="success"
              >已上线TV端</el-tag
            >
            <el-tag v-if="scope.row.status === 2" type="warning"
              >运营商审核中</el-tag
            >
            <el-tag v-if="scope.row.status === 3" type="danger"
              >运营商审核不通过</el-tag
            >
            <el-tag v-if="scope.row.status === 4" type="danger"
              >用户删除</el-tag
            >
            <el-tag v-if="scope.row.status === 5" type="warning"
              >业务审核中</el-tag
            >
            <el-tag v-if="scope.row.status === 6" type="danger"
              >业务审核不通过</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="公众号阅读数"></el-table-column>
      <el-table-column prop="commentCount" label="评论数"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="formdetails(scope.row.id)"
            v-permission="'detail'"
            >详情</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="tabledelete(scope.row.id)"
            v-permission="'delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :page.sync="page"
      :limit.sync="limit"
      :total="total"
      @pagination="pagination"
    />
    <!-- 详情弹窗 -->
    <el-dialog title="内容详情" :visible.sync="dialogVisible" width="25%">
      <el-form label-position="right" label-width="110px">
        <el-form-item label="内容标题">
          <el-input v-model="details.title" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            type="textarea"
            v-model="details.text"
            :autosize="{ maxRows: 8 }"
            :disabled="true"
            resize="none"
          ></el-input>
        </el-form-item>
        <div class="Pictureofdetails" style="width:100%">
          <el-form-item v-if="picture" label="图片">
            <img
              v-show="picture"
              v-for="index in newimg"
              :label="index.name"
              :src="index.url"
              :key="index.id"
              style="width:100px;"
            />
          </el-form-item>
          <el-form-item v-if="video" label="视频">
            <video
              v-show="video"
              ref="elememt"
              v-for="index in newvideo"
              :label="index.name"
              :src="index.url"
              :key="index.id"
              controls
              style="width:100%;"
              preload="metadata"
            ></video>
          </el-form-item>
        </div>
        <el-form-item label="状态" style="margin-top:10px">
          <el-input v-model="details.status" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="业务审核意见">
          <el-input v-model="details.auditRemark" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="运营商审核意见">
          <el-input
            type="textarea"
            v-model="details.operatorAuditRemark"
            :autosize="{ maxRows: 8 }"
            :disabled="true"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 详情弹窗 /-->
    <!-- 删除弹窗 -->
    <el-dialog title="删除" :visible.sync="dialogVisibl" width="25%">
      <el-form>
        <el-form-item label="删除原因">
          <el-input
            type="textarea"
            v-model.trim="Reasonfordeletion"
            :autosize="{ maxRows: 10 }"
            style="width:82%"
            placeholder="请输入删除原因，将在公众号展示给内容发布者"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibl = false">取 消</el-button>
        <el-button type="primary" @click="Areyousuretodelete">删 除</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 /-->
  </div>
</template>

<script>
import {
  Datalist,
  articleDetail,
  articleRemove,
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
      Reasonfordeletion: '',
      dialogVisibl: false,
      newvalue: '',
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      deleteID: '',
      contenttype: '',
      isLoading: true,
      state: '',
      details: '',
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
      //  <!-- 1 TV上线，2运营商审核中 3运营商审核不通过，4用户删除，5业务审核中，6业务审核不通过 status-->
      options: [
        {
          label: '已上线TV端',
        },
        {
          label: '运营商审核中',
        },
        {
          label: '运营商审核不通过',
        },
        {
          label: '用户删除',
        },
        {
          label: '业务审核中',
        },

        {
          label: '业务审核不通过',
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
      articleId: '',
      newimg: [],
      picture: '',
      video: '',
      newvideo: [],
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
    this.DataPageinitialization()
  },
  methods: {
    DataPageinitialization() {
      Datalist({
        page: this.page,
        limit: this.limit,
        type: this.type,
        status: this.status,
        keyword: this.keyword,
        beginDate: this.starttime,
        endDate: this.endtime,
        category: 1, // 1农机达人，2村友圈
      }).then(res => {
        this.tableData = res.data.docs
        this.total = res.data.total
      })
      this.isLoading = true
    },
    // 分页
    pagination() {
      this.DataPageinitialization()
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
    // 内容类型选中的值
    contenttypeselectedvalue(contenttype) {
      if (contenttype === '图文') {
        this.type = 1
      } else if (contenttype === '视频') {
        this.type = 2
      } else {
        this.type = ''
      }
      this.page = 1
      this.DataPageinitialization()
      this.isLoading = true
    },
    // 状态选中的值

    //  <!-- 1 TV上线，2运营商审核中 3运营商审核不通过，4用户删除，5业务审核中，6业务审核不通过 status-->

    statusselectedvalue(state) {
      if (state === '已上线TV端') {
        this.status = 1
      } else if (state === '运营商审核中') {
        this.status = 2
      } else if (state === '运营商审核不通过') {
        this.status = 3
      } else if (state === '用户删除') {
        this.status = 4
      } else if (state === '业务审核中') {
        this.status = 5
      } else if (state === '业务审核不通过') {
        this.status = 6
      } else {
        this.status = ''
      }
      this.page = 1
      this.DataPageinitialization()
    },
    // 表格详情按钮
    formdetails(id) {
      this.articleId = id
      this.dialogVisible = true
      articleDetail({
        id: this.articleId,
      }).then(res => {
        this.details = res.data
        if (res.data.type === 2) {
          this.picture = false
          this.video = true
          this.newvideo = res.data.videos
        } else if (res.data.type === 1) {
          this.picture = true
          this.video = false
          this.newimg = res.data.images
        }
        // 1 TV上线，2运营商审核中3运营商审核不通过，4用户删除，5业务审核中，6业务审核不通过
        if (this.details.status === 1) {
          this.details.status = '已上线TV端'
        } else if (this.details.status === 2) {
          this.details.status = '运营商审核中'
        } else if (this.details.status === 3) {
          this.details.status = '运营商审核不通过'
        } else if (this.details.status === 4) {
          this.details.status = '用户删除'
        } else if (this.details.status === 5) {
          this.details.status = '业务审核中'
        } else if (this.details.status === 6) {
          this.details.status = '业务审核不通过'
        } else if (this.details.status === '') {
          this.details.status = ''
        }
      })
    },
    // 表格删除按钮
    tabledelete(id) {
      this.dialogVisibl = true
      this.deleteID = id
    },
    // 确定删除
    Areyousuretodelete() {
      articleRemove({
        id: this.deleteID,
        sysDeleteReason: this.Reasonfordeletion,
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.dialogVisibl = false
          this.DataPageinitialization()
        }
      })
    },
  },
}
</script>

<style scoped></style>
