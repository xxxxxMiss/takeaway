<template>
  <i @click="handleClick" :class="['iconfont', 'icon-' + name]"></i>
</template>
<script>
  export default {
    name: 'ic-icon',

    props: {
      name: {
        type: String
      },
      color: String
    },
    methods: {
      handleClick () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="stylus">
  .iconfont
    display inline-block
</style>
