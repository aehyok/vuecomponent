<template>
  <div style="height: 100%;">
    <div class="container">
      <div style="padding-bottom: 20px">
        <el-button @click="goback">返回</el-button>
        <el-button type="primary" @click="auditOpinionBox(3)" v-if="aduitType"
          >通过</el-button
        >
        <el-button type="primary" @click="auditOpinionBox(4)" v-if="aduitType"
          >不通过</el-button
        >
      </div>
      <!-- 树结构 -->
      <div class="left-tree">
        <h3
          style="font-size: 16px; font-weight: 600;margin: 0 0 20px 0; color: 313131;"
        >
          栏目树名称：{{ treeName }}
        </h3>
        <h3
          style="font-size: 16px; font-weight: 600;margin: 0 0 20px 0; color: 313131;"
        >
          创建者：{{ submitter }}
        </h3>
        <groupAuditTree
          ref="tree"
          :lazy="true"
          :highlight="true"
          :showTool="false"
          :draggable="false"
          :direction="2"
          :recordId="$route.query.recordId"
          @getNode="getNode"
        />
      </div>
      <!-- 右侧内容 -->
      <div class="right-content">
        <!-- <el-button @click="updataNodeName">更新</el-button> -->
        <el-main>
          <columnTreeMenuLevelone
            v-if="level === 1 && node"
            :category-id="node.data.id"
            :direction="2"
            :recordId="$route.query.recordId"
            :picType="'detail'"
          />
          <columnTreeMenuLeveMore
            v-if="level > 1"
            :category-id="node.data.id"
            :direction="2"
            :recordId="$route.query.recordId"
            :picType="'detail'"
          />
        </el-main>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="审核意见"
      :visible.sync="dialogTableVisible"
      width="500px"
      @close="resetAuditBox"
    >
      <el-form :model="dioForm">
        <el-form-item>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="dioForm.textarea"
            resize="none"
            :autosize="{
              minRows: 3,
              maxRows: 6,
            }"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetAuditBox">取消</el-button>
        <el-button type="primary" @click="postData">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import groupAuditTree from '@/components/groupAuditTree'
import columnTreeMenuLevelone from '@/views/columnTreeHistory/columnTreeMenuLevelone'
import columnTreeMenuLeveMore from '@/views/columnTreeHistory/columnTreeMenuLevelMore'
import { auditCategoryTree } from '@/services/columnReview'

export default {
  components: {
    groupAuditTree,
    columnTreeMenuLevelone,
    columnTreeMenuLeveMore,
  },
  data() {
    return {
      aduitType: '',
      dialogTableVisible: false,
      level: 1,
      normalShow: [0],
      nodeData: null,
      node: null,
      treeName: '',
      submitter: '',
      auditStatus: '', // 审核状态  3审核通过，4审核不通过
      dioForm: {
        textarea: '',
      },
    }
  },
  created() {
    this.treeName = this.$route.query.name
    this.submitter = this.$route.query.submitter
    this.aduitType = this.$route.query.aduitType || ''
  },
  methods: {
    async postData() {
      const res = await auditCategoryTree({
        id: this.$route.query.recordId,
        name: this.$route.query.name, // 名称
        auditStatus: this.auditStatus, // 审核状态  3审核通过，4审核不通过
        auditReason: this.dioForm.textarea, // 审核意见
      })
      if (res.code === 200) {
        // this.$message.success('数据提交成功')
        this.$message({
          duration: 1200,
          message: '提交成功',
          type: 'success',
        })
        this.goback()
      }
      console.log(res)
    },
    // 重置弹窗数据
    resetAuditBox() {
      this.auditStatus = ''
      this.dioForm.textarea = ''
      this.dialogTableVisible = false
    },
    auditOpinionBox(val) {
      this.auditStatus = val
      this.dialogTableVisible = true
    },
    goback() {
      this.$router.go(-1)
    },
    // 更新节点名称
    updataNodeName() {
      this.$refs.tree.edit(this.node, this.nodeData)
    },
    // 获取节点数据
    getNode(data, node) {
      this.nodeData = data
      this.node = node
      this.level = node.level
    },
    handleSaved(data) {
      this.$refs.tree.updateName(this.node, data)
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
