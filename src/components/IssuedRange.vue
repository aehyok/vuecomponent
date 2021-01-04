<template>
  <div>
    <div style="display: flex;align-items: center;">
      <el-button type="primary" @click="$emit('update:visible', true)">
        {{ btnName }}
      </el-button>
      <div style="margin-left: 10px;" v-if="checkedKeys.length">
        已选择 {{ checkedKeys.length }} 个组织
      </div>
    </div>
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      title="选择发布范围"
      append-to-body
      @open="handleOpen"
    >
      <OrgTree
        :show-tool="false"
        v-bind="$attrs"
        :lazy="true"
        ref="orgTree"
        :show-checkbox="true"
      />
      <template #footer>
        <el-button @click="$emit('update:visible')">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import OrgTree from './organizationTree'

export default {
  props: {
    checkedKeys: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    OrgTree,
  },
  data() {
    return {
      checkedNodes: [],
    }
  },
  computed: {
    btnName() {
      if (this.$attrs.thisType === 'detail') {
        return '查看发布范围'
      } else {
        return '发布范围'
      }
    },
    treeComponent() {
      return this.$refs.orgTree.$refs.tree
    },
    orgName() {
      return this.checkedNodes.map(i => i.name).join('；')
    },
  },
  methods: {
    handleOpen() {
      if (this.checkedKeys.length) {
        this.$nextTick(() => {
          this.treeComponent.setCheckedKeys(this.checkedKeys)
          const checked = this.treeComponent.getCheckedNodes()
          this.checkedNodes = checked
        })
      }
    },
    confirm(data) {
      const checked = this.treeComponent.getCheckedNodes()
      this.checkedNodes = checked
      this.$emit(
        'confirm',
        checked.map(i => i.id),
      )
      this.$emit('update:visible', false)
    },
  },
}
</script>
