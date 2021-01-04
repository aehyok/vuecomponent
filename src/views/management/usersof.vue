<template>
  <div>
    <div class="banantop">
      <div class="banantop-left">
        <el-select
          v-model="value"
          placeholder="请选择"
          clearable
          @change="dropdownenu"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </div>
      <div class="banantop-right">
        <el-input
          placeholder="请输入姓名/手机号"
          v-model="input"
          clearable
          class="input-with-select"
          style="width:220px;margin-left:10px;"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="form">
      <el-table :data="datalist" border style="width: 100%">
        <el-table-column fixed prop="realName" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column label="行政区域">
          <template slot-scope="scope">
            {{ details.country }}
            {{ scope.row.province }}
            {{ scope.row.city }}
            {{ scope.row.district }}
            {{ scope.row.town }}
            {{ scope.row.village }}
          </template>
        </el-table-column>
        <el-table-column label="上传认证时间">
          <template slot-scope="scope">
            {{ scope.row.submitAuthDateTime | timestampToTime }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <div class="tipsbox">
              <el-tag v-if="scope.row.authStatus === 1" type="info"
                >未认证</el-tag
              >
              <el-tag v-if="scope.row.authStatus === 2" type="warning"
                >审核中</el-tag
              >
              <el-tag v-if="scope.row.authStatus === 3" type="success"
                >认证通过</el-tag
              >
              <el-tag v-if="scope.row.authStatus === 4" type="danger"
                >认证不通过</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row.id)" type="text">
              {{ genButtonText(scope.row.authStatus) }}
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
    <!-- 审核弹窗 -->
    <el-dialog title="认证审核" :visible.sync="centerDialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="details.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input :disabled="true" v-model="details.mobile"></el-input>
        </el-form-item>
        <el-form-item label="行政区域">
          {{ details.province }}
          {{ details.city }}
          {{ details.district }}
          {{ details.town }}
          {{ details.village }}
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            :disabled="true"
            v-for="index in details.experts"
            :label="index.id"
            :value="index.descript"
            :key="index.id"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="身份证正反面">
          <img
            :src="index.idCardFrontImage.url"
            v-for="index in details.experts"
            :label="index.id"
            :key="index.name"
            style="width:100px;margin-right:10px"
          />
          <img
            :src="index.idCardbackImage.url"
            v-for="index in details.experts"
            :label="index.id"
            :key="index.id"
            style="width:100px"
          />
        </el-form-item>
        <el-form-item label="正面照">
          <img
            :src="index.authImage.url"
            v-for="index in details.experts"
            :label="index.id"
            :key="index.id"
            style="width:100px"
          />
        </el-form-item>

        <el-form-item label="审核结果" v-if="display">
          <el-radio-group v-model="form.resource">
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核不通过"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审核结果" v-if="findingsofaudit">
          <el-radio-group v-model="radio">
            <el-radio :label="1">审核通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审核意见" v-if="display">
          <el-input
            type="textarea"
            :autosize="{ maxRows: 8 }"
            resize="none"
            v-model="authReason"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核意见" v-if="findingsofaudit">
          <el-input
            type="textarea"
            v-model="authReason"
            :autosize="{ maxRows: 8 }"
            resize="none"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="display">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  agriculturalExpertsList,
  wechatuserDetail,
  wechatuserAuth,
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
      options: [
        {
          label: '未认证',
        },
        {
          label: '认证中',
        },
        {
          label: '认证通过',
        },
        {
          label: '认证不通过',
        },
      ],
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
      value: '',
      input: '',
      datalist: [],
      page: 1,
      limit: 10,
      total: 0,
      newauthStatus: '',
      newkeyword: '',
      centerDialogVisible: false,
      details: {},
      newid: '',
      authstatus: '',
      display: true,
      findingsofaudit: true,
      radio: 1,
      authReason: '',
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
    this.agriculList()
  },
  methods: {
    genButtonText(authStatus) {
      if (authStatus !== 1) {
        return '详情'
      }
      return '审核'
    },
    agriculList() {
      agriculturalExpertsList({
        authStatus: this.newauthStatus,
        page: this.page,
        limit: this.limit,
        keyword: this.newkeyword,
      }).then(res => {
        this.datalist = res.data.docs
        this.total = res.data.total
      })
    },
    // 分页
    pagination() {
      this.agriculList()
    },
    dropdownenu() {
      if (this.value === '未认证') {
        this.newauthStatus = 1
      }
      if (this.value === '认证中') {
        this.newauthStatus = 2
      }
      if (this.value === '认证通过') {
        this.newauthStatus = 3
      }
      if (this.value === '认证不通过') {
        this.newauthStatus = 4
      }
      if (this.value === '') {
        this.newauthStatus = ''
      }
      this.page = 1
      this.agriculList()
    },
    search() {
      this.newkeyword = this.input
      this.page = 1
      this.agriculList()
    },
    // 审核按钮
    handleClick(id) {
      this.newid = id
      this.form.desc = ''
      this.form.resource = ''
      this.centerDialogVisible = true
      wechatuserDetail({
        id: this.newid,
      }).then(res => {
        this.details = res.data
        var newarr = this.details.experts
        newarr.forEach(index => {
          this.authReason = index.authReason
          if (index.authStatus === 3) {
            this.display = false
            this.findingsofaudit = true
          } else {
            this.display = true
            this.findingsofaudit = false
          }
        })
      })
    },
    // 提交按钮
    Submit() {
      if (this.form.resource === '审核通过') {
        this.authstatus = 3
      }
      if (this.form.resource === '审核不通过') {
        this.authstatus = 4
      }
      if (this.form.resource === '') {
        this.authstatus = ''
      }
      wechatuserAuth({
        id: this.newid,
        type: 1,
        authReason: this.authReason,
        authStatus: this.authstatus,
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '提交成功',
            type: 'success',
          })
          this.centerDialogVisible = false
          this.agriculList()
        }
      })
    },
  },
}
</script>

<style scoped>
.banantop {
  width: 100%;
  height: 55px;
}
.banantop-left {
  float: left;
}
.banantop-right {
  float: right;
}
</style>
