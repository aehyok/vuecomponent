<template>
  <el-dialog
    :title="displayInfo.title"
    v-on="$listeners"
    v-bind="$attrs"
    @opened="handleOpened"
    @closed="handleClosed"
  >
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
        <el-table-column prop="orgName" label="来源组织"></el-table-column>
      </el-table>
    </div>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm('form')"
        :disabled="selectioned.length <= 0"
      >
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
import { saveCategoryTree, getRefTreeList } from '@/services/category'
export default {
  props: {
    orgId: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'create',
    },
    source: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLoading: false,
      saving: false,
      tableData: [],
      selectioned: [],
      modeMap: {
        create: {
          title: '创建引用栏目树',
          saveMethod: saveCategoryTree,
          loadMethod: getRefTreeList,
          successMsg: '创建成功',
        },
        edit: {
          title: '编辑引用栏目树',
          saveMethod: getRefTreeList,
          loadMethod: saveCategoryTree,
          successMsg: '修改成功',
        },
      },
    }
  },
  computed: {
    displayInfo() {
      return this.modeMap[this.mode]
    },
  },
  methods: {
    async handleOpened() {
      const res = await this.displayInfo.loadMethod({
        orgId: this.orgId,
        limit: 100000,
        page: 1,
      })
      if (res.code === 200) {
        this.tableData = res.data.docs
      }
      // const { id, name, remark, status } = this.source
      // this.form = {
      //   id,
      //   name,
      //   remark,
      //   status,
      // }
    },
    handleClosed() {
      this.tableData = []
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
    },
    async submitForm() {
      if (this.selectioned.length <= 0) {
        return
      }
      this.saving = true
      const data = this.selectioned[0]
      const res = await this.displayInfo.saveMethod({
        id: this.source.id,
        refTreeId: data.id,
        name: data.name,
        status: data.status,
        orgId: this.orgId,
      })

      this.saving = false
      if (res.code === 200) {
        this.$message.success(this.displayInfo.successMsg)
        this.$emit('saved')
        this.$emit('update:visible', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tips {
  background: $theme-color;
  padding: 3px 6px;
  color: #fff;
  border-radius: 3px;
}
</style>
