<template>
  <button class="ic-btn"
    :class="[
      'ic-btn--' + type,
      {
        'ic-btn--round': round,
        'ic-btn--block': block,
        'ic-btn--fixed': fixed,
        'ic-btn--text': text
      }
    ]"
    :disabled="disabled"
    @click="onClick">
    {{ content }}
  </button>
</template>

<script>
  import IcIcon from './icon'

  export default {
    name: 'ic-button',

    props: {
      content: String,
      type: {
        type: String,
        default: 'default' // sucess, info, danger, primary
      },
      round: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      block: {
        type: Boolean,
        default: false
      },
      fixed: {
        type: Boolean,
        default: false
      },
      text: {
        type: Boolean,
        default: false
      },
      bgColor: String
    },
    methods: {
      onClick (e) {
        this.$emit('click', e)
      }
    },
    components: { IcIcon }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  $colors = {
    primary: $primary,
    success: $success,
    info: $info,
    danger: $danger,
    warning: $warning
  }

  +prefix-classes($prefix-classes)
    .btn
      position relative
      display inline-block
      text-align center
      outline none
      border 0
      -webkit-appearance none
      user-select none
      border-radius $border-radius
      font-size $font-size-base
      margin 0
      &:after
        content ''
        position absolute
        left 0
        top 0
        width 200%
        height 200%
        border $border
        transform scale(.5)
        transform-origin left top
        border-radius inherit

      &--text:after
        display none

      &__text
        display flex
        align-items center
        justify-content center
        padding 0 5px

      &--default
        background-color $white
        color $black
        border-radius ($border-radius * 2)
        &:after
          border 1px solid $gray-dark
        &:active
          background-color darken($white, 10%)
        &[disabled]
          color #999

      for key, value in $colors
        &--{key}
          background-color value
          color $white
          &:after
            border none
          &:active, &[disabled]
            background-color: lighten(value, 62%)
          &[disabled]
            color $primary

      &--round
        border-radius $round = 16px
        &:after
          border-radius $round * 2

      &--block
        width 100%
        height 50px
        line-height 50px
        font-size $font-size-medium
        border-radius 0

      &--fixed
        position absolute
        left 0
        bottom 0
        width 100%
        border-radius 0
        height 50px
        font-size 17px
</style>
