<template>
  <div class="ic-popup"
    :class="{
      'ic-popup--visible': visible
    }"
  >
    <div @click.self="close"
      class="ic-popup__backdrop"></div>
    <div class="ic-popup__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ic-popup',

    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close () {
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  +prefix-classes($prefix-classes)
    .popup
      &__content
        position fixed
        z-index: $z-index['popup']
        left 0
        max-height 60%
        bottom -100%
        width 100%
        overflow hidden
        overflow-y auto
        background-color $white
        transition bottom .3s

      &__backdrop
        position fixed
        z-index: ($z-index['popup'] - 1)
        top 100%
        left 0
        height 100%
        width 100%
        background-color rgba(0, 0, 0, .4)

      &--visible &__content
        bottom 0
      &--visible &__backdrop
        top 0

</style>
