<template>
  <div class="home-set-root-layout">
    <div class="hbanner">
      <div class="banner">
        <p class="pic-tip">
          公众号banner图（最多配置5张图片，支持配置跳转链接。建议尺寸690*270像素，大小不超过500KB；图片格式只支持：jpg
          、jpeg 、png）
        </p>
        <div class="picList">
          <div v-for="(item, index) in banners" :key="index" class="borderItem">
            <img
              :src="item.imageInfo ? item.imageInfo.url : ''"
              alt=""
              class="image"
            />
            <div class="mask" v-permission="'delete'">
              <div class="detele1">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  circle
                  @click="remove(item)"
                ></el-button>
              </div>
            </div>
            <el-row class="material-control">
              <el-col :span="14" style="padding-right:5px;">
                <el-input
                  v-model="item.name"
                  :disabled="true"
                  placeholder="请选择跳转图文或功能模块"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-dropdown @command="handleCommand" v-permission="'update'">
                  <el-button type="primary">
                    {{ getTypeText(item.type)
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="`${item.id},1`"
                      >跳转图文</el-dropdown-item
                    >
                    <el-dropdown-item :command="`${item.id},2`"
                      >跳转功能</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
          <div class="borderItem" v-if="this.banners.length < 5">
            <!-- <div
              class="icon-plus-container"
              v-if="banners && banners.length < 5"
              @click="changeShowUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div> -->
            <upload
              v-permission="'create'"
              accept=".jpg,.jpeg,.png"
              @callback="handleAvatarSuccess"
              :sizeLimit="500"
              fileType="img"
            ></upload>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="跳转图文" :visible.sync="isShowText" width="60%">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="图文标题" prop="name">
          <el-input
            v-model="form.name"
            maxlength="50"
            placeholder="最多50个字"
          />
        </el-form-item>
        <el-form-item label="图文内容" prop="description">
          <RichTextEditor
            :propEditorContent="form.description"
            @dochange="editorChange"
            :canAssignHtml="canAssignHtml"
          >
          </RichTextEditor>
          <p style="color:gray">&nbsp;&nbsp;限{{ wordsLimit }}个字</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <selectModule
      :isMulti="false"
      :moduleType="2"
      :dialogVisible.sync="isShowModule"
      @callback="handleSelectModule"
    ></selectModule>
  </div>
</template>
<script>
import { getBannerList, deleteBanner, saveBanner } from '@/services/banner'
import upload from '@/components/upload'
import selectModule from '@/components/selectModule'
import RichTextEditor from '@/components/RichTextEditor'

export default {
  data() {
    return {
      banners: [],
      headers: {},
      form: {
        name: '', // 图文标题
        description: '', // 图文内容
        imageId: '', // 图片Id
        remark: '', // 备注
        moduleCode: '',
        moduleId: '', // 服务Id
        listOrder: 1, // 序号
        type: 0,
      },
      isShowText: false,
      isShowModule: false,
      rules: {
        name: [{ required: true, message: '请输入图文标题', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入图文内容', trigger: 'blur' },
        ],
      },
      canAssignHtml: false,
      richText: '',
      wordsLimit: 5000, // 数字限制
      richTxtNum: 0,
    }
  },
  components: {
    upload,
    selectModule,
    RichTextEditor,
  },
  methods: {
    async saveBanner() {
      const res = await saveBanner(this.form)
      if (res && res.code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功',
        })
        this.isShowText = false
        this.isShowModule = false
        this.form = {
          name: '', // 图文标题
          description: '', // 图文内容
          imageId: '', // 图片Id
          remark: '', // 备注
          moduleCode: '',
          moduleId: '', // 服务Id
          listOrder: 1, // 序号
          type: 0,
        }
        this.getBannerList()
      } else {
        this.$message({
          type: 'error',
          message: res.message,
        })
      }
    },
    async getBannerList() {
      const res = await getBannerList({})
      if (res && res.code === 200) {
        this.banners = res.data.docs
      }
    },
    async remove(row) {
      this.$confirm('删除后，该数据将无法恢复', '是否删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await deleteBanner({ id: row.id })
          if (res && res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.getBannerList()
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            })
          }
        })
        .catch(() => {})
    },
    handleAvatarSuccess(data) {
      if (Array.isArray(data) && data.length > 0) {
        this.form.imageId = data[0].id
        this.saveBanner()
      }
    },
    beforeAvatarUpload() {},
    handleCommand(val) {
      const [id, type] = val.split(',')
      const banner = this.banners.find(n => n.id === id)
      this.form = banner
      this.isShowModule = false
      this.isShowText = false
      if (type === '1') {
        this.canAssignHtml = true
        this.isShowText = true
      } else if (type === '2') {
        this.isShowModule = true
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.type = 1
          if (this.richTxtNum > this.wordsLimit) {
            this.$message.error(`文本框字数${this.wordsLimit}字以内`)
            return
          }

          this.saveBanner()
        }
      })
    },
    getTypeText(type) {
      if (type === 1) {
        return '跳转图文'
      } else if (type === 2) {
        return '跳转功能'
      } else {
        return '选择跳转'
      }
    },
    // 选择功能动作
    async handleSelectModule(row) {
      if (!Array.isArray(row)) {
        this.form.moduleId = row.id
        this.form.name = row.name
        this.form.type = 2
        this.form.moduleCode = row.code
        this.saveBanner()
      }
    },
    // 富文本有改变的时候
    editorChange(val, textVal) {
      this.form.description = val
      this.canAssignHtml = false
      this.richText = textVal
      this.richTxtNum = this.richText.replace(/&nbsp;/gi, '').length
      if (this.richTxtNum > this.wordsLimit) {
        this.$message.warning(`文本框字数${this.wordsLimit}字以内`)
      }
    },
  },
  mounted() {
    this.getBannerList()
    // this.getMaterial()
  },
}
</script>
<style lang="scss" scoped>
.home-set-root-layout {
  .hbanner {
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 288px;
      height: 146px;
      line-height: 146px;
      text-align: center;
    }
    .data-search {
      position: absolute;
      right: 2%;
      margin-top: -30px;
      width: 250px;
    }
    .avatar {
      width: 288px;
      height: 146px;
      display: block;
      border-radius: 6px;
      margin-top: 45px;
      cursor: pointer;
      border: 1px dashed #d9d9d9;
    }
    .avatar :hover {
      color: #409eff;
      border-color: #409eff;
    }
    .table-sec {
      width: 99%;
      margin-left: 20px;
      margin-top: 30px;
    }
    .banner {
      padding-top: 10px;
      .pic {
        margin-right: 30px;
        padding-left: 20px;
      }
      .picList {
        display: flex;
        flex-wrap: wrap;
        width: 98%;
        padding-left: 20px;
        .borderItem {
          margin-top: 45px;
          margin-right: 20px;
          width: 288px;
          border-radius: 6px;
          position: relative;
          .image {
            position: relative;
            z-index: 5;
            &:hover {
              z-index: 2;
            }
          }
          .mask {
            position: absolute;
            top: -20px;
            right: -15px;
            z-index: 100;
          }
        }
        img {
          width: 288px;
          height: 146px;
          border-radius: 5px;
          border: 1px solid #d9d9d9;
        }
      }
    }
    // .choose-material {
    //   cursor: pointer;
    //   background-color: #409eff;
    //   width: 60px;
    //   height: 40px;
    //   border: none;
    //   margin-left: -6px;
    //   color: #fff;
    // }
    .detele1 {
      cursor: pointer;
    }
    .pic-tip {
      font-size: 14px;
      color: gray;
      margin-top: 10px;
      padding-left: 20px;
    }
  }
}
.icon-plus-container {
  margin-top: 45px;
  margin-right: 20px;
  border: 1px dashed #ccc;
  cursor: pointer;
}
.material-control {
  margin-top: 20px;
}
.clear {
  margin: 0 4px;
}
</style>
