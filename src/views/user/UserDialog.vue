<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="title"
    @closed="handleClosed"
    @opened="handleOpen"
  >
    <el-form label-width="120px" :model="form" ref="form" :rules="rules">
      <el-form-item prop="name">
        <template #label>角色名称：</template>
        <el-input v-model="form.name" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item prop="keys">
        <template #label>角色权限：</template>
        <el-tabs type="border-card">
          <el-tab-pane label="PC后台权限">
            <div style="max-height: 450px; overflow: auto;">
              <el-tree
                ref="tree"
                :data="treeData"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="form.keys"
                :props="defaultProps"
                @check="handleCheck"
              />
            </div>
          </el-tab-pane>
          <!---// TODO APP权限接口调用--->
          <el-tab-pane label="APP权限">
            <!-- <el-form-item prop="app">
              <template #label class="appLabel">素材管理</template>
              <el-checkbox-group v-model="form.appKeys">
                <el-checkbox :label="1" :key="1">素材库</el-checkbox>
              </el-checkbox-group>
            </el-form-item> -->
            <el-form-item prop="app">
              <div class="setApp">
                <div class="appLabel">应急发布</div>
                <el-checkbox-group v-model="form.appKeys" class="appcheckbox">
                  <el-checkbox :label="1" :key="1">弹窗消息</el-checkbox>
                  <el-checkbox :label="2" :key="2">滚动消息</el-checkbox>
                  <el-checkbox :label="3" :key="3">开机画面</el-checkbox>
                  <el-checkbox :label="2" :key="2">霸屏消息</el-checkbox>
                  <el-checkbox :label="3" :key="3">大喇叭</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <!-- <el-form-item prop="app">
              <template #label class="appLabel">民意调查</template>
              <el-checkbox-group v-model="form.appKeys">
                <el-checkbox :label="1" :key="1">民意调查</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="app">
              <template #label class="appLabel">四情监测</template>
              <el-checkbox-group v-model="form.appKeys">
                <el-checkbox :label="1" :key="1">墒情</el-checkbox>
                <el-checkbox :label="2" :key="2">虫情</el-checkbox>
                <el-checkbox :label="3" :key="3">苗情</el-checkbox>
                <el-checkbox :label="3" :key="3">灾情</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="app">
              <template #label class="appLabel">人居环境</template>
              <el-checkbox-group v-model="form.appKeys">
                <el-checkbox :label="1" :key="1">随手拍</el-checkbox>
                <el-checkbox :label="2" :key="2">村有圈</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="app">
              <template #label class="appLabel">远程服务</template>
              <el-checkbox-group v-model="form.appKeys">
                <el-checkbox :label="1" :key="1">远程视频</el-checkbox>
              </el-checkbox-group>
            </el-form-item> -->
          </el-tab-pane>
        </el-tabs>
        <el-checkbox-group v-model="form.keys" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible')">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { getPermissionTree, getApptreeData, createRole, updateRole } from '@/services/user'
import { actionDisplay } from '@/store/modules/permission'
import shortid from 'shortid'

export default {
  props: {
    editRole: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      treeData: [],
      appTreeData: [],
      defaultProps: {
        children: 'childrens',
        label: 'name',
      },
      form: {
        name: '',
        keys: [],
        appKeys: [],
      },
      rules: {
        name: [{ required: true, message: '请填写角色名称' }],
        keys: [{ required: true, message: '请选择角色权限' }],
      },
    }
  },
  computed: {
    title() {
      return this.editRole.id ? '编辑角色' : '创建角色'
    },
    normalizedTree() {
      const flat = list => {
        console.log(list, 'list')
        return list.reduce((aggregate, current) => {
          aggregate.push(current)
          if (current.childrens && current.childrens.length) {
            return aggregate.concat(flat(current.childrens))
          }
          return aggregate
        }, [])
      }
      return flat(this.treeData)
    },
  },
  created() {
    this.getPermissionTree() // 获取PC权限树
    this.getApptreeData() // 获取APP菜单
  },
  methods: {
    handleOpen() {
      if (this.editRole.id) {
        this.form = {
          name: this.editRole.name,
          keys: this.manualCheckedKeys(this.editRole.permission),
        }
      }
    },
    // 由于保存的时候把halfchecked的节点也保存到数据库，所以编辑的时候不能直接用permission字段的数据，需要根据actions和checked找出勾选的节点
    manualCheckedKeys(permissions = []) {
      return permissions.reduce((checkedKeys, current) => {
        // checked为false表示halfchecked的节点忽略
        if (current.checked) return checkedKeys.concat([current.moduleId])

        return this.normalizedTree
          .filter(n => {
            const action = n.action & current.actions
            return n.parentId === current.moduleId && action === n.action
          })
          .map(i => i.id)
          .concat(checkedKeys)
      }, [])
    },
    handleClosed() {
      this.$refs.form.resetFields()
      this.$refs.tree.setCheckedNodes([])
    },
    handleCheck(data, checked) {
      this.form.keys = checked.checkedKeys
    },
    getNode() {
      const refTree = this.$refs.tree
      const nodes = refTree
        .getCheckedNodes()
        .map(node => ({ ...node, checked: true }))
      const halfCheckedNodes = refTree
        .getHalfCheckedNodes()
        .map(node => ({ ...node, checked: false }))

      // 勾选的操作权限节点
      const actionNodes = nodes.filter(node => node.parentId)
      // 操作权限上级节点
      const actionParentNodes = this.normalizedTree
        .filter(i => actionNodes.some(n => n.parentId === i.id))
        .map(node => ({ ...node, checked: false }))
      // 除操作权限外勾选的节点
      const restNodes = nodes.concat(halfCheckedNodes).filter(node => {
        if (!node.parentId) {
          return !actionParentNodes.some(i => i.id === node.id)
        }
        return false
      })

      return actionParentNodes.concat(restNodes).map(module => {
        const actions = actionNodes
          .filter(n => n.parentId === module.id)
          .map(i => i.action)

        return {
          moduleId: module.id,
          checked: module.checked,
          actions: actions.reduce((total, now) => total + now, 0),
        }
      })
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const body = {
            id: this.editRole.id,
            name: this.form.name,
            permission: this.getNode(),
          }
          const res = this.editRole.id
            ? await updateRole(body)
            : await createRole(body)

          if (res.code === 200) {
            this.$message.success(`${this.editRole.id ? '修改' : '创建'}成功`)
            this.$emit('update:visible', false)
            this.$emit('complete')
          }
        }
      })
    },
    // 获取APP菜单
    async getApptreeData() {
      const res = await getApptreeData()
      console.log(res)



    },
    // 获取PC权限树
    async getPermissionTree() {
      const res = await getPermissionTree()
      console.log(res, 'res')
      const generateActionList = (
        displayMap,
        actionValue,
        parentId,
        disabled,
      ) => {
        const keys = Object.keys(displayMap).map(k => +k)

        return keys
          .map(k => ({
            id: shortid.generate(),
            name: displayMap[k],
            action: k,
            parentId,
            disabled,
          }))
          .filter(i => i.action & actionValue)
      }

      /**
       * 在最后一级插入操作列表
       */
      const assertAction = list => {
        return list.map(l => {
          const { disabled = false } = l
          if (l.childrens.length) {
            return {
              ...l,
              childrens: assertAction(l.childrens),
            }
          } else {
            return {
              ...l,
              childrens: generateActionList(
                actionDisplay,
                l.actions,
                l.id,
                disabled,
              ),
            }
          }
        })
      }
      this.treeData = assertAction(res.data)
    },
  },
}
</script>
<style scoped>
.setApp{
  display: flex;
  justify-content: space-between;
}
.appLabel{
  width:110px;
  font-weight:700;
}
.appcheckbox{
  flex:1
}
</style>
