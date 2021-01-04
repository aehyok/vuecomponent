<template>
  <div>
    <el-form-item label="跳转内容版式：" prop="navigate">
      <el-select
        :value="navigate"
        @change="handleNavigateTypeChange"
        value-key="value"
        v-if="thisType !== 'detail'"
      >
        <el-option
          v-for="i in navigateTypes"
          :key="i.value"
          :value="i.value"
          :label="i.name"
        />
      </el-select>
      <span v-else>{{ navigate | navigateTypesFilter(this) }}</span>
    </el-form-item>
    <el-form-item
      prop="navigateImages"
      label="图片选取："
      v-if="navigate !== 2 && navigate !== 4"
    >
      <el-checkbox-group v-model="pictures"></el-checkbox-group>
      <div style="color: #999;">
        不超过20张，图片建议尺寸454x416px，支持jpg、jpeg、png，每张大小不超过2M
      </div>
      <el-checkbox-group v-model="pictures"></el-checkbox-group>
      <PictureGroup
        :picType="thisType"
        :limit-count="20"
        @add="handleImageAdd"
        @remove="handleImageRemove"
        :receivefatData="pictures"
        v-bind="$attrs"
        :showUpLoadBtn="true"
      />
    </el-form-item>
    <el-form-item
      prop="navigateVideos"
      label="视频选取："
      v-if="navigate === 2"
    >
      <el-checkbox-group v-model="videos"></el-checkbox-group>
      <VideoPicker
        :thisType="thisType"
        :source="videos"
        @add="handleVideoAdd"
        @remove="handleVideoRemove"
        :showUpLoadBtn="true"
        :serviceProvider="serviceProvider"
      />
    </el-form-item>
    <el-form-item prop="navigateText" label="文字内容：" v-if="navigate === 1 || navigate === 4">
      <el-input
        type="textarea"
        rows="5"
        :value="text"
        @input="v => onFieldChange({ navigateText: v })"
        v-if="thisType !== 'detail'"
      ></el-input>
      <span v-else>{{ text ? text : '--' }}</span>
    </el-form-item>
  </div>
</template>
<script>
import PictureGroup from '@/components/pictureGroup'
import VideoPicker from '@/components/VideoPicker'
export default {
  props: {
    thisType: {
      type: String,
      default: 'add',
    },
    navigate: {
      type: Number,
      required: true,
    },
    pictures: {
      type: Array,
      required: true,
    },
    videos: {
      type: Array,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    onFieldChange: {
      type: Function,
      required: true,
    },
    /**
     * 适用运营商
     */
    serviceProvider: {
      default: 0,
    },
  },
  components: {
    PictureGroup,
    VideoPicker,
  },
  data() {
    return {
      navigateTypes: [
        { name: '图片', value: 3 },
        { name: '图文', value: 1 },
        { name: '视频', value: 2 },
        { name: '纯文字', value: 4 },
      ],
      images: [],
      innerVideos: [],
    }
  },
  filters: {
    navigateTypesFilter(val, that) {
      const selitem = that.navigateTypes.find(item => item.value === val)
      if (selitem) {
        return selitem.name
      } else {
        return '--'
      }
    },
  },
  methods: {
    handleNavigateTypeChange(n) {
      this.onFieldChange({ navigate: n })
    },
    handleImageAdd(data) {
      this.onFieldChange({ navigateImages: data })
    },
    handleImageRemove({ id }) {
      this.onFieldChange({
        navigateImages: this.pictures.filter(p => p.id !== id),
      })
    },
    handleVideoAdd(data) {
      this.onFieldChange({ navigateVideos: data })
    },
    handleVideoRemove({ id }) {
      this.onFieldChange({
        navigateVideos: this.videos.filter(p => p.id !== id),
      })
    },
  },
}
</script>
