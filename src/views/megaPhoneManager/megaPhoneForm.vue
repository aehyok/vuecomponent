<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="dialogTitle"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-form
      class="messageForm"
      :model="formData"
      label-width="120px"
      ref="form"
      :rules="rules"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model.trim="formData.title"
          type="text"
          maxlength="30"
          placeholder="请输入标题，不超过30个字符"
        />
      </el-form-item>
      <el-form-item class="formItem" label="语音来源：" prop="type">
        <el-select v-model="formData.type">
          <el-option
            v-for="i in popupTypes"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="formItem" label="上传语音：" prop="audios" v-if="formData.type === 1">
        <el-checkbox style="display:none;" v-model="formData.audios" />
        <AudioPicker />
      </el-form-item>
      <el-form-item
        class="formItem"
        label="文字转语音："
        prop="audios"
        v-if="formData.type === 2">
        <el-checkbox style="display:none;" v-model="formData.audios" />
        <div class="audio-content">
          <audio ref="audio" :src="url" controls>
              不支持播放
          </audio>
          <el-button
            type="danger"
            class="btn"
            @click="showAudio = true">
              删除
          </el-button>
        </div>
        <el-input
          type="textarea"
          :rows="3"
          style="padding-top:25px"
          placeholder="请输入要转语音的文字内容，不超过XX字符"
          v-model="formData.content">
        </el-input>
        <div style="float:right">
            <el-button
              type="text"
              @click="contentConvertAudio">
              生成语音文件
            </el-button>
        </div>
      </el-form-item>
      <el-form-item label="背景图：" prop="image">
        <el-checkbox style="display:none;" v-model="formData.image" />
        <PictureGroup
          :limitCount="1"
          @add="handlePictureSeclection"
          @remove="handlePictureRemove"
          :receivefatData="formData.image"
        />
      </el-form-item>
      <el-form-item class="formItem" label="有效时长：" prop="type">
        <el-select v-model="formData.expiryDuration">
          <el-option
            v-for="i in expiryDurationTypes"
            :key="i.value"
            :label="i.label"
            :value="i.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布范围：" prop="ranges">
        <el-checkbox-group v-model="formData.ranges"></el-checkbox-group>
        <IssuedRange
          :visible.sync="rangeVisible"
          @confirm="data => (formData.ranges = data)"
          :checked-keys="formData.ranges"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="save(false)">暂存</el-button>
      <el-button type="primary" @click="save(true)">提交审核</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { createPopupMessage, auditPopupMessage } from '@/services/message'
import IssuedRange from '@/components/IssuedRange'
import PictureGroup from '@/components/pictureGroup'
import AudioPicker from '@/components/audioPicker'
export default {
  props: {
    source: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    IssuedRange,
    PictureGroup,
    AudioPicker,
  },
  data() {
    const validateDateRange = (rule, value, cb) => {
      if (!value) {
        cb(new Error('请选择开始日期'))
      } else {
        if (this.formData.alwaysOn === 1) {
          cb()
        } else {
          if (!this.formData.endDate) {
            cb(new Error('请选择结束日期'))
          }
          cb()
        }
      }
    }
    const validateTimeRange = (rule, value, callback) => {
      if (this.formData.allDay === 1) {
        callback()
      } else {
        if (!value || !value.length) {
          callback(new Error('请选择弹出时间'))
        }
        callback()
      }
    }
    return {
      beginPickerOptions: {
        disabledDate: time => {
          if (this.formData.endDate) {
            return (
              time.getTime() > this.formData.endDate ||
              time.getTime() < Date.now() - 8.64e7
            )
          }
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      endPickerOptions: {
        disabledDate: time => {
          if (this.formData.startDate) {
            return time.getTime() < this.formData.startDate
          }
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      rangeVisible: false,
      popupTypes: [
        { label: '本地上传语音文件', value: 1 },
        { label: '文字在线转语音', value: 2 },
        ],
      expiryDurationTypes: [
         { label: '1小时', value: 60},
      ],
      formData: {
        /**
         * 消息名称
         */
        title: '',
        image: [],
        /**
         * 播放次数
         */
        scrollTimes: '',
        startDate: Date.now(),
        endDate: Date.now(),
        /**
         * 播放时间
         * @type {string[]}
         */
        transmitTime: ['00:00', '23:59'],
        allDay: 2,
        /**
         * 弹窗类型 - 1：图片、2：问卷:、3：文字
         * @type {1|2|3}
         */
        type: 1,
        /**
         * 发布范围
         */
        ranges: [],
        alwaysOn: 2,
        expiryDuration: 60,
        audios: [],
        content: '',
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择消息类型' }],
        content: [{ required: true, message: '请输入消息内容' }],
        image: [{ required: true, message: '请选择背景图' }],
        scrolltimes: [
          { required: true, message: '请输入播放次数' },
          { pattern: /^\d+$/, message: '请输入正整数' },
        ],
        transmitTime: [{ validator: validateTimeRange, required: true }],
        startDate: [{ validator: validateDateRange, required: true }],
        ranges: [
          { required: true, message: '请选择发布范围', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    image(value) {
      this.formData.imageId = value.id || ''
    },
  },
  computed: {
    dialogTitle() {
      return this.source.id ? '修改大喇叭' : '创建大喇叭'
    },
    imageId() {
      if (this.imageList.length) {
        return this.imageList[0].id
      }
      return ''
    },
  },
  methods: {
    handleOpen() {
      const {
        noticeText,
        messageName,
        startDate,
        endDate,
        permanent,
        playStartTime,
        playEndTime,
        type,
        allDay,
        distributeOrgs,
        id,
        imageId,
        imageUrl,
      } = this.source

      if (!id) return

      this.formData = {
        title: messageName,
        content: noticeText,
        type: Number(type),
        allDay,
        image: [{ id: imageId, url: imageUrl }],
        startDate,
        endDate: endDate === -1 ? '' : endDate,
        transmitTime: [playStartTime, playEndTime],
        ranges: distributeOrgs,
        alwaysOn: permanent,
      }
    },
    contentConvertAudio(){
      console.log('获取输入的文字，然后传给后台，返回语音链接')
    },
    handleClosed() {
      this.$refs.form.resetFields()
      this.image = {}
    },
    handlePictureSeclection(data) {
      this.formData.image = data
    },
    handlePictureRemove({ id }) {
      this.formData.image = this.formData.image.filter(i => i.id !== id)
    },
    save(audit) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const startDate = new Date(this.formData.startDate)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date(this.formData.endDate)
          endDate.setHours(0, 0, 0, 0)
          const [img] = this.formData.image
          const res = await createPopupMessage({
            ...this.formData,
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            imageId: img.id,
            id: this.source.id,
          })

          if (res.code === 200) {
            if (audit) {
              const res2 = await auditPopupMessage({
                id: res.data.id ? res.data.id : this.source.id,
                status: 2,
                reason: '',
              })
              if (res2.code === 200) {
                this.$refs.form.resetFields()
                this.$message.success('提交审核成功')
                this.$emit('update:visible', false)
                this.$emit('saved')
              }
            } else {
              this.$refs.form.resetFields()
              this.$message.success(this.source.id ? '修改成功' : '创建成功')
              this.$emit('update:visible', false)
              this.$emit('saved')
            }
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.audio-content{
  margin-top:20px;
  display:flex;
  justify-content: space-between;
  audio{
    flex:1;
    // height: 13.6vw;
  }
  .btn{
    // width:120px;
    // height:9.6vw;
    margin:0 0 0 20px;
  }
}
</style>
