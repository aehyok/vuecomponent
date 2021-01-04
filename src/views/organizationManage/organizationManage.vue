<template>
  <div>
    <div style="height: 100%;">
      <div class="container">
        <!-- 树结构 -->
        <div class="left-tree">
          <orginTree
            ref="tree"
            :lazy="true"
            :highlight="true"
            :showTool="true"
            :normalShow="normalShow"
            @getNode="getNode"
            @delNode="delNode"
          />
        </div>
        <!-- 右侧内容 -->
        <div class="right-content">
          <el-form
            :model="organFormData"
            :rules="rules"
            label-width="120px"
            ref="organFormData"
            v-loading="isLoading"
            v-if="node && organFormData.id"
          >
            <el-form-item label="组织ID" prop="id">
              <span>{{ organFormData.id }}</span>
            </el-form-item>
            <el-form-item label="组织名称" prop="name">
              <el-input
                v-if="isUpdate"
                v-model="organFormData.name"
                maxlength="15"
                placeholder="最多15个字"
              />
              <span v-if="!isUpdate">{{ organFormData.name }}</span>
            </el-form-item>
            <el-form-item label="显示名称" prop="displayName">
              <el-input
                v-model="organFormData.displayName"
                v-if="isUpdate"
              ></el-input>
              <span v-if="!isUpdate">{{ organFormData.displayName }}</span>
            </el-form-item>
            <el-form-item label="Logo">
              <div class="imgbox">
                <PictureGroup
                  v-if="isUpdate"
                  :receivefatData="logoImgList"
                  @add="getLogoImgData"
                  @remove="logoImgList = []"
                />
                <el-image
                  v-if="!isUpdate"
                  style="width: 170px; height: 160px"
                  :src="logoUrl"
                >
                  <div slot="error" class="image-slot">
                    未上传图片
                  </div></el-image
                >
              </div>
              <p style="color: #999;" v-show="isUpdate">
                若不选取logo图片，那么epg将展示账号对应的运营商图片
              </p>
            </el-form-item>
            <el-form-item label="所属区域" prop="remark">
              <el-button
                type="primary"
                @click="regionVisible = true"
                v-if="isUpdate"
                >选择所属区域</el-button
              >
              <span style="margin-left: 6px">{{ organFormData.region }}</span>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-if="isUpdate"
                type="textarea"
                resize="none"
                v-model="organFormData.remark"
                maxlength="10000"
              ></el-input>
              <span v-if="!isUpdate">{{ organFormData.remark }}</span>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('organFormData')"
                v-if="isUpdate"
                >保存</el-button
              >

              <el-button
                type="primary"
                v-if="!isUpdate"
                @click="isUpdate = true"
                v-permission="'update'"
                >编辑</el-button
              >
              <!-- <el-button @click="resetForm('organFormData')">重置</el-button> -->
            </el-form-item>
          </el-form>
          <div v-else>
            <p
              style="color:#666;font-size:30px;text-align:center;padding-top:20px;"
            >
              请先在左侧选择需要管理的组织
            </p>
          </div>
        </div>
      </div>
    </div>
    <OrganizationManageRegion
      :visible.sync="regionVisible"
      @saved="savedRegion"
    />
  </div>
</template>

<script>
import orginTree from '@/components/organizationTree'
import PictureGroup from '@/components/pictureGroup'
import OrganizationManageRegion from './OrganizationManageRegion'
import { getOrgDetail, saveOrg } from '@/services/organization'

export default {
  components: {
    orginTree,
    PictureGroup,
    OrganizationManageRegion,
  },
  data() {
    return {
      node: '',
      isLoading: false,
      regionVisible: false,
      logoImgList: [], // logo列表
      normalShow: [0],
      organFormData: {
        id: '', // id
        region: '',
        name: '', // 组织名称
        displayName: '', // 显示名称
        remark: '', // 备注
      },
      rules: {
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
      },
      isUpdate: false,
      logoUrl: '',
    }
  },
  methods: {
    // 获取详情
    async getOrgDetailFun(id) {
      this.isLoading = true
      const res = await getOrgDetail({
        id,
      })
      if (res.code === 200) {
        const data = res.data
        this.organFormData.id = data.id
        this.organFormData.name = data.name
        this.organFormData.displayName = data.displayName
        this.organFormData.remark = data.remark
        this.organFormData.region = data.region
        this.logoUrl = data.url
        this.logoImgList = data.logo ? [{ id: data.logo, url: data.url }] : []
      } else {
        this.$message.error(res.message)
        console.log('a')
      }
      this.isLoading = false
    },
    delNode(data) {
      if (this.organFormData.id === data.id) {
        this.node = ''
        this.organFormData.id = ''
      }
    },
    getNode(data, node) {
      this.node = node
      this.getOrgDetailFun(data.id)
    },
    getLogoImgData(data) {
      this.logoImgList = data
    },
    // 提交表格数据
    async postSaveOrg() {
      const logo = this.logoImgList.map(l => l.id).join('')
      const parentId = this.node.parent ? this.node.parent.id : ''
      const res = await saveOrg({
        id: this.organFormData.id,
        name: this.organFormData.name,
        displayName: this.organFormData.displayName,
        region: this.organFormData.region,
        logo,
        parentId,
        remark: this.organFormData.remark,
      })
      if (res.code === 200) {
        this.isUpdate = false
        this.$message.success('保存成功')
        this.$refs.tree.updateName(this.node, this.organFormData)
        this.getOrgDetailFun(this.organFormData.id)
      } else {
        this.$message.error(res.message)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postSaveOrg()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    savedRegion(region) {
      this.organFormData.region = region
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
  width: 360px;
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
