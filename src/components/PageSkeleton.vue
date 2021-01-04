<template>
  <div>
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <slot name="action"></slot>
      </div>
      <div class="filter-options">
        <slot name="filter"></slot>
      </div>
    </div>
    <TablePanel :columns="columns" :data="[{ name: 'Josh' }]"></TablePanel>
    <Pagination />
  </div>
</template>
<script>
import TablePanel from '@/components/TablePanel'
import Pagination from '@/components/Pagination'

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TablePanel,
    Pagination,
  },
  data() {
    return {
      list: [],
    }
  },
}
</script>
<style lang="scss" scoped>
.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter-buttons,
  .filter-options {
    flex: 1;
  }

  .filter-options {
    text-align: right;
  }
}
</style>
