<template>
  <div>
    <div class="category-tree">
      <el-tree
        ref="tree"
        :draggable="draggable"
        node-key="id"
        :allow-drop="allowDrop"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="highlight"
        :indent="10"
        :lazy="lazy"
        :load="loadNode"
        :allow-drag="allowDrag"
        @node-drag-enter="dragEnter"
        @node-drop="dropData"
        @node-click="getNode"
        :default-expanded-keys="expandedkeys"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="tree-item-name">
            <i class="el-icon-s-grid icon" v-if="data.category === 0"></i>
            <i class="el-icon-s-grid icon" v-if="data.category === 1"></i>
            <i class="el-icon-s-shop icon" v-if="data.category === 2"></i>
            {{ node.label }}
          </span>
          <span v-if="showTool">
            <!-- <i class="el-icon-view icon"></i> -->
            <i
              class="el-icon-circle-plus-outline icon"
              @click.stop="() => append(node, data)"
            ></i>
            <!-- <i
              class="el-icon-edit icon"
              v-if="node.level !== 1"
              @click.stop="() => edit(node, data)"
            ></i> -->
            <i
              class="el-icon-delete icon"
              v-if="node.level !== 1"
              @click.stop="() => remove(node, data)"
            >
            </i>
          </span>
        </span>
      </el-tree>
      <el-dialog
        title="新增栏目"
        :visible.sync="dialogVisible"
        width="30%"
        @close="resetForm"
      >
        <el-form :model="form" label-width="120px" :rules="rules" ref="form">
          <el-form-item label="栏目名称：" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入栏目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="栏目类型：" prop="categoryTypeId">
            <el-select v-model="form.categoryTypeId" placeholder="请选择">
              <el-option
                :label="m.name"
                :value="m.id"
                v-for="m in columnTypeList"
                :key="m.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="栏目布局：" prop="columnModel">
            <el-select v-model="form.columnModel" placeholder="请选择">
              <el-option
                v-for="c in columnLayouts"
                :key="c.value"
                :value="c.value"
                :label="c.label"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="适用运营商：" prop="serviceOperator">
            <el-select v-model="form.serviceOperator" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.id"
                :value="item.operatorId"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getSubCategorys,
  saveCategoryInfo,
  dragCategory,
  deleteCategory,
  getCategoryTypeList,
} from '@/services/category'
// import { layoutListMoudel } from '@/utils/mappableState'
import { getOperatorList } from '@/services/iptv'
// import { getCategoryType } from '@/services/index'

export default {
  props: {
    treeId: {
      type: String,
      required: true,
    },
    lazy: {
      dafault: false,
      type: Boolean,
    },
    highlight: {
      dafault: false,
      type: Boolean,
    },
    showTool: {
      dafault: false,
      type: Boolean,
    },
    draggable: {
      dafault: false,
      type: Boolean,
    },
  },
  data() {
    return {
      operatorList: [],
      form: {
        id: '',
        name: '', // 栏目名称
        // columnType: '',
        // columnModel: '',
        categoryTypeId: '',
        serviceOperator: 0,
      },
      rules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        // columnType: [{ required: true, message: '请选择栏目类型' }],
        // columnModel: [{ required: true, message: '请选择栏目版式' }],
        serviceOperator: [{ required: true, message: '请选择运营商' }],
      },
      dialogVisible: false, // 新增栏目弹窗
      node: '',
      noChildNodes: true, // 判断进入的位置是否有子节点
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
      },
      // columnLayouts: layoutList,
      // columnLayouts: layoutListMoudel,
      expandedkeys: [], // 默认展开节点
      columnTypeList: [],
    }
  },
  methods: {
    async getCategoryType2() {
      // this.columnTypeList = await getCategoryType()
      const res = await getCategoryTypeList({ page: 1, limit: 1000 })
      if (res.code === 200) {
        this.columnTypeList = res.data.docs
      }
    },
    async getOperators() {
      try {
        const res = await getOperatorList({ page: 1, limit: 10000 })
        res.data.docs.push({
          id: 'addff',
          name: '全部',
          operatorId: 0,
        })
        this.operatorList = res.data.docs
      } catch (error) {
        console.error(error)
      }
    },
    // 判断节点能否被拖拽
    allowDrag(draggingNode) {
      const { isRef, format } = draggingNode.data
      // 引用栏目和主菜单不能拖拽
      if (format === 0) return false
      return !isRef
    },
    // 放下事件
    allowDrop(draggingNode, dropNode, type) {
      if (type === 'inner' || dropNode.data.isRef) {
        return false
      }
      return true
    },
    // 拖拽进入其他节点时触发的事件
    dragEnter(draggingNode, dropNode, ev) {
      if (dropNode.childNodes.length <= 0) {
        this.noChildNodes = false
      } else {
        this.noChildNodes = true
      }
    },
    // 更新组织名
    updateName(node, updata) {
      node.parent.childNodes.forEach(item => {
        if (item.data.id === updata.id) {
          item.data.name = updata.name
        }
      })
    },
    // 拖拽成功完成时触发的事件
    async dropData(draggingNode, dropNode, dropType, ev) {
      if (dropType === 'inner') {
        if (this.noChildNodes) {
          return false
        } else {
          const childNodes = []
          dropNode.parent.childNodes.forEach(item => {
            if (item.data.id === dropNode.data.id) {
              if (item.data.leaf) {
                item.data.leaf = false
              }
            }
            childNodes.push(item.data)
          })
          const pid = dropNode.parent.data.id
          this.$refs.tree.updateKeyChildren(pid, childNodes)
        }
        this.noChildNodes = true
      } else {
        const dataIdIndex = dropNode.parent.childNodes.findIndex(
          n => n.data.id === draggingNode.data.id,
        )
        const res = await dragCategory({
          id: draggingNode.data.id,
          action: dropType,
          index: dataIdIndex,
          parentId: dropNode.parent.data.id,
        })
        if (res.code === 200) {
          this.$message.success('排序成功')
        }
      }
    },

    // 新增栏目分支
    append(node, data) {
      this.node = node
      this.dialogVisible = true
    },
    async remove(node, data) {
      this.$confirm('是否确定删除？', {}).then(async () => {
        const res = await deleteCategory({
          ids: [data.id],
          treeId: this.$route.query.id,
        })
        if (res.code === 200) {
          this.$message.success('删除成功')
          const parent = node.parent
          console.log(parent)
          const children = parent.childNodes
          console.log(children)
          const index = children.findIndex(d => d.data.id === data.id)
          children.splice(index, 1)
        }
      })
    },
    // 确定
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await saveCategoryInfo({
            name: this.form.name,
            // format: this.form.columnModel,
            // layout: this.form.columnModel,
            categoryTypeId: this.form.categoryTypeId, // figo
            parentId: this.node.data.id,
            treeId: this.treeId,
            serviceOperator: this.form.serviceOperator,
          })
          if (res.code === 200) {
            this.$message.success('创建成功')
            this.$refs.tree.append(res.data, this.node)
            this.resetForm()
          }
        }
      })
    },
    // 取消
    resetForm() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
      this.node = ''
    },
    // 修改
    edit(node, data) {
      this.node = node
      const testId = data.id
      this.node.parent.childNodes.forEach(item => {
        if (item.data.id === testId) {
          item.data.label = '新的'
          item.data.liscenceCount = 555
        }
      })
    },
    // 点击事件
    getNode(data, node) {
      if (!this.highlight) {
        return
      }
      this.$emit('getNode', data, node)
    },
    // 懒加载
    async loadNode(node, resolve) {
      let columnId = ''

      if (node.level !== 0) {
        columnId = node.data.id
      }
      const res = await getSubCategorys({
        treeId: this.treeId || '',
        id: columnId || '',
      })
      if (res.code === 200) {
        resolve(res.data)
        if (node.level === 0) {
          // 初始化选中第一个节点
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res.data[0].id)
            const currentNode = this.$refs.tree.getNode(res.data[0].id)
            this.expandedkeys.push(res.data[0].id)
            this.$emit('getNode', res.data[0], currentNode)
          })
        }
      }
    },
  },
  created() {
    this.getOperators()
    this.getCategoryType2()
  },
}
</script>

<style lang="scss">
.category-tree {
  min-height: 30px;
  .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .tree-item-name {
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $theme-color;
    color: #fff;

    .icon:hover {
      color: #fff;
    }
  }

  .icon {
    font-size: 16px;
    padding: 0 3px;
    &:hover {
      color: $theme-color;
    }
  }
}
</style>
