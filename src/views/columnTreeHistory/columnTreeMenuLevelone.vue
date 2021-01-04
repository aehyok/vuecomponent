<template>
  <div>
    <div class="title">
      主菜单背景图片：
      <!-- <span>最多一张图片建议尺寸 xx，支持jpg、jpeg、png，大小不超过2M</span> -->
    </div>
    <div style="margin-top: 20px;">
      <PictureGroup
        :limitCount="1"
        @add="handlePictureSeclection"
        @remove="handlePictureRemove"
        :receivefatData="backgroundImageList"
        :picType="picType"
      />
    </div>
  </div>
</template>

<script>
import PictureGroup from '@/components/pictureGroup'
import { getAuditCategoryDetail } from '@/services/columnReview'
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
      detail: {},
    }
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
        }
      },
      immediate: true,
    },
  },
  computed: {
    backgroundImageList() {
      if (this.detail.background)
        return [
          { id: this.detail.background, url: this.detail.backgroundInfo.url },
        ]
      return []
    },
  },
  methods: {
    handlePictureSeclection(data) {
      this.detail = {
        ...this.detail,
        background: data[0].id,
        backgroundInfo: { url: data[0].url },
      }
      // this.save()
    },
    handlePictureRemove({ id }) {
      this.detail.background = null
      this.detail.backgroundUrl = null
      // this.save()
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  span {
    font-size: 14px;
    color: #999;
    text-align: left;
  }
}
.footer {
  margin-top: 20px;
}
</style>
