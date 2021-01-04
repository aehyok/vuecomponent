<template>
  <div>
    <div class="title">
      主菜单背景图片：
      <span>最多一张图片支持jpg、jpeg、png，大小不超过2M</span>
    </div>
    <div style="margin-top: 20px;">
      <PictureGroup
        :limitCount="1"
        @add="handlePictureSeclection"
        @remove="handlePictureRemove"
        :receivefatData="backgroundImageList"
        :picType="picType"
        serviceProvider=""
        :showUpLoadBtn="true"
      />
    </div>
    <div class="footer" v-if="picType === 'add'">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="save">暂存</el-button>
    </div>
  </div>
</template>

<script>
import PictureGroup from '@/components/pictureGroup'
import { saveCategoryInfo, getCategoryDetail } from '@/services/category'
export default {
  components: {
    PictureGroup,
  },
  props: {
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
      async handler(id) {
        const orgId = this.$route.query.orgId
        const { code, data } = await getCategoryDetail({ id, orgId })
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
    async save() {
      // TODO 栏目信息保存
      console.log(this.detail)
      const res = await saveCategoryInfo({
        ...this.detail,
        treeId: this.$route.query.id,
        background: this.detail.background,
        orgId: this.$route.query.orgId,
      })

      if (res.code === 200) {
        this.$message.success('保存成功')
      }
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
