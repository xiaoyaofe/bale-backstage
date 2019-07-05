<template>
  <div class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    packing_list() {
      return this.$store.state.packing_list
    },
  },
}
</script>
<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
