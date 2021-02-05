<template>
  <div class="tree">
    <el-tree
      ref="tree"
      :category="category"
      :draggable="draggable"
      :data="treeData"
      node-key="id"
      :allow-drop="allowDrop"
      :props="defaultProps"
      :expand-on-click-node="false"
      :highlight-current="highlight"
      :default-expand-all="true"
      :show-checkbox="showCheckbox"
      :check-strictly="true"
      @node-expand="nodeExpand"
      @node-drag-enter="dragEnter"
      @node-drop="dropData"
      @node-click="getNode"
      :allow-drag="allowDrag"
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
          <i
            class="el-icon-circle-plus-outline icon"
            v-permission="'create'"
            @click.stop="() => append(node, data)"
          ></i>
          <i
            class="el-icon-delete icon"
            v-if="node.level !== 1"
            v-permission="'delete'"
            @click.stop="() => remove(node, data)"
          >
          </i>
        </span>
      </span>
    </el-tree>
    <!-- 弹窗 -->
    <el-dialog
      title="新建组织"
      :visible.sync="dialogTableVisible"
      @close="resetForm('gridData')"
    >
      <el-form
        :model="gridData"
        :rules="rules"
        label-width="120px"
        ref="gridData"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input
            v-model="gridData.name"
            maxlength="15"
            placeholder="最多15个字"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="region">
          <el-button type="primary" @click="regionVisible = true"
            >选择所属区域</el-button
          >
          <span style="margin-left: 6px">{{ gridData.region }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('gridData')">
          保存
        </el-button>
        <el-button @click="resetForm('gridData')">取消</el-button>
      </div>
    </el-dialog>
    <OrganizationManageRegion
      :visible.sync="regionVisible"
      @saved="region => (gridData.region = region)"
    />
  </div>
</template>

<script>
import OrganizationManageRegion from '@/views/organizationManage/OrganizationManageRegion'
import {
  getOrgTree,
  saveOrg,
  deleteOrg,
  // getFullOrgTree,
} from '@/services/organization'

export default {
  props: {
    normalOrgId: {
      type: String,
    },
    category: {
      dafault: '',
      type: Number,
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
    showFirst: {
      dafault: false,
      type: Boolean,
    },
    showCheckbox: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    OrganizationManageRegion,
  },
  data() {
    return {
      node: '',
      parentId: '',
      dialogTableVisible: false,
      regionVisible: false,
      gridData: {
        name: '',
        region: '',
      },
      treeData: [],
      rules: {
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
      },
      expandedkeys: [],
      noChildNodes: true, // 判断进入的位置是否有子节点
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
      },
    }
  },

  created() {
    console.log(this.$attrs)
    const user = JSON.parse(localStorage.getItem('loginInfo'))
    console.log(this.normalOrgId, 'normal')
    this.userOrgId = this.normalOrgId || user.orgId
    this.getTreeData()

    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.userOrgId)
      const node = this.$refs.tree.getCurrentNode()
      this.$emit('getNode', { id: this.userOrgId }, node)
    })
  },
  watch: {
    normalOrgId: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.userOrgId = val
            this.setCurrentNodeFun()
          })
        }
        console.log(val, 'val')
      },
      immediate: true,
    },
  },
  methods: {
    setCurrentNodeFun() {
      console.log(this.userOrgId, 'userOrgId')
      this.$refs.tree.setCurrentKey(this.userOrgId)
    },
    // 禁用没一个项的checkbox
    addDisabled(data) {
      data.forEach(item => {
        if ('children' in item && item.children.length > 0) {
          item.disabled = true
          item.children = this.addDisabled(item.children)
        } else {
          item.disabled = true
        }
      })
      return data
    },
    async getTreeData() {
      // const user = JSON.parse(localStorage.getItem('loginInfo'))
      const res = {
        code: 200,
        message: 'success',
        data: {
          id: '5f4764225cbf7500136db76a',
          name: 'root',
          parentId: null,
          displayName: 'root',
          logo: '',
          remark: '组织树根节点',
          region: '广东省湛江市徐闻县曲界镇四河村',
          children: [
            {
              id: '5f477d31e9728000132bfc33',
              name: '深圳',
              parentId: '5f4764225cbf7500136db76a',
              displayName: '深圳',
              logo: '5f47712e5cbf7500136db7c5',
              remark: '',
              region: '广东省',
              children: [
                {
                  id: '5f51a0aa9dc40000131d530b',
                  name: '测试',
                  parentId: '5f477d31e9728000132bfc33',
                  displayName: '',
                  logo: '',
                  remark: '',
                  region: '广东省广州市天河区员村',
                  children: [],
                },
                {
                  id: '5f5a0b17848c1c00123d8c1b',
                  name: '南山区',
                  parentId: '5f477d31e9728000132bfc33',
                  displayName: '',
                  logo: '5f47712e5cbf7500136db7c5',
                  remark: '',
                  region: '广东省湛江市徐闻县曲界镇三河村',
                  children: [
                    {
                      id: '5f5a0b68848c1c00123d8c26',
                      name: '粤海街道',
                      parentId: '5f5a0b17848c1c00123d8c1b',
                      displayName: '南山必胜客',
                      logo: '5f50915d829eb8001df50acc',
                      remark: '',
                      region: '陕西省咸阳市杨陵区杨陵街道乔家底村',
                      children: [],
                    },
                    {
                      id: '5f8e9013550c213eb4d5e5e9',
                      name: '杨陵区五泉镇',
                      parentId: '5f5a0b17848c1c00123d8c1b',
                      displayName: '杨陵区五泉镇',
                      logo: '5f50915d829eb8001df50acc',
                      remark: '备注',
                      region: '陕西省咸阳市杨陵区五泉镇王上村',
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
      // await getFullOrgTree({
      //   orgId: user.orgId,
      // })
      if (res.code === 200) {
        console.log(this.$attrs)
        if (!this.$attrs.thisType || this.$attrs.thisType !== 'detail') {
          this.treeData = [res.data]
        } else {
          const newData = this.addDisabled(
            JSON.parse(JSON.stringify([res.data])),
          )
          this.treeData = newData
        }
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.userOrgId)
          const node = this.$refs.tree.getCurrentNode()
          this.$emit('getNode', { id: this.userOrgId }, node)
        })
      }
    },
    // 判断节点能否被拖拽
    allowDrag(draggingNode) {
      console.log(draggingNode)
      // if (draggingNode.data.id === '5f16649624cd120013dffabc') {
      //   return false
      // }
      return true
    },
    // 节点展开时触发
    nodeExpand(data, node) {
      console.log(data, node)
    },
    // 拖拽进入其他节点时触发的事件
    dragEnter(draggingNode, dropNode, ev) {
      console.log(draggingNode, dropNode, '进入')
      if (dropNode.childNodes.length <= 0) {
        this.noChildNodes = false
        console.log('++++++++++++++++++++++++++++')
      } else {
        this.noChildNodes = true
      }
    },
    // 拖拽成功完成时触发的事件
    dropData(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode, dropNode, dropType, ev, '完成')
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
        console.log(dataIdIndex)
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
    // 新增
    append(node, data) {
      console.log(node, data)
      this.node = node
      this.parentId = data.id
      this.dialogTableVisible = true
    },
    remove(node, data) {
      this.node = node
      this.checkBox({
        title: '提示',
        message: `确定删除吗？`,
        type: 'warning',
        confirmBtnText: '删除',
        confirmBtnFun: () => {
          this.removeOrgan(data)
        },
        cancelBtnFun: () => {
          console.log('取消删除')
        },
      })
    },
    async removeOrgan(data) {
      const res = await deleteOrg({
        id: data.id,
      })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.$refs.tree.remove(this.node)
        this.$emit('delNode', data)
      } else {
        this.$message.error(`删除失败，${res.message}`)
      }
    },
    // 二次确认框(封装)
    checkBox(data) {
      const {
        title,
        message,
        type,
        showCancelBtn,
        cancelBtnText,
        confirmBtnText,
        cancelBtnFun,
        confirmBtnFun,
      } = data
      // console.log(showCancelBtn)
      this.$confirm(message, title, {
        confirmButtonText: confirmBtnText || '确定',
        cancelButtonText: cancelBtnText || '取消',
        type: type || 'success',
        showCancelButton: showCancelBtn,
      })
        .then(() => {
          if (typeof confirmBtnFun === 'function') {
            confirmBtnFun()
          }
        })
        .catch(() => {
          if (typeof cancelBtnFun === 'function') {
            cancelBtnFun()
          }
        })
    },
    // 提交表格数据
    async postSaveOrg() {
      const res = await saveOrg({
        id: '',
        name: this.gridData.name,
        region: this.gridData.region,
        displayName: '',
        parentId: this.parentId,
        logo: '',
        remark: '',
      })
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.getTreeData()
        // if (this.node.childNodes.length > 0) {
        //   const data = {
        //     ...res.data,
        //     children: [],
        //     leaf: true,
        //   }
        //   this.$refs.tree.append(data, this.node)
        // } else if (this.node.parent && this.node.parent.data) {
        //   const childNodes = []
        //   this.node.parent.childNodes.forEach(item => {
        //     if (item.data.id === this.node.data.id) {
        //       item.data.leaf = false
        //     }
        //     childNodes.push(item.data)
        //   })
        //   const pid = this.node.parent.data.id
        //   this.$refs.tree.updateKeyChildren(pid, childNodes)
        // }
        this.resetForm('gridData')
      } else {
        this.$message.error(res.message)
      }
    },

    // 获取节点
    async getOrgTree(orgId) {
      const res = await getOrgTree({
        orgId: orgId || '',
      })
      if (res.code === 200) {
        return res.data
      }
    },
    getNode(data, node) {
      console.log(data, 'data')
      this.$emit('getNode', data, node)
    },
    // 放下事件（判断节点能否放置）
    allowDrop(draggingNode, dropNode, type) {
      // 需要先判断父亲节点是否能带不能修改标识
      if (dropNode.data.id === 1 && type !== 'inner') {
        return false
      }
      return true
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postSaveOrg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogTableVisible = false
    },
  },
}
</script>

<style lang="scss">
.tree {
  min-height: 30px;
  margin-top: 20px;
  // max-height: 400px;
  .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }
}
.tree .custom-tree-node {
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
.icon {
  font-size: 16px;
  padding: 0 3px;
  &:hover {
    color: $theme-color;
  }
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: $theme-color;
  color: #fff;
  .icon:hover {
    color: #fff;
  }
}
</style>
