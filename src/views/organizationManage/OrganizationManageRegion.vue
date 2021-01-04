<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @open="handleOpen"
    @closed="handleClose"
  >
    <el-tree
      ref="tree"
      :data="region"
      :props="defaultProps"
      :default-expand-all="true"
      :check-strictly="true"
      @check="getNode"
      show-checkbox
      node-key="name"
    >
    </el-tree>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { getRegionTree } from '@/services/organization'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  computed: {
    title() {
      return '选择所属区域'
    },
  },
  data() {
    return {
      region: [],
      result: '',
      defaultProps: {
        label: 'name',
      },
    }
  },
  methods: {
    async handleOpen() {
      this.result = ''
      const res = await getRegionTree()
      if (res.code === 200) {
        this.region = res.data
      }
    },
    handleClose() {},
    async save() {
      this.$emit('update:visible', false)
      // this.$emit('saved', this.$refs.tree.getCheckedKeys())
      this.$emit('saved', this.result)
    },
    getNode(data, node) {
      let curr = this.$refs.tree.getNode(data)
      this.result = ''
      while (curr) {
        if (curr.key) {
          this.result = curr.key + this.result
        }
        curr = curr.parent
      }
      this.$refs.tree.setCheckedKeys([data.name])
    },
  },
}
</script>
