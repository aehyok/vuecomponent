<template>
  <div>table</div>
</template>
<script>
import { getTestList } from '@/services/user'
export default {
  data(){
    return {

    }
  },
  created() {
    getTestList().then(res => {
      console.log(res,'rest')
    })
  },
}
</script>
