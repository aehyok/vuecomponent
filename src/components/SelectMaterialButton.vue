<template>
  <div class="movie-poster-item">
    <template v-if="editable">
      <div
        v-if="picked"
        class="picked-wrapper"
        @mouseover="closeButtonDisplay = true"
        @mouseout="closeButtonDisplay = false"
      >
        <el-image
          fit="contain"
          style="cursor:pointer"
          v-if="myUrl"
          @click.native="click"
          :src="myUrl"
        />
        <i
          v-show="closeButtonDisplay"
          class="el-icon-close clear"
          @click="clear"
        ></i>
      </div>
      <el-button v-else icon="el-icon-plus" @click="click">
        <br /><br />{{ name }}
      </el-button>
    </template>
    <template v-else>
      <el-image v-if="myUrl" :src="myUrl" fit="contain"> </el-image>
      <span v-else>{{ '' | transformFalsy }}</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: '点击选取内容',
    },
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      picked: false,
      closeButtonDisplay: false,
      myUrl: '',
    }
  },
  methods: {
    clear() {
      this.picked = false
      this.$emit('clear')
    },
    click() {
      this.$emit('click')
    },
  },
  watch: {
    url: {
      handler(newUrl) {
        this.myUrl = newUrl
        this.picked = !!newUrl
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.movie-poster-item {
  width: 162px;
  height: 170px;
  .el-button,
  .el-image,
  .picked-wrapper {
    width: 162px;
    height: 170px;
  }

  .el-image {
    border: 1px solid #dcdfe6;
    padding: 1px;
  }

  .picked-wrapper {
    position: relative;

    .clear {
      position: absolute;
      right: -1px;
      top: 0;
      font-size: 24px;
      color: #fff;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    .clear:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
