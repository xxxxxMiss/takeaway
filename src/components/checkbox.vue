<template>
  <div class="ic-checkbox" @click="handleClick">
    <div class="checkbox-inner"
      :class="{ 'checked': val }">
      <span class="checkbox-circle" v-if="val"></span>
    </div>
    <span class="checkbox-label" v-if="label">{{ label }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ic-checkbox',
    props: {
      value: {
        type: null,
        default: false
      },
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        val: !!this.value
      }
    },
    methods: {
      handleClick () {
        if (this.disabled) return
        this.val = !this.val
        this.$emit('change', this.val)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'
  $checkbox-width = 30px
  .ic-checkbox
    display flex
    align-items center
    .checkbox-inner
      display inline-block
      position relative
      font-size 14px
      color #666
      width $checkbox-width
      height $checkbox-width
      border-radius 50%
      border 1px solid #ccc
      text-align center
      background-color #fff
      margin-right 15px
      .checkbox-circle
        position absolute
        display inline-block
        width ($checkbox-width / 2)
        height @width
        top 50%
        left 50%
        margin-top - (@height / 2)
        margin-left -(@width / 2)
        border-radius 50%
        background-color #ff793f
      &.disabled
        background-color #f7f7f7
      &.checked
        border 1px solid #ff793f
    .checkbox-label
      color #666666
</style>
