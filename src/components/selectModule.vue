<template>
  <!-- 模块选择组件 by owen 2020-09-07 -->
  <div class="module-box">
    <el-dialog
      title="选择功能模块"
      :visible="dialogVisible"
      width="40%"
      @close="close"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-table
        ref="tableName"
        :data="moduleList"
        row-key="id"
        style="width: 100%"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="64"
          v-if="isMulti"
        ></el-table-column>
        <el-table-column label="功能模块">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="操作" width="95" v-if="!isMulti">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleCurrentChange(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" v-if="isMulti">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getModuleList } from '@/services/banner'

export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isMulti: {
      // 是否多选
      type: Boolean,
      default: true,
    },
    moduleType: {
      // 类型，0是所有，2是公众号模块
      type: Number,
      default: 0,
    },
    parentId: {
      // 父节点
      type: String,
      default: '',
    },
  },
  computed: {},
  data() {
    return {
      moduleList: [],
      loading: false,
      selects: [],
    }
  },
  created() {
    this.getModuleList()
  },
  methods: {
    async getModuleList() {
      const res = await getModuleList({
        moduleType: this.moduleType,
        parentId: this.parentId,
      })
      if (res && res.code === 200) {
        this.moduleList = res.data
      }
    },
    handleCurrentChange(row) {
      this.$emit('callback', row)
      this.close()
    },
    handleSelectionChange(rows) {
      // this.$emit('callback', rows)
      this.selects = rows
    },
    // 关闭
    close() {
      // this.$emit('close', false)
      this.$emit('update:dialogVisible', false)
    },
    confirm() {
      this.$emit('callback', this.selects)
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
.module-box {
  width: 100%;
}
</style>
