<template>
  <div class="ic-dialog" v-if="visible"
    :class="{
      'ic-dialog--round': isRound
    }"
    >
    <div class="ic-dialog__wrapper"
      ref="wrapper"
      :style="{ width: width, height: height }">
      <slot></slot>
      <div class="ic-dialog__ghost"
        :class="[
          'ic-dialog__ghost--' + ghostPosition,
          { 'ic-dialog__ghost--line': showGhostLine }
        ]"
        v-if="showGhost"
        @click="$emit('close')">
        <i class="glyph__close"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ic-dialog',

    props: {
      visible: {
        type: Boolean,
        default: false
      },
      closeOnClickMask: {
        type: Boolean,
        default: true
      },
      title: String,
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      round: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      isLeftClose: {
        type: Boolean,
        default: false
      },
      showGhost: {
        type: Boolean,
        default: false
      },
      ghostPosition: {
        type: String,
        default: 'bottom' // bottom-end, top, top-end
      },
      showGhostLine: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isRound () {
        return this.round &&
          (this.width !== '100%' || this.height !== '100%')
      }
    },
    methods: {
      handleMaskClose () {
        this.closeOnClickMask && this.$emit('close')
      },
      close () {
        this.showClose && this.$emit('close')
      }
    }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  $ghost-distance = 60px
  +prefix-classes($prefix-classes)
    .dialog
      position fixed
      z-index: $z-index['dialog']
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(0, 0, 0, .6)

      &__wrapper
        position relative
        margin 0 auto

      &--round &__wrapper
        border-radius 8px

      .btn
        &--primary:active
          background-color $primary
        &--default:active
          background-color $white

      &__ghost
        width 30px
        height @width
        border 1px solid $white
        border-radius 50%
        text-align center
        color $white
        &--bottom
          center-x()
          bottom -($ghost-distance)
        &--bottom-end
          position absolute
          right 0
          bottom -($ghost-distance)
        &--bottom&--line
        &--bottom-end&--line
          &:after
            content ''
            center-x()
            width 1px
            height ($ghost-distance / 2)
            top -($ghost-distance / 2)
            background-color currentColor

        &--top
          center-x()
          top -($ghost-distance)
        &--top-end
          position absolute
          right 0
          top -($ghost-distance)
        &--top&--line
        &--top-end&--line
          &:after
            content ''
            center-x()
            width 1px
            height ($ghost-distance / 2)
            top ($ghost-distance / 2)
            background-color currentColor

</style>
