<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <!-- <div class="current-org">
        当前组织:
        <el-dropdown placement="bottom-start">
          <el-button type="primary">
            {{ currentOrgName }}  <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <orginTree
              ref="treeOrgin"
              :lazy="true"
              :highlight="true"
              :showTool="false"
              :normalShow="normalShow"
              :showFirst="true"
              :draggable="false"
              @getNode="getNodeOrgin"
            />
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <GroupTree
        ref="tree"
        :lazy="true"
        :highlight="true"
        :showTool="false"
        :normalShow="normalShow"
        v-if="currentTreeId"
        :tree-id="currentTreeId"
        @getNode="getNode"
      />
    </el-col>
    <el-col :span="20">
      <template v-if="columnLayout > 1">
        <div class="filter-wrapper" style="margin-bottom: 20px;">
          <div class="filter-buttons">
            <el-button
              :disabled="columnLayout === -1"
              type="primary"
              @click="visible = true"
              v-permission="'create'"
            >
              添加栏目内容
            </el-button>
          </div>
          <el-form inline class="filter-options">
            <el-form-item label="发布来源：">
              <el-select
                v-model="filters.isSelf"
                clearable
                @change="resetPageAndFetch"
              >
                <el-option :value="1" label="本组织发布"></el-option>
                <el-option :value="2" label="非本组织发布"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-input
                class="search"
                clearable
                placeholder="请输入消息名称搜索"
                style="width:250px;"
                @keyup.native.enter="resetPageAndFetch"
                v-model="filters.keyword"
              >
                <el-button
                  @click="resetPageAndFetch"
                  slot="append"
                  icon="el-icon-search"
                />
              </el-input>
            </el-form-item>
          </el-form>
          <!-- <div class="filter-options">
            <el-input
              class="search"
              clearable
              placeholder="请输入内容名称搜索"
              style="width:250px"
              v-model="keyword"
              @keyup.native.enter="resetPageAndFetch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="resetPageAndFetch"
              />
            </el-input>
          </div> -->
        </div>

        <table-panel :columns="tableCols" :data="categoryList" />

        <pagination
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="getList"
        />
      </template>

      <div v-else>该栏目不需要配置内容</div>

      <component
        :is="componentName"
        :visible.sync="visible"
        :category-id="categoryId"
        :source="detail"
        :serviceOperator="serviceOperator"
        @saved="resetPageAndFetch"
        @closed="detail = {}"
      />

      <columnContentIssuedHistoryPop
        :contentId="contentId"
        :dialogTableVisible.sync="dialogTableVisible"
      />
    </el-col>
  </el-row>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'
import GroupTree from '@/components/groupTree'
import ButtonWithConfirm from '@/components/ButtonWithConfirm'
import ImageTextLayout from './ImageTextLayout'
import PictureLayout from './PictureLayout'
import PictureListLayout from './PictureListLayout'
import VideoLayout from './VideoLayout'
import TextListLayout from './TextListLayout'
import InvestigateLayout from './InvestigateLayout'
import columnContentIssuedHistoryPop from './columnContentIssuedHistoryPop'
import orginTree from '@/components/organizationTree'
import {
  getColumnContentList,
  getCurrentCategoryTree,
  getContentDetail,
  setLayoutContentStatus,
  submitAudit,
  deleteLayoutContent,
} from '@/services/columnIssued'
import { getCategoryTypeList } from '@/services/category'

import columns from './tableColumns'

export default {
  name: 'columnContentIssued',
  components: {
    TablePanel,
    Pagination,
    ButtonWithConfirm,
    GroupTree,
    PictureLayout,
    PictureListLayout,
    VideoLayout,
    ImageTextLayout,
    TextListLayout,
    InvestigateLayout,
    columnContentIssuedHistoryPop,
    orginTree,
  },
  data() {
    return {
      currentOrgName: '',
      serviceOperator: '', // 运营商
      contentId: '',
      dialogTableVisible: false,
      visible: false,
      filters: {
        keyword: '',
        isSelf: '',
      },
      normalShow: [0],
      page: 1,
      total: 0,
      limit: 10,
      currentTreeId: '',
      categoryId: '',
      detail: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      columnLayout: -1,
      columnTypeList: [],
      categoryList: [],
      treeData: [],
      columns,
    }
  },
  computed: {
    componentName() {
      // 1.无内容、2.全屏图片、3.全屏视频、4.图文信息、5.文字列表、6.图片列表、7.民意调查
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
    tableCols() {
      return this.columns
        .filter(c => {
          if (!c.display.length) return true
          return c.display.includes(this.columnLayout)
        })
        .concat([
          {
            prop: 'auditStatus',
            label: '审核状态',
            display: [],
            render: (h, { row }) => {
              // 1：未提交审核，2：审核中，3：审核通过，4：审核不通过
              const auditMap = {
                1: {
                  text: '未提交审核',
                  type: 'info',
                },
                2: {
                  text: '审核中',
                  type: 'warning',
                },
                3: {
                  text: '审核通过',
                  type: 'success',
                },
                4: {
                  text: '审核不通过',
                  type: 'danger',
                },
              }
              return (
                <el-tag
                  style={{ cursor: 'pointer' }}
                  type={auditMap[row.auditStatus].type}
                  onClick={() => this.openHistBox(row)}
                >
                  {auditMap[row.auditStatus].text}
                </el-tag>
              )
            },
          },
          {
            label: '操作',
            render: (h, { row }) => {
              return (
                <div>
                  <el-button
                    disabled={row.auditStatus === 2}
                    type="text"
                    {...{
                      directives: [{ name: 'permission', value: 'update' }],
                    }}
                    onClick={() => this.getDetail(row)}
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    {...{
                      directives: [
                        { name: 'permission', value: 'submitAudit' },
                      ],
                    }}
                    onClick={() => this.audit(row)}
                    disabled={row.auditStatus !== 1}
                  >
                    提交审核
                  </el-button>
                  <ButtonWithConfirm
                    type="text"
                    textType={row.status === 1 ? 'stop' : 'open'}
                    {...{
                      directives: [{ name: 'permission', value: 'stop' }],
                    }}
                    disabled={row.auditStatus !== 3}
                    onConfirm={() => this.changeStatus(row)}
                  />
                  <ButtonWithConfirm
                    type="text"
                    {...{
                      directives: [{ name: 'permission', value: 'delete' }],
                    }}
                    onConfirm={() => this.delete(row)}
                  />
                </div>
              )
            },
          },
        ])
    },
  },
  watch: {
    categoryId() {
      this.categoryList = []
      if (!this.categoryId) {
        return
      }
      this.getList()
    },
  },
  created() {
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    user.orgId = '1111'
    this.getTree()
  },
  methods: {
    getNodeOrgin(data) {
      console.log(data, 'data.id')
      this.orgId = data.id
      this.page = 1
      this.keyword = ''
      this.status = ''
      this.auditStatus = ''
      this.currentOrgName = data.name
      // this.categoryTreeList()
    },
    openHistBox(row) {
      this.contentId = row.id
      this.dialogTableVisible = true
    },
    resetPageAndFetch() {
      this.page = 1
      this.getList()
    },
    async getList() {
      const user = JSON.parse(localStorage.getItem('loginInfo'))
      const res = await getColumnContentList({
        ...this.filters,
        page: this.page,
        limit: this.limit,
        categoryId: this.categoryId,
        orgId: user.orgId,
      })

      if (res.code === 200) {
        this.categoryList = res.data.docs
        this.total = res.data.total
      }
    },
    async audit({ id }) {
      const res = await submitAudit({ id, status: 2, reason: '' })
      if (res.code === 200) {
        this.$message.success('提交审核成功')
        this.getList()
      }
    },
    async getTree() {
      const user = JSON.parse(localStorage.getItem('loginInfo'))
      const res = await getCurrentCategoryTree({ orgId: user.orgId })
      if (res.code === 200) {
        this.currentTreeId = res.data.id
        {
          const res = await getCategoryTypeList({ page: 1, limit: 1000 })
          if (res.code === 200) {
            this.columnTypeList = res.data.docs
          }
        }
      }
    },
    async getDetail({ id }) {
      // this.detail = row
      const loading = this.$loading({
        background: 'transpanrent',
      })
      const res = await getContentDetail({ id })

      loading.close()
      if (res.code === 200) {
        this.detail = res.data
        this.visible = true
      }
    },
    getNode(data, node) {
      console.log(data, node)
      this.serviceOperator = data.serviceOperator || ''
      if (node.level > 1) {
        const categoryType = this.columnTypeList.find(
          item => item.id === data.categoryTypeId,
        )
        this.categoryId = data.id
        this.columnLayout = categoryType
          ? categoryType.contentType
          : data.format
        console.log('contentType: ' + this.columnLayout)
      } else {
        this.categoryId = ''
        this.columnLayout = -1
      }
    },
    async delete({ id }) {
      const res = await deleteLayoutContent({ id })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.getList()
      }
    },
    async changeStatus({ id, status }) {
      const s = !(status - 1) + 1
      const res = await setLayoutContentStatus({
        id,
        status: s,
      })

      if (res.code === 200) {
        this.$message.success('状态修改成功')
        this.getList()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.startcor {
  color: $theme-color;
}
.stopcor {
  color: red;
}
.current-org {
  padding-bottom: 20px;
}
</style>
