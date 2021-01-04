<template>
  <div>
    <el-form
      :model="formData"
      :rules="formRules"
      :label-width="labelWidth"
      ref="form"
    >
      <el-form-item label="栏目名称：" prop="name">
        <el-input
          v-model.trim="formData.name"
          placeholder="请输入栏目名称"
          v-if="type !== 'detail'"
        />
        <span v-else>{{ formData.name }}</span>
      </el-form-item>
      <el-form-item label="栏目显示名称：" prop="showName">
        <el-input
          v-model.trim="formData.showName"
          placeholder="请输入栏目显示名称"
          v-if="type !== 'detail'"
        />
        <span v-else>{{ formData.showName }}</span>
      </el-form-item>
      <el-form-item label="栏目类型：" prop="categoryTypeId">
        <el-select
          v-if="type !== 'detail'"
          v-model="formData.categoryTypeId"
          placeholder="请选择"
        >
          <el-option
            :label="m.label"
            :value="m.value"
            v-for="m in columnTypeList"
            :key="m.label"
          ></el-option>
        </el-select>
        <span v-else>{{
          formData.categoryTypeId | columnTypeFilter(this)
        }}</span>
      </el-form-item>
      <!-- <el-form-item label="栏目布局：" prop="columnModel">
        <el-select
          v-if="type !== 'detail'"
          v-model="formData.columnModel"
          placeholder="请选择"
        >
          <el-option
            v-for="c in columnLayouts"
            :key="c.value"
            :value="c.value"
            :label="c.label"
          />
        </el-select>
        <span v-else>{{
          formData.columnModel | columnLayoutsFilter(this)
        }}</span>
      </el-form-item> -->
      <el-form-item label="适用运营商：" prop="serviceOperator">
        <el-select
          v-model="formData.serviceOperator"
          placeholder="请选择"
          v-if="type !== 'detail'"
        >
          <el-option
            v-for="item in operatorList"
            :key="item.id"
            :value="item.operatorId"
            :label="item.name"
          ></el-option>
        </el-select>
        <span v-else>{{
          formData.serviceOperator | filterServiceOperator(this)
        }}</span>
      </el-form-item>
      <el-form-item label="栏目图标：" prop="columnIcon">
        <!-- <div class="tipsbox">
          图片建议尺寸 xx，支持jpg、jpeg、png，大小不超过2M
        </div> -->
        <ul style="display:flex;">
          <li>
            <PictureGroup
              :limitCount="1"
              @add="handlePictureAddNormal"
              @remove="handlePictureRemoveNormal"
              :receivefatData="normalImageList"
              :picType="picType"
            />
            <div>普通栏目图标</div>
          </li>
          <li>
            <PictureGroup
              :limitCount="1"
              @add="handlePictureSeclectionHilight"
              @remove="handlePictureRemoveHilight"
              :receivefatData="hightlightImageList"
              :picType="picType"
            />
            <div>高亮栏目图标</div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="栏目关联图：" prop="relativeImage">
        <div>
          <!-- <div class="tipsbox">
            <span>
              在主菜单跟随栏目切换展示图片建议尺寸
              xx，支持jpg、jpeg、png，大小不超过2M
            </span>
            <el-button type="text">重置关联图</el-button>
            <el-popover placement="top-start" width="400" trigger="hover">
              <div>重置后，将使用上级组织的栏目关联图，如下图</div>
              <i class="el-icon-question question" slot="reference"></i>
            </el-popover>
          </div> -->
          <PictureGroup
            :limitCount="1"
            @add="handlePictureSeclectionRelation"
            @remove="handlePictureRemoveRelation"
            :receivefatData="relativeImageList"
            :picType="picType"
          />
        </div>
      </el-form-item>
      <el-form-item label="背景图：" prop="background">
        <!-- <div class="tipsbox">
          最多一张，图片建议尺寸xx，支持jps、jpeg、png，每张大小不超过2M
        </div> -->
        <PictureGroup
          :limitCount="1"
          @add="handlePictureSeclectionBackground"
          @remove="handlePictureRemoveBackground"
          :receivefatData="backgroundImageList"
          :picType="picType"
        />
      </el-form-item>
      <el-form-item label="是否锁定：" prop="columnIcon">
        <div>
          <!-- <p style="color: #999;">锁定后下级组织无法修改栏目配置</p> -->
          <el-radio-group
            v-model="formData.isLock"
            :disabled="type === 'detail'"
          >
            <el-radio :label="false">不锁定</el-radio>
            <el-radio :label="true">锁定</el-radio>
          </el-radio-group>
          <!-- <span>{{ formData.isLock ? '锁定' : '不锁定' }}</span> -->
        </div>
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-input
          type="textarea"
          v-model="formData.remark"
          v-if="type !== 'detail'"
          maxlength="200"
          placeholder="请输入备注信息，不超过200字"
        />
        <span v-else>{{ formData.remark | transformFalsy }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PictureGroup from '@/components/pictureGroup'
import { getAuditCategoryDetail } from '@/services/columnReview'
import { layoutListMoudel } from '@/utils/mappableState'
// import { getCategoryType } from '@/services/index'
import { getCategoryTypeList } from '@/services/category'
import { getOperatorList } from '@/services/iptv'

export default {
  components: {
    PictureGroup,
  },
  props: {
    direction: {
      type: [String, Number], // 1更新前，2更新后
      required: true,
    },
    recordId: {
      type: String,
      required: true,
    },
    picType: {
      type: String,
      default: 'add',
    },
    categoryId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      labelWidth: '120px',
      operatorList: [],
      formData: {
        name: '', // 栏目名称
        showName: '', // 栏目显示名称
        categoryTypeId: '', // 栏目类型
        columnModel: '', // 栏目版式
        description: '', // 备注
        locking: true, // 是否锁定
        relativeImage: '',
        background: '',
        serviceOperator: '',
        icons: [{ spec: 1, normal: '', highlight: '' }],
      },
      columnTypeList: [],
      detail: {},
      icons: {},
      /**
       * 1 图片，2 图片列表，3 视频，4 图片文字列表，5 图片文字
       */
      columnLayouts: layoutListMoudel,
      formRules: {
        name: [{ required: true, message: '请输入栏目名称' }],
        showName: [{ required: true, message: '请输入栏目显示名称' }],
        categoryTypeId: [{ required: true, message: '请选择栏目类型' }],
        columnModel: [{ required: true, message: '请选择栏目版式' }],
      },
    }
  },
  filters: {
    filterServiceOperator(val, that) {
      const selitem = that.operatorList.find(item => item.operatorId === val)
      if (selitem) {
        return selitem.name
      } else {
        return '--'
      }
    },
    columnTypeFilter(val, that) {
      const selitem = that.columnTypeList.find(item => item.id === val)
      console.log(val)
      if (selitem) {
        return selitem.name
      } else {
        return '--'
      }
    },
    columnLayoutsFilter(val, that) {
      const selitem = that.columnLayouts.find(item => item.value === val)
      if (selitem) {
        return selitem.label
      } else {
        return '--'
      }
    },
  },
  watch: {
    categoryId: {
      async handler() {
        const { code, data } = await getAuditCategoryDetail({
          id: this.categoryId,
          recordId: this.recordId,
          direction: this.direction,
        })
        if (code === 200) {
          this.detail = data
          this.detail.backgroundUrl = this.detail.backgroundInfo?.url
          this.detail.relativeImageUrl = this.detail.relativeImageInfo?.url
          this.icons = this.detail.icons.length > 0 ? this.detail.icons[0] : {}
          if (this.detail.icons.length > 0) {
            this.icons.normalUrl = this.icons.normalInfo.url
            this.icons.highlightUrl = this.icons.highlightInfo.url
          }
          this.formData = {
            name: data.name,
            categoryTypeId: data.categoryTypeId,
            columnModel: data.layout,
            isLock: data.isLock,
            remark: data.remark,
            showName: data.displayName,
            serviceOperator: data.serviceOperator,
            icons: data.icons,
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    type() {
      const type = this.picType === 'add' ? '' : 'detail'
      return type
    },
    normalImageList() {
      if (this.icons.normal)
        return [{ id: this.icons.normal, url: this.icons.normalUrl }]
      return []
    },
    hightlightImageList() {
      if (this.icons.highlight)
        return [{ id: this.icons.highlight, url: this.icons.highlightUrl }]
      return []
    },
    backgroundImageList() {
      if (this.detail.background)
        return [{ id: this.detail.background, url: this.detail.backgroundUrl }]
      return []
    },
    relativeImageList() {
      if (this.detail.relativeImage)
        return [
          { id: this.detail.relativeImage, url: this.detail.relativeImageUrl },
        ]
      return []
    },
  },
  created() {
    this.getOperators()
    this.getCategoryType2()
  },
  methods: {
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
    async getCategoryType2() {
      const res = await getCategoryTypeList({ page: 1, limit: 1000 })
      if (res.code === 200) {
        this.columnTypeList = res.data.docs
      }
    },
    handlePictureAddNormal(data) {
      this.icons = { ...this.icons, normal: data[0].id, normalUrl: data[0].url }
    },
    handlePictureRemoveNormal({ id }) {
      this.icons.normal = null
      this.icons.normalUrl = null
    },
    handlePictureSeclectionHilight(data) {
      this.icons = {
        ...this.icons,
        highlight: data[0].id,
        highlightUrl: data[0].url,
      }
    },
    handlePictureRemoveHilight({ id }) {
      this.icons.highlight = null
      this.icons.highlightUrl = null
    },
    handlePictureSeclectionRelation(data) {
      this.detail = {
        ...this.detail,
        relativeImage: data[0].id,
        relativeImageUrl: data[0].url,
      }
    },
    handlePictureRemoveRelation({ id }) {
      this.detail.relativeImage = null
      this.detail.relativeImageUrl = null
    },
    handlePictureSeclectionBackground(data) {
      this.detail = {
        ...this.detail,
        background: data[0].id,
        backgroundUrl: data[0].url,
      }
    },
    handlePictureRemoveBackground({ id }) {
      this.detail.background = null
      this.detail.backgroundUrl = null
    },
    derivedIconsProps(key) {},
    getChannelImgData(data, type) {
      console.log(data, type)
    },
  },
}
</script>

<style lang="scss" scoped>
.tipsbox {
  color: #999;
}
.question {
  font-size: 20px;
  color: $theme-color;
  cursor: pointer;
}
.footer {
  padding-left: 120px;
}
</style>
