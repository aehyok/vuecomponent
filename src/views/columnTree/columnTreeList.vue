<template>
  <div>
    <div class="container">
      <!-- 树结构 // TODO 切换组织机构 -->
      <div class="left-tree">
        <orginTree
          ref="tree"
          :lazy="true"
          :highlight="true"
          :showTool="false"
          :normalShow="normalShow"
          :showFirst="true"
          :draggable="false"
          @getNode="getNode"
        />
      </div>
      <!-- 右侧内容 -->
      <div class="right-content">
        <div v-if="orgId">
          <div class="controlbox">
            <!-- <el-button
              type="primary"
              class="let-bottons"
              @click="addTree"
              style="margin-right: 10px;"
            >
              添加栏目树
            </el-button>-->
            <el-dropdown
              class="let-bottons"
              @command="handleCommand"
              style="margin-right: 10px"
              v-permission="'create'"
            >
              <el-button type="primary">
                添加栏目树
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addTree">
                  新建栏目树
                </el-dropdown-item>
                <el-dropdown-item command="quoteTree"
                  >引用栏目树</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              v-permission="'settingTree'"
              class="let-bottons"
              @command="handleCommand"
            >
              <el-button type="primary">
                当前栏目设置
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="typeSet"
                  >设为当前栏目树</el-dropdown-item
                >
                <el-dropdown-item command="typeCancel"
                  >取消当前栏目树</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <span>是否共享：</span>
            <el-select
              v-model="status"
              clearable
              placeholder="请选择"
              style="margin-right: 20px;"
              @change="resetPageThenFetch"
            >
              <el-option label="共享" :value="1"></el-option>
              <el-option label="不共享" :value="2"></el-option>
            </el-select>
            <span>审核状态：</span>
            <el-select
              v-model="auditStatus"
              clearable
              placeholder="请选择"
              style="margin-right: 20px;"
              @change="resetPageThenFetch"
            >
              <el-option label="未提交审核" :value="1"></el-option>
              <el-option label="审核中" :value="2"></el-option>
              <el-option label="审核通过" :value="3"></el-option>
              <el-option label="审核不通过" :value="4"></el-option>
            </el-select>
            <el-input
              style="width: 300px"
              placeholder="请输入栏目树名称搜索"
              v-model="keyword"
              class="input-with-select"
              @keypress.native.enter="resetPageThenFetch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="resetPageThenFetch"
              />
            </el-input>
          </div>
          <div style="margin-top: 20px;">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              ref="multipleTable"
              v-loading="isLoading"
              @select-all="dialogCheck"
              @select="dialogCheck"
              @selection-change="dialogCheckChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.name }}
                    <i v-if="scope.row.isDefault" class="tips">当前</i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.status === 1 ? '共享' : '不共享' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="refTreeName"
                label="引用栏目树"
              ></el-table-column>
              <el-table-column
                prop="updatedBy"
                label="修改人"
              ></el-table-column>
              <el-table-column label="修改时间" width="155px">
                <template slot-scope="scope">
                  <div>{{ scope.row.updatedAt | formatDate }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="auditStatus" label="审核状态">
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
              <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                  <el-button
                    v-permission="'update'"
                    type="text"
                    @click="editTree(scope.row)"
                    :disabled="scope.row.auditStatus === 2"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-permission="'treeConfig'"
                    type="text"
                    @click="runSetTree(scope.row)"
                    :disabled="scope.row.auditStatus === 2"
                  >
                    栏目树配置
                  </el-button>
                  <el-button
                    v-permission="'submitAudit'"
                    type="text"
                    @click="submitAudit(scope.row)"
                    :disabled="
                      scope.row.auditStatus === 2 || scope.row.auditStatus === 3
                    "
                  >
                    提交审核
                  </el-button>
                  <el-dropdown
                    @command="c => handleRowCommand(scope.row, c)"
                    style="margin-left: 5px;"
                  >
                    <el-button type="text">
                      更多操作
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="copy" v-permission="'copy'">
                        复制
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.status === 1"
                        v-permission="'share'"
                        command="stop"
                      >
                        不共享
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.status === 2"
                        v-permission="'share'"
                        command="start"
                      >
                        共享
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-permission="'delete'"
                        command="delete"
                        :disabled="scope.row.auditStatus === 2"
                      >
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <Pagination
            :page.sync="page"
            :limit.sync="limit"
            :total="total"
            @pagination="pagination"
          />
          <ColumnTreeForm
            @saved="resetPageThenFetch"
            :org-id="orgId"
            :mode="command"
            :source="editData"
            :visible.sync="formVisible"
          />
          <ColumnTreeQuote
            @saved="resetPageThenFetch"
            :org-id="orgId"
            :mode="command"
            :visible.sync="queteVisible"
          />
        </div>
        <div v-else>
          <p
            style="color:#666;font-size:30px;text-align:center;padding-top:20px;"
          >
            请先在左侧选择需要管理的组织
          </p>
        </div>
      </div>
    </div>
    <ColumnTreeHistoryPop
      :contentId="contentId"
      :dialogTableVisible.sync="dialogTableVisible"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import orginTree from '@/components/organizationTree'
import ColumnTreeForm from './ColumnTreeForm'
import ColumnTreeQuote from './ColumnTreeQuote'
import ColumnTreeHistoryPop from './columnTreeHistoryPop'
import {
  categoryTreeList,
  setDefaultTree,
  submitAudit,
  categoryTreeDetail,
  removeCategory,
  changeStatus,
} from '@/services/category'
import { format } from 'date-fns'

export default {
  components: {
    Pagination,
    orginTree,
    ColumnTreeForm,
    ColumnTreeQuote,
    ColumnTreeHistoryPop,
  },
  filters: {
    formatDate(val) {
      return format(val, 'yyyy-MM-dd HH:mm:ss')
    },
  },
  data() {
    return {
      contentId: '',
      dialogTableVisible: false,
      isLoading: false,
      isFromLoading: false,
      orgId: '', // 当前选中组织的id
      normalShow: [0],
      formVisible: false,
      queteVisible: false,
      command: 'create',
      editData: {},
      selectioned: [], // 表格选中
      status: '', // 状态
      auditStatus: '', // 审核状态
      keyword: '',
      page: 1,
      limit: 10,
      total: 0,
      tableData: [],
    }
  },
  methods: {
    openHistBox(row) {
      this.contentId = row.id
      this.dialogTableVisible = true
    },
    // 是否共享二次确认框
    checkChangeStatus(id, status, type) {
      let str = ''
      if (type === 'stop') {
        str = '不共享后，下级组织不可引用该栏目树'
      } else if (type === 'start') {
        str = '共享后，下级组织的栏目树列表可引用该栏目树'
      }
      this.$confirm(`${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.changeStatus(id, status)
        })
        .catch(() => {
          // this.changeStatus(id, status)
        })
    },
    // 是否共享
    async changeStatus(id, status) {
      const res = await changeStatus({
        ids: [id],
        status: status,
      })
      if (res.code === 200) {
        if (status === 1) {
          this.$message.success('已共享')
        } else {
          this.$message.success('已不共享')
        }
        this.categoryTreeList()
      } else {
        this.$message.error(res.message)
      }
    },
    // 移除栏目树
    removeCategory(id) {
      this.$confirm('删除后，该数据将无法恢复？', {
        title: '提示',
      }).then(async () => {
        const res = await removeCategory({
          ids: [id],
        })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.categoryTreeList()
        }
      })
    },
    // 栏目树配置按钮
    runSetTree(row) {
      this.$router.push({
        name: 'columnTreeConfig',
        query: { id: row.id, name: row.name, orgId: this.orgId },
      })
    },
    // 提交审核
    async submitAudit(row) {
      const res = await submitAudit({
        ids: [row.id],
      })
      if (res.code === 200) {
        this.$message.success('成功提交审核')
        this.categoryTreeList()
      } else {
        this.$message.error(res.message)
      }
    },
    async editTree(row) {
      this.command = 'edit'
      this.categoryTreeDetail(row.id)
    },
    // 获取树详情
    async categoryTreeDetail(id) {
      const loading = this.$loading({
        background: 'transparent',
      })
      const res = await categoryTreeDetail({
        id,
      })

      loading.close()
      if (res.code === 200) {
        this.editData = res.data
        this.formVisible = true
      }
    },

    pagination() {
      this.categoryTreeList()
    },
    // 获取列表
    async categoryTreeList() {
      this.isLoading = true
      const res = await categoryTreeList({
        page: this.page,
        limit: this.limit,
        keyword: this.keyword,
        status: this.status,
        auditStatus: this.auditStatus,
        orgId: this.orgId,
      })
      if (res.code === 200) {
        // this.$message.success('数据加载成功')
        this.total = res.data.total
        this.tableData = res.data.docs
      } else {
        this.$message.error(res.message)
      }
      this.isLoading = false
    },
    getNode(data) {
      console.log(data.id, 'data.id')
      this.orgId = data.id
      this.page = 1
      this.keyword = ''
      this.status = ''
      this.auditStatus = ''
      this.categoryTreeList()
    },
    handleRowCommand(row, type) {
      switch (type) {
        case 'copy': {
          this.command = 'copy'
          this.editData = row
          this.formVisible = true
          break
        }
        case 'delete':
          this.removeCategory(row.id)
          break
        case 'stop':
          this.checkChangeStatus(row.id, 2, 'stop')
          break
        case 'start':
          this.checkChangeStatus(row.id, 1, 'start')
          break
        default:
          break
      }
    },
    // 新增栏目树
    addTree() {
      this.command = 'create'
      this.formVisible = true
    },
    // 引用栏目树
    quoteTree() {
      this.command = 'create'
      this.queteVisible = true
    },
    handleCommand(command) {
      if (command === 'typeSet') {
        this.setTree()
      } else if (command === 'typeCancel') {
        this.cancelTree()
      } else if (command === 'addTree') {
        this.addTree()
      } else if (command === 'quoteTree') {
        this.quoteTree()
      }
    },
    // 设为当前栏目树
    async setTree() {
      console.log('设置成当前栏目树')
      this.postSetDefaultTree(true)
    },
    cancelTree() {
      console.log('取消当前栏目树')
      this.postSetDefaultTree(false)
    },
    // 提交设置是否设置当前栏目树数据
    async postSetDefaultTree(type) {
      if (this.selectioned.length <= 0) {
        return this.$message.warning('请勾选需要设置的数据')
      }
      const res = await setDefaultTree({
        id: this.selectioned[0].id,
        orgId: this.orgId,
        isDefault: type,
      })
      if (res.code === 200) {
        this.$message.success('设置成功')
        this.categoryTreeList()
      } else {
        this.$message.error(res.message)
      }
      this.selectioned = []
    },
    dialogCheck(selection, row) {
      this.$refs.multipleTable.clearSelection()
      if (selection.length === 0) {
        // 判断selection是否有值存在
        return
      }
      if (row) {
        this.selectioned = row
        this.$refs.multipleTable.toggleRowSelection(row, true)
      }
    },
    dialogCheckChange(row) {
      this.selectioned = row
      console.log(this.selectioned)
      // if (row.length === 0) {
      //   this.selectioned = null
      // }
    },
    resetPageThenFetch() {
      this.page = 1
      this.categoryTreeList()
    },
  },
  watch: {
    formVisible: {
      handler(newVal) {
        if (!newVal) {
          this.editData = {}
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.left-tree {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 300px;
  border-right: 1px solid #ccc;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 12px;
  }
}
.right-content {
  margin-left: 320px;
}
.controlbox {
  text-align: right;
}
.let-bottons {
  float: left;
}
.tips {
  background: $theme-color;
  padding: 3px 6px;
  color: #fff;
  border-radius: 3px;
}
.startcor {
  color: $theme-color;
}
.stopcor {
  color: red;
}
.normalcolor {
  color: #606266;
  &:hover {
    color: $theme-color;
  }
}
.tipsbox {
  span {
    cursor: pointer;
  }
}
</style>
