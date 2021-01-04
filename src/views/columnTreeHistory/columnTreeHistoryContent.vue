<template>
  <div style="height: 100%;">
    <div class="container">
      <!-- 树结构 -->
      <div class="left-tree">
        <groupAuditTree
          ref="tree"
          :lazy="true"
          :highlight="true"
          :showTool="false"
          :draggable="false"
          :direction="direction"
          :recordId="$route.query.recordId"
          @getNode="getNode"
        />
      </div>
      <!-- 右侧内容 -->
      <div class="right-content">
        <el-main>
          <columnTreeMenuLevelone
            v-if="level === 1 && node"
            :category-id="node.data.id"
            :direction="direction"
            :recordId="$route.query.recordId"
            :picType="'detail'"
          />
          <columnTreeMenuLeveMore
            v-if="level > 1"
            :category-id="node.data.id"
            :direction="direction"
            :recordId="$route.query.recordId"
            :picType="'detail'"
          />
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
import groupAuditTree from '@/components/groupAuditTree'
import columnTreeMenuLevelone from './columnTreeMenuLevelone'
import columnTreeMenuLeveMore from './columnTreeMenuLevelMore'
export default {
  props: {
    direction: {
      type: Number,
      require: true,
    },
  },
  components: {
    groupAuditTree,
    columnTreeMenuLevelone,
    columnTreeMenuLeveMore,
  },
  data() {
    return {
      level: 1,
      node: null,
    }
  },
  methods: {
    // 获取节点数据
    getNode(data, node) {
      console.log(data, node)
      this.node = node
      this.level = node.level
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
}
.left-tree {
  float: left;
  width: 300px;
  min-height: 100%;
  border-right: 1px solid #ccc;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 12px;
  }
}
.right-content {
  margin-left: 320px;
}
</style>
