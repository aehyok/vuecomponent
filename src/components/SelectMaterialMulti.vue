<template>
  <el-dialog
    :title="'选取' + pageTitle"
    @close="close"
    @open="handleOpen"
    :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-row :gutter="40">
      <el-col :span="24">
        <div class="txt">选取{{ pageTitle }}</div>
        <el-form :model="searchForm" class="demo-ruleForm" :inline="true">
          <el-row type="flex" justify="space-between">
            <el-col>
              <!-- <el-form-item>
                  <tag-select
                    :tags.sync="searchForm.labelids"
                    @update:tags="search"
                    placeholder="标签"
                    multiple
                    :type="tagType"
                  ></tag-select>
                </el-form-item> -->
            </el-col>
            <el-col style="text-align:right;">
              <el-form-item style="margin-right:0;">
                <el-input
                  v-model="searchForm.name"
                  :placeholder="'请输入' + pageTitle + '名称搜索'"
                  style="width:220px;"
                  @input="searchForm.name = searchForm.name.replace(/\s+/g, '')"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="search"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="materialTable"
          :data="materialList"
          :row-key="
            row => {
              return row.id
            }
          "
          style="width: 100%"
          border
          @row-click="handleCurrentChange"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="64"
          ></el-table-column>
          <el-table-column label="缩略图" v-if="materialType === 1">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <img :src="scope.row.url" class="bigImg" />
                <div
                  class="smallImg"
                  slot="reference"
                  :style="{
                    backgroundImage: 'url(' + scope.row.url + ')',
                  }"
                ></div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column :label="pageTitle + '名称'">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.auditStatus === 1"
                >未审核</el-tag
              >
              <el-tag type="warning" v-if="scope.row.auditStatus === 2"
                >审核中</el-tag
              >
              <el-tag type="success" v-if="scope.row.auditStatus === 3"
                >审核通过</el-tag
              >
              <el-tag type="danger" v-if="scope.row.auditStatus === 4"
                >审核不通过</el-tag
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="标签">
              <template slot-scope="scope">{{ scope.row.labelName }}</template>
            </el-table-column>-->
        </el-table>
        <Pagination
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          :autoScroll="false"
          :pager-count="5"
          @pagination="getList"
          v-show="total > 0"
          layout="total, prev, pager, next, jumper"
        ></Pagination>
      </el-col>
      <!-- <el-col :span="12">
        <div class="txt">已选取{{ pageTitle }}：{{ allSelect.length }}</div>
        <el-form :model="selectSearch" :inline="true" style="text-align:right;">
          <el-form-item>
            <el-input
              v-model="selectSearch.name"
              placeholder="请输入名称搜索"
              style="width:220px;"
              @input="selectSearch.name = selectSearch.name.replace(/\s+/g, '')"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="filterAllSelect"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            ref="select"
            :data="filterData"
            max-height="655"
            row-key="id"
            border
          >
            <el-table-column
              label="缩略图"
              width="64"
              v-if="materialType === 'picture'"
            >
              <template slot-scope="scope">
                <el-popover placement="right" title trigger="hover">
                  <img :src="scope.row.url" class="bigImg" />
                  <div
                    class="smallImg"
                    slot="reference"
                    :style="{
                      backgroundImage: 'url(' + scope.row.url + ')',
                    }"
                  ></div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="pageTitle + '名称'">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column
              label="排序"
              width="100"
              v-if="
                materialType === 'video' ||
                  materialType === 'movie' ||
                  materialType === 'series'
              "
            >
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.sequence"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteItem(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col> -->
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import { getMaterialList } from '@/services'

export default {
  components: {
    Pagination,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    serviceProvider: {
      default: -1,
      required: true,
    },
    receiveData: {
      type: [Object, Array],
      default: () => [],
    },
    /**
     * 0全部，1图片，2视频
     */
    materialType: {
      type: Number,
      default: 1,
    },
    limitNum: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      materialList: [],
      allSelect: [], // 已选取项目
      filterData: [], // 已选取过滤数据
      tagType: '',
      searchForm: {
        labelids: [],
        name: '',
        type: '',
      },
      selectSearch: {
        operatorid: '',
        name: '',
      },
    }
  },
  computed: {
    pageTitle() {
      switch (this.materialType) {
        case 1:
          return '图片'
        case 2:
          return '视频'
        default:
          return ''
      }
    },
    maxSequence() {
      if (!this.allSelect.length) return 0
      return Math.max(...this.allSelect.map(s => s.sequence))
    },
  },
  watch: {
    allSelect: {
      handler(checked) {
        this.filterData = checked
      },

      immediate: true,
    },
  },
  created() {
    this.getList()
  },
  methods: {
    handleOpen() {
      this.allSelect = JSON.parse(JSON.stringify(this.receiveData))
      this.getList()
    },
    updateChecked() {
      if (this.$refs.materialTable && !this.allSelect.length) {
        this.$refs.materialTable.clearSelection()
        return
      }
      this.allSelect.forEach(item => {
        const index = this.materialList.findIndex(m => m.id === item.id)
        console.log(index, 'kkk')
        if (index > -1) {
          // Object.assign(item, this.materialList[index])
          this.materialList.splice(index, 1, item)
        }
        this.$refs.materialTable.toggleRowSelection(item, true)
      })
    },
    handleCurrentChange(row) {
      this.$refs.materialTable.toggleRowSelection(row)
    },
    deleteItem(row) {
      const delItem = this.allSelect.find(item => item.id === row.id)
      if (delItem) {
        delete delItem.sequence
        this.$refs.materialTable.toggleRowSelection(delItem, false)
      }
    },
    // 表格选取的时候
    handleSelectionChange(val) {
      let max = this.maxSequence + 1
      val.forEach(s => {
        const sequence = s.sequence === undefined ? max++ : s.sequence
        this.$set(s, 'sequence', sequence)
      })
      this.allSelect = val
    },
    // 本地数据搜索筛选
    filterAllSelect() {
      this.filterData = this.allSelect
      const keyword = this.selectSearch.name
      const reg = new RegExp(keyword)
      if (keyword) {
        this.filterData = this.filterData.filter(i => {
          if (reg.test(i.name)) {
            if (this.selectSearch.operatorid !== '') {
              this.filterData = this.filterData.filter(j => {
                if (j.operatorid === this.selectSearch.operatorid) {
                  return j
                }
              })
            } else {
              return i
            }
          }
        })
      }
    },
    // 点击确认时
    confirm() {
      const limitNum = this.limitNum
      if (this.allSelect.length > limitNum) {
        this.$message({
          message: `选取数量已大于限定的${limitNum}个`,
          type: 'error',
        })
        return
      }
      this.$emit('confirm', this.allSelect)
      this.close()
    },
    // 关闭
    close() {
      this.$emit('update:dialogVisible', false)
      this.allSelect = []
      this.$refs.materialTable.clearSelection()
    },
    // 搜索
    search() {
      this.page = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      let serviceProviders = [1, 2, 3]
      if (typeof this.serviceProvider === 'number') {
        serviceProviders = [this.serviceProvider]
      }
      const res = await getMaterialList({
        page: this.page,
        limit: this.limit,
        keyword: this.searchForm.name,
        type: this.materialType,
        auditStatus: 3,
        serviceProviders,
      })
      this.loading = false
      if (res.code === 200) {
        this.total = res.data.total
        this.materialList = res.data.docs
        this.updateChecked()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.smallImg {
  width: 80px;
  height: 48px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
.bigImg {
  width: auto;
  height: 300px;
}
</style>
