<template>
  <div style="height: 100%;">
    <div class="container">
      <!-- 树结构 -->
      <div class="left-tree">
        <h3
          style="font-size: 16px; font-weight: 600;margin: 0 0 20px 0; color: 313131;"
        >
          {{ treeName }}
        </h3>
        <groupTree
          ref="tree"
          :lazy="true"
          :highlight="true"
          :showTool="true"
          :normalShow="normalShow"
          :draggable="true"
          :tree-id="$route.query.id"
          @getNode="getNode"
        />
      </div>
      <!-- 右侧内容 -->
      <div class="right-content">
        <!-- <el-button @click="updataNodeName">更新</el-button> -->
        <el-main>
          <menuLevelone
            v-if="level === 1 && node"
            :category-id="node.data.id"
          ></menuLevelone>
          <menuLevelMore
            v-if="level > 1"
            :category-id="node.data.id"
            :isLock="isLock"
            :isRef="isRef"
            @saved="handleSaved"
          />
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
import groupTree from '@/components/groupTree'
import menuLevelone from './menuLevelone'
import menuLevelMore from './menuLevelMore'

export default {
  components: {
    groupTree,
    menuLevelone,
    menuLevelMore,
  },
  data() {
    return {
      level: 1,
      normalShow: [0],
      nodeData: null,
      node: null,
      treeName: '',
      isLock: false, // 是否锁定
      isRef: false, // 是否引用
    }
  },
  created() {
    this.treeName = this.$route.query.name
  },
  methods: {
    // 更新节点名称
    updataNodeName() {
      this.$refs.tree.edit(this.node, this.nodeData)
    },
    // 获取节点数据
    getNode(data, node) {
      console.log(data, 'geNode')
      this.nodeData = data
      this.node = node
      this.level = node.level
      this.isLock = data.isLock
      this.isRef = data.isRef
    },
    handleSaved(data) {
      this.$refs.tree.updateName(this.node, data)
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
</style>
