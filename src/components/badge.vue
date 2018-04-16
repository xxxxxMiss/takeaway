<template>
  <span class="ic-badge"
    :class="{ 'ic-badge--dot': $slots.default }">
    <slot></slot>
  </span>
</template>

<script>
  export default {
    name: 'ic-badge',

    props: {
      blink: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  +prefix-classes($prefix-classes)
    .badge
      display inline-block
      padding 1px 6px
      background-color #000
      color $white
      border-radius 11px
      &--dot
        width 10px
        height 10px
        border-radius 50%
        padding 0

</style>
