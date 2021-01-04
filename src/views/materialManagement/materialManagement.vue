<template>
  <div>
    <div class="">
      <div class="dsa">
        <el-form inline class="filter-options">
          <el-button type="primary" @click="addtoo()" v-permission="'create'"
            >添加素材</el-button
          >
          <el-button
            type="success"
            @click="oexamine()"
            v-permission="'submitAudit'"
            >批量提交审核
          </el-button>
          <el-button @click="showpopup()">素材标签</el-button>
          <div class="buttonright" style="float:right">
            <el-select
              v-model="value2"
              placeholder="审核状态"
              style="margin-left:10px;"
              clearable
              @change="toexamine(value2)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="value3"
              placeholder="素材类型"
              style="margin-left:10px;"
              clearable
              @change="Materialtype(value3)"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-form-item>
              <el-input
                class="search"
                clearable
                placeholder="素材名称"
                style="width:250px;margin-left:10px;"
                v-model="aterialnam"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="filterChange()"
                />
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-table
          v-loading="loading"
          :data="data"
          border
          style="width: 100%;"
          @selection-change="changeFun"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column fixed prop="name" label="素材名称">
          </el-table-column>
          <el-table-column label="图片" prop="url">
            <template slot-scope="scope">
              <img :src="scope.row.thumbnail" />
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <p v-if="scope.row.fileType == '1'">图片</p>
              <p v-if="scope.row.fileType == '2'">视频</p>
            </template>
          </el-table-column>
          <el-table-column label="大小">
            <template slot-scope="scope">
              <p>{{ scope.row.byteSize | formsize }}</p>
            </template>
          </el-table-column>
          <el-table-column label="标签">
            <template slot-scope="scope">
              <p>{{ scope.row.tags.join(',') }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="添加人员"> </el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              {{ scope.row.createdAt | timestampToTime }}
            </template>
          </el-table-column>
          <el-table-column label="运营商审核状态">
            <template slot-scope="scope">
              <div class="tipsbox">
                <el-tag
                  v-if="scope.row.auditStatus === 1"
                  type="info"
                  @click="openHistBox(scope.row)"
                  >未提交审核</el-tag
                >
                <el-tag
                  v-if="scope.row.auditStatus === 2"
                  type="warning"
                  @click="openHistBox(scope.row)"
                  >审核中</el-tag
                >
                <el-tag
                  v-if="scope.row.auditStatus === 3"
                  type="success"
                  @click="openHistBox(scope.row)"
                  >审核通过</el-tag
                >
                <el-tag
                  v-if="scope.row.auditStatus === 4"
                  type="danger"
                  @click="openHistBox(scope.row)"
                  >审核不通过</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                v-permission="'detail'"
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >详情</el-button
              >
              <el-button
                v-permission="'submitAudit'"
                type="text"
                size="small"
                v-if="scope.row.auditStatus == '1'"
                @click="oexaminee(scope.row.id)"
                >提交审核</el-button
              >
              <el-button
                v-permission="'delete'"
                type="text"
                size="small"
                @click="Tabledeletion(scope.row.id)"
                >删除</el-button
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
      </div>
    </div>
    <!-- 标签弹窗 -->
    <el-dialog
      title="素材标签"
      :visible.sync="dialogVisib"
      width="30%"
      top="40vh"
    >
      <el-checkbox-group v-model="checkedCities">
        <el-checkbox
          v-for="(item, index) in labellabel"
          :label="item"
          :key="index"
          :value="item.id"
          @change="Selectt()"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="open()">新建标签</el-button>
        <el-button type="primary" @click="screen()">筛选</el-button>
        <el-button type="primary" @click="deletet()">删除</el-button>
      </span>
      <div style="margin-top:20px;"></div>
    </el-dialog>
    <!-- 添加素材弹窗 -->
    <el-dialog title="本地上传" :visible.sync="dialogVisi" width="50%">
      <div class="view" style="min-height:200px">
        <el-upload
          class="upload-demo"
          ref="upload"
          :headers="{
            Authorization: token,
          }"
          :action="upLoadUrl"
          :on-change="onChange"
          :on-remove="handleRemove"
          list-type="picture"
          :on-success="succes"
          multiple
          :file="fileList"
          isMaterial="true"
          :auto-upload="false"
          :on-exceed="handleExceed"
          accept=".jpg,.JPG,.png,.PNG,.gif,.GIF,.mp4,.MP4,.ts,.TS,.avi,.AVI,"
          :limit="10"
          :file-list="fileList"
          show-file-list
          :data="formData"
        >
          <el-button slot="trigger" size="small" type="primary" v-show="Addfile"
            >添加文件</el-button
          >
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
            v-show="upload"
            >上传</el-button
          >
          <el-tag v-show="uploadLogo == '1'">上传中</el-tag>
          <p style="float:right;width:75%">
            最多支持添加10个文件，图片仅支持jpg/png/gif格式，且每张图片不超过 2M
            ；视频仅支持mp4/ts/avi格式，且不超过1G
          </p>
        </el-upload>
        <div v-show="progressFlag" class="head-img">
          <el-progress
            :text-inside="true"
            :stroke-width="14"
            :percentage="progressPercent"
            status="success"
          ></el-progress>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="选择运营商审核"
      :visible.sync="dialogVisibl"
      width="30%"
      top="40vh"
    >
      <el-checkbox-group v-model="checkedCitie">
        <div>
          <el-radio v-model="newradio" label="1" @change="newwhole"
            >全部</el-radio
          >
          <el-radio v-model="newradio" label="2" @change="newpart"
            >部分</el-radio
          >
        </div>
        <div v-if="display1" style="margin-top:20px">
          <el-checkbox
            v-for="(item, index) in Operatorlist"
            :label="item.operatorId"
            :key="index"
          >
            {{ item.name }}
          </el-checkbox>
        </div>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Submitforreview()"
          >提交审核</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="素材详情"
      class="dialog"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div class="el-dialog-div">
        <div class="detailsleft">
          <img :src="newimages" id="imgg" @load="huhkj" v-show="imgggg" />
          <video
            ref="elememt"
            :src="myImg"
            v-show="imggg"
            controls
            style="width:85%;"
            preload="metadata"
          ></video>
          <!-- <img :src="" v-show="tsimg" /> -->
          <p v-if="newTips">ts/avi格式的视频暂不支持播放</p>
        </div>
        <div class="detailsright">
          <div style="height:90%;margin-bottom:20px">
            <el-form
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item label="素材名称" prop="name">
                <el-input v-model="detailss.name" style="width:70%;"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="region">
                <el-input
                  v-model="detailss.auditStatus"
                  style="width:70%;"
                  :disabled="edit"
                ></el-input>
              </el-form-item>
              <el-form-item label="素材类型" prop="region">
                <el-input
                  v-model="detailss.fileType"
                  style="width:70%;"
                  :disabled="edit"
                ></el-input>
              </el-form-item>
              <el-form-item label="素材标签" prop="dhsjh">
                <el-select
                  v-model="materiallabel"
                  placeholder="请选择标签"
                  style="width:70%;margin-right:2%"
                  clearable
                >
                  <el-option
                    v-for="index in Newarray"
                    :label="index.name"
                    :value="index.name"
                    :key="index.id"
                  ></el-option>
                </el-select>
                <el-button type="success" @click="detailspagenewtab()"
                  >新建标签</el-button
                >
              </el-form-item>
              <el-form-item label="分辨率" v-if="DistinguishLV">
                <el-input
                  style="width:70%;"
                  v-model="resolvingpower"
                  :disabled="edit"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="修改时间">
                <p>{{ time }}</p>
              </el-form-item>
              <el-form-item label="大小" prop="name">
                {{ byteSize | formsize }}
              </el-form-item>
              <el-form-item label="添加者" prop="name">
                <el-input
                  style="width:70%;"
                  v-model="detailss.createdBy"
                  :disabled="edit"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="desc" style="width:78%;">
                <el-input
                  type="textarea"
                  v-model="detailss.remark"
                  maxlength="100"
                  resize="none"
                  :autosize="{ maxRows: 5 }"
                  placeholder="请输入备注，不超过100个字符"
                >
                  {{ detailss.remark }}
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer" style="float:right">
            <el-button @click="cancell()">取 消</el-button>
            <el-button type="primary" @click="determinee(newwwid)"
              >确 定</el-button
            >
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { format } from 'date-fns'
import formatBytes from '@/utils/formatBytes'
import {
  Materiallist,
  Querytag,
  Newmaterial,
  Labelmaterialdeletion,
  Operatorlist,
  Submitforreview,
  Formdetails,
  Preservationofdetails,
  Tabledeletion,
} from '@/services/sourcemateria'
export default {
  components: {
    Pagination,
  },
  name: 'materialManagement',
  data() {
    return {
      formData: {
        isMaterial: true,
      },
      edit: true,
      rules: {
        desc: [{ max: 100, message: '最多支持100个字符', trigger: 'blur' }],
      },
      page: 1,
      limit: 10,
      total: 0,
      byteSize: '',
      aterialnam: '',
      keyword: '',
      upLoadUrl: '',
      data: [],
      upload: true,
      Addfile: true,
      dialogVisi: false,
      dialogVisib: false,
      visible: false,
      loading: false,
      input: '',
      IDarray: [],
      newradio: '1',
      display1: false,
      auditStatus: '',
      filters: {
        status: '',
      },
      fileList: [],
      progressFlag: false,
      setState: '',
      checkedCities: [],
      checkedCitie: [],
      progressPercent: 0,
      tableData: [],
      options: [
        {
          value: '未提交审核',
        },
        {
          value: '审核中',
        },
        {
          value: '审核通过',
        },
        {
          value: '审核不通过',
        },
      ],
      options1: [
        {
          value: '图片',
        },
        {
          value: '视频',
        },
      ],
      value1: '',
      value2: '',
      value3: '',
      resolvingpower: '',
      popup: 0,
      ids: '',
      popupp: 0,
      tags: [],
      token: '',
      uploadLogo: 0,
      labellabel: [],
      materiallabel: '',
      imggg: 0,
      filetype: '',
      newauditstatus: '',
      imgggg: 1,
      time: '',
      Operatorlist: [],
      dialogVisible: false,
      dialogVisibl: false,
      newid: '',
      newname: '',
      Newarray: [],
      newimages: '',
      DistinguishLV: true,
      newTips: false,
      myImg: '',
      newwwid: '',
      detailss: {},
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
    }
  },
  filters: {
    timestampToTime(val) {
      return format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
    },
    formsize(val) {
      return formatBytes(val)
    },
  },
  created() {
    this.Materiallist()
  },
  methods: {
    Querytag() {
      Querytag({}).then(res => {
        this.Newarray = res.data
      })
    },
    // 表格删除
    Tabledeletion(id) {
      this.$confirm(
        '删除后，已被应用在其他地方的素材不会删除，但后续将无法使用该素材',
        '是否删除素材',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        Tabledeletion({
          ids: id,
        }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.Materiallist()
          }
        })
      })
    },
    Materiallist() {
      Materiallist({
        page: this.page,
        limit: this.limit,
        keyword: this.aterialname,
        tags: this.tags,
        auditStatus: this.auditStatus,
        type: this.fileType,
        serviceProviders: this.checkedCitie,
      }).then(res => {
        this.loading = true
        if (res.code === 200) {
          this.loading = false
          this.data = res.data.docs
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 表格复选框选中
    changeFun(val) {
      this.multipleSelectio = val
      var newaa = this.multipleSelectio
      var newcc = []
      for (var value of newaa) {
        newcc.push(value.id)
        this.newauditstatus = value.auditStatus
      }
      this.dhsaj = newcc
    },
    pagination() {
      this.Materiallist()
    },
    // 审核状态
    toexamine(value2) {
      if (value2 === '未提交审核') {
        this.auditStatus = 1
      } else if (value2 === '审核中') {
        this.auditStatus = 2
      } else if (value2 === '审核通过') {
        this.auditStatus = 3
      } else if (value2 === '审核不通过') {
        this.auditStatus = 4
      } else if (value2 === '') {
        this.auditStatus = ''
      }
      this.tags = []
      this.page = 1
      this.Materiallist()
    },
    // 素材标签选中值的id
    Selectt() {
      var newaa = this.checkedCities
      var newcc = []
      var jij = []
      for (var i = 0; i < newaa.length; i++) {
        var newdd = newaa[0].id
        var newee = newaa[0].name
        newcc.push(newdd)
        jij.push(newee)
      }
      this.newid = newcc
      this.newname = jij
    },
    // 素材类型
    Materialtype(value) {
      if (value === '图片') {
        this.fileType = 1
      } else if (value === '视频') {
        this.fileType = 2
      } else if (value === '') {
        this.fileType = ''
      }
      this.tags = []
      this.page = 1
      this.Materiallist()
    },
    // 批量审核
    oexamine() {
      this.dialogVisibl = true
      this.checkedCitie = []
      this.display1 = false
      this.newradio = '1'
      console.log(this.checkedCitie)
      Operatorlist({}).then(res => {
        this.Operatorlist = res.data.docs
        this.Operatorlist.forEach(item => {
          this.checkedCitie.push(item.operatorId)
        })
      })
    },
    // 运行商审核全部
    newwhole() {
      this.display1 = false
    },
    newpart() {
      this.display1 = true
    },
    // 表格按钮审核
    oexaminee(id) {
      this.dialogVisibl = true
      this.checkedCitie = []
      Operatorlist({}).then(res => {
        this.Operatorlist = res.data.docs
        this.Operatorlist.forEach(item => {
          this.checkedCitie.push(item.operatorId)
        })
      })
      this.dhsaj = id
    },
    // 运营商提交审核
    Submitforreview() {
      if (this.dhsaj === undefined) {
        this.$message({
          message: '请选择需要提交审核的数据',
          type: 'warning',
        })
        this.dialogVisibl = false
        return false
      }
      if (this.newradio === '2') {
        if (this.checkedCitie.length === 0) {
          this.$message({
            message: '需要选择至少一个运营商',
            type: 'warning',
          })
          this.dialogVisibl = true
          return false
        }
      }
      if (this.newradio === '1') {
        this.checkedCitie = []
      }
      if (this.newauditstatus === 3) {
        this.$message({
          message: '已经审核通过的无需再次提交审核,请重新选择',
          type: 'warning',
        })
        this.dialogVisibl = false
        this.dhsaj = ''
        this.Materiallist()
        return false
      }
      Submitforreview({
        ids: this.dhsaj,
        operatorIds: this.checkedCitie,
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '提交审核成功',
            type: 'success',
          })
          this.Materiallist()
          this.dialogVisibl = false
          this.dhsaj = ''
        }
      })
    },
    filterChange() {
      this.aterialname = this.aterialnam
      this.tags = []
      this.Materiallist()
    },
    succes() {
      this.$message({
        message: '上传成功',
        type: 'success',
      })
      this.Materiallist()
      this.dialogVisi = false
    },
    showpopup() {
      this.dialogVisib = true
      this.checkedCities = []
      Querytag({}).then(res => {
        this.labellabel = res.data
      })
    },
    huhkj() {
      const image = new Image()
      image.src = this.myImg
      image.onload = () => {
        this.resolvingpower = image.width + '*' + image.height
      }
    },

    // 表格详情按钮
    handleClick(row) {
      this.dialogVisible = true
      this.Querytag()
      Formdetails({
        id: row.id,
      }).then(res => {
        if (res.data.extname === '.mp4') {
          this.imggg = 1
          this.imgggg = 0
          this.newTips = false
          this.DistinguishLV = true
        } else if (res.data.extname === '.ts' || res.data.extname === '.avi') {
          this.imgggg = 1
          this.imggg = 0
          this.DistinguishLV = false
          this.newTips = true
        } else {
          this.imgggg = 1
          this.imggg = 0
          this.newTips = false
          this.DistinguishLV = true
        }
        const myvObj = document.createElement('video')
        myvObj.src = res.data.url
        var that = this
        myvObj.addEventListener('canplay', function() {
          that.resolvingpower = this.videoWidth + '*' + this.videoHeight
        })
        this.materiallabel = res.data.tags.toString()
        this.myImg = res.data.url
        this.newimages = res.data.thumbnail
        this.detailss = res.data
        this.byteSize = res.data.byteSize
        this.time = format(new Date(res.data.createdAt), 'yyyy-MM-dd HH:mm:ss')
        if (this.detailss.auditStatus === 1) {
          this.detailss.auditStatus = '未提交审核'
        } else if (this.detailss.auditStatus === 2) {
          this.detailss.auditStatus = '审核中'
        } else if (this.detailss.auditStatus === 3) {
          this.detailss.auditStatus = '审核通过'
        } else {
          this.detailss.auditStatus = '拒绝审核'
        }
        if (this.detailss.fileType === 1) {
          this.detailss.fileType = '图片'
        } else {
          this.detailss.fileType = '视频'
        }
        this.newwwid = this.detailss.id
      })
    },
    myFunction() {},
    // 表格详情取消按钮
    cancell() {
      this.dialogVisible = false
    },
    // 表格详情确认关闭按钮
    determinee(newwwid) {
      Preservationofdetails({
        id: newwwid,
        tags: [this.materiallabel],
        name: this.detailss.name,
        remark: this.detailss.remark,
      }).then(res => {
        if (res.code === 200) {
          this.dialogVisible = false
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.Materiallist()
        }
      })
    },
    // 新建标签
    open() {
      this.$prompt('标签名称', '新建标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value.trim().length > 10) {
          this.$message.error('标签名称字数不得大于10个')
        } else {
          Newmaterial({
            name: value.trim(),
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.showpopup()
            }
          })
        }
      })
    },

    // 详情页面新建标签
    detailspagenewtab() {
      this.$prompt('标签名称', '新建标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value.trim().length > 10) {
          this.$message.error('标签名称字数不得大于10个')
        } else {
          Newmaterial({
            name: value.trim(),
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.materiallabel = value.trim()
              this.Querytag()
            }
          })
        }
      })
    },

    // 筛选
    screen() {
      this.tags = this.newname
      this.dialogVisib = false
      this.Materiallist()
    },
    // 删除
    deletet() {
      Labelmaterialdeletion({
        ids: this.newid,
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.dialogVisib = false
          this.Materiallist()
        }
      })
    },
    // 添加弹窗显示与隐藏
    addtoo() {
      this.dialogVisi = true
      this.uploadLogo = 0
      // this.popupp = 1
      this.handleRemove()
      var token = localStorage
        .getItem('loginInfo')
        .split('token')[1]
        .split(':')[1]
        .split(',')[0]
        .split('"')[1]
      this.token = token
      const prefix = process.env.NODE_ENV === 'development' ? '/infra' : ''
      // var consol = true
      this.upLoadUrl = `${prefix}/api/console/system/upload`
      // ?isMaterial=${consol}`
    },
    onChange(file, fileList) {
      const fileformat = file.name.split('.')[file.name.split('.').length - 1]
      const picturefile =
        fileformat === 'jpg' ||
        fileformat === 'png' ||
        fileformat === 'gif' ||
        fileformat === 'mp4' ||
        fileformat === 'ts' ||
        fileformat === 'avi'
      const picturefilesize = file.size / 1024 / 1024 < 2
      const videosize = file.size < 1048576
      if (!picturefile) {
        this.$message.error(
          '上传的文件格式不是jpg/png/gif/mp4/ts/avi格式,重新上传',
        )
        file = null
        fileList = []
        this.$refs.upload.clearFiles()
        return false
      } else if (
        fileformat === 'jpg' ||
        fileformat === 'png' ||
        fileformat === 'gif'
      ) {
        if (!picturefilesize) {
          this.$message.error('上传的图片文件不得大于2M')
          file = null
          fileList = []
          this.$refs.upload.clearFiles()
          return false
        } else if (
          fileformat === 'mp4' ||
          fileformat === 'ts' ||
          fileformat === 'avi'
        ) {
          if (!videosize) {
            this.$message.error('上传的视频文件不得大于1G')
            file = null
            fileList = []
            this.$refs.upload.clearFiles()
            return false
          }
        }
      }
      this.Addfile = true
      this.upload = true
      this.fileList = fileList
    },
    // 添加素材 上传事件
    submitUpload(fileList) {
      if (this.fileList === undefined || this.fileList.length === 0) {
        this.$message.warning('请选择上传的文件')
      } else {
        this.$refs.upload.submit()
        this.uploadLogo = '1'
      }
    },
    // 上传数目限制事件
    handleExceed(files, fileLis) {
      this.$message.warning(`当前限制选择 10 个文件`)
    },
    // 上传列表删除事件
    handleRemove(file, fileList) {
      this.Addfile = true
      this.fileList = fileList
    },
    fileChange(file, fileList) {
      this.fileList = fileList
    },
  },
}
</script>
<style>
.el-upload-list {
  width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
  overflow: auto;
}
</style>
<style scoped>
.el-dialog-div {
  height: 600px;
}
.detailsleft {
  width: 40%;
  float: left;
}
.detailsright {
  width: 60%;
  height: 100%;
  float: right;
}

.rule {
  position: absolute;
  width: 0.82rem;
  height: 0.36rem;
  top: 0.08rem;
  right: 0rem;
  background: #111111;
}

.addfile {
  width: 90%;
  height: 50px;
  margin-left: 5%;
  margin-top: 20px;
}

.over {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  filter: alpha(opacity=70);
  top: 0;
  left: 0;
  background-color: #111111;
  z-index: 99;
}
</style>
