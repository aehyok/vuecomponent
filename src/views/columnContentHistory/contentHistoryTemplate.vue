<template>
  <div>
    <component
      :is="componentName"
      :visible.sync="visible"
      :source="detail"
      thisType="detail"
      @closed="closedBtn"
    />
  </div>
</template>

<script>
import { getAuditRecordDetail } from '@/services/columnReview'
import PictureLayoutHi from '@/views/columnContentHistory/PictureLayoutHi'
import PictureListLayoutHi from '@/views/columnContentHistory/PictureListLayoutHi'
import VideoLayoutHi from '@/views/columnContentHistory/VideoLayoutHi'
import ImageTextLayoutHi from '@/views/columnContentHistory/ImageTextLayoutHi'
import TextListLayoutHi from '@/views/columnContentHistory/TextListLayoutHi'
export default {
  props: {
    historyType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      columnLayout: -1,
      detail: {},
      visible: false,
    }
  },
  components: {
    PictureLayoutHi,
    PictureListLayoutHi,
    VideoLayoutHi,
    ImageTextLayoutHi,
    TextListLayoutHi,
  },
  computed: {
    componentName() {
      const componentMap = {
        2: 'PictureLayoutHi',
        3: 'VideoLayoutHi',
        4: 'ImageTextLayoutHi',
        5: 'TextListLayoutHi',
        6: 'PictureListLayoutHi',
        7: 'InvestigateLayoutHi',
      }
      return componentMap[this.columnLayout]
    },
  },
  methods: {
    async getDetail(id) {
      // this.detail = row
      const loading = this.$loading({
        background: 'transpanrent',
      })
      const res = await getAuditRecordDetail({ id })

      loading.close()
      if (res.code === 200) {
        if (this.historyType === 'before') {
          this.detail = res.data.frontContent
          this.columnLayout =
            res.data.frontContent.formatType ||
            res.data.frontContent.contentType
        } else {
          this.detail = res.data.afterContent
          this.columnLayout =
            res.data.afterContent.formatType ||
            res.data.frontContent.contentType
        }
        console.log(this.columnLayout, 'kkk')
        this.visible = true
      }
    },
    closedBtn() {
      this.detail = {}
      this.visible = false
    },
  },
  created() {
    this.visible = true
    this.getDetail(this.$route.query.id)
  },
}
</script>
