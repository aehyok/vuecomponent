<template>
  <div v-loading="loading">
    <div class="filter-wrapper">
      <div class="filter-buttons"></div>
      <el-form inline class="filter-options">
        <el-form-item label="问题类别：">
          <el-select v-model="filters.type" clearable @change="filterChange">
            <el-option :value="'垃圾处理'" label="垃圾处理"></el-option>
            <el-option :value="'环境污染'" label="环境污染"></el-option>
            <el-option :value="'饮水问题'" label="饮水问题"></el-option>
            <el-option :value="'住房问题'" label="住房问题"></el-option>
            <el-option :value="'治安问题'" label="治安问题"></el-option>
            <el-option :value="'违规违纪'" label="违规违纪"></el-option>
            <el-option :value="'看病问题'" label="看病问题"></el-option>
            <el-option :value="'教育问题'" label="教育问题"></el-option>
            <el-option :value="'交通问题'" label="交通问题"></el-option>
            <el-option :value="'其他'" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="search"
            clearable
            placeholder="请输入关键字搜索"
            style="width:250px;"
            @keyup.native.enter="filterChange"
            v-model="filters.keyword"
          >
            <el-button
              @click="filterChange"
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <TablePanel :data="list" :columns="columns" />

    <Pagination
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getList"
    />

    <PhotoanywhereForm :visible.sync="visible" :source="detail" />
    <PhotoanywhereReply
      :visible.sync="replyVisible"
      :source="detail"
      @saved="getList"
    />
  </div>
</template>
<script>
import { formatTime } from '@/filters'
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import PhotoanywhereForm from './PhotoanywhereForm'
import PhotoanywhereReply from './PhotoanywhereReply'
import {
  getPhotoanywhereList,
  getPhotoanywhereDetail,
} from '@/services/photoanywhere'

export default {
  components: {
    TablePanel,
    Pagination,
    PhotoanywhereForm,
    PhotoanywhereReply,
  },
  data() {
    return {
      filters: {
        keyword: '',
        type: '',
      },
      visible: false,
      replyVisible: false,
      loading: false,
      list: [],
      page: 1,
      total: 0,
      limit: 10,
      detail: {},
      columns: [
        {
          label: '发布者',
          prop: 'realName',
        },
        {
          label: '手机号',
          prop: 'mobile',
        },

        {
          label: '发布位置',
          prop: 'position',
        },
        {
          label: '问题类别',
          prop: 'type',
        },
        {
          label: '文字',
          prop: 'descript',
        },
        {
          label: '状态',
          prop: '',
          render: (h, { row }) => {
            const types = {
              2: '已回复',
              1: '待回复',
            }
            return <span>{types[row.isReply]}</span>
          },
        },
        {
          label: '提交时间',
          prop: '',
          render: (h, { row }) => {
            return <span>{formatTime(row.createdAt)}</span>
          },
        },
        {
          label: '操作',
          width: 240,
          render: (h, { row }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.handleDetail(row)}>
                  详情
                </el-button>
                <el-button
                  disabled={row.isReply === 2}
                  type="text"
                  onClick={() => this.handleReply(row)}
                >
                  回复
                </el-button>
              </div>
            )
          },
        },
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    filterChange() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.loading = true

      const res = await getPhotoanywhereList({
        page: this.page,
        limit: this.limit,
        ...this.filters,
      })

      this.loading = false
      if (res && res.code === 200) {
        this.list = res.data.docs
        this.total = res.data.total
      }
      // this.total = 1
      // this.list = [
      //   {
      //     id: 'adfasdfasdf',
      //     userID: '1', // 用户id
      //     realName: '2', // 用户姓名
      //     avatarUrl: '3',
      //     mobile: '4',
      //     address: '6',
      //     position: '1', // 位置
      //     type: '垃圾处理', // 类型，垃圾处理、环境污染、饮水问题、住房问题、治安问题、违规违纪、看病问题、教育问题、交通问题、其他
      //     descript: '234234', // 个人简介
      //     imageIds: [
      //       'http://172.18.44.211:3000/material/image/202008/24/file-1598250612036.jpg',
      //     ], // 图片
      //     createdAt: 0,
      //     videoIds: [], // 视频
      //     isReply: 1, // 是否回复 1 待回复，2 已回复
      //     replyDesc: '2342', // 回复文字
      //     replyImageIds: [], // 回复图片
      //     replyDateTime: 0, // 回复时间
      //   },
      // ]
    },
    async handleDetail({ id }) {
      const res = await getPhotoanywhereDetail({ id })
      if (res.code === 200) {
        this.visible = true
        this.detail = res.data
      }
    },
    async handleReply(row) {
      this.replyVisible = true
      this.detail = row
    },
  },
}
</script>
