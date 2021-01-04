<template>
  <div>
    <el-button type="primary" @click="visible = true">导入</el-button>

    <el-button type="primary"
      ><el-link href="api/console/region/exportRegion" style="color:white"
        >导出</el-link
      ></el-button
    >

    <RegionImport :visible.sync="visible" @saved="getRegionTree"></RegionImport>

    <el-tree
      style="margin-top: 6px;"
      :data="regions"
      :props="defaultProps"
      :default-expand-all="true"
    ></el-tree>
  </div>
</template>
<script>
import request from '@/utils/request'
import RegionImport from './RegionImport'
export default {
  components: {
    RegionImport,
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      regions: [],
    }
  },
  async created() {
    const res = await this.getRegionTree()
    if (res.code === 200) {
      this.regions = res.data
    }
  },
  methods: {
    getRegionTree(data) {
      return request('/region/getRegionTree', {
        method: 'post',
        data,
      })
    },
  },
}
</script>
