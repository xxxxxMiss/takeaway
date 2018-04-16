<template>
  <div class="ic-counter">
    <div v-if="showDecrease"
      class="btn-action"
      @click="decrease">-</div>
    <input v-if="val != 0"
      class="counter-input"
      type="number"
      :value="val"
      :min="min"
      :max="max"
      :step="step"
      disabled
    >
    <div class="btn-action"
      @click="increase"
      :disabled="disabledIncrease">+</div>
  </div>
</template>

<script>
  export default {
    name: 'ic-counter',

    props: {
      value: {
        type: Number,
        default: 0
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 20
      },
      step: {
        type: Number,
        default: 1
      },
      index: { // use it to distinguish which item clicked in a iterator
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        val: this.value || 0
      }
    },
    computed: {
      showDecrease () {
        return this.val > this.min
      },
      disabledIncrease () {
        return this.val === this.max
      }
    },
    methods: {
      increase () {
        this.val += this.step
        this.$emit('change', {
          index: this.index,
          count: this.val
        })
      },
      decrease () {
        this.val -= this.step
        this.$emit('change', {
          index: this.index,
          count: this.val
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  .ic-counter
    display flex
    justify-content flex-end
    align-items center
    text-align center
    color $gray-dark
    font-size 16px

    .btn-action
      display inline-block
      width 25px
      height @width
      line-height (@width - 4)
      border 1px solid $primary
      border-radius 50%
      font-size 24px
      color $primary
      background-color #fff
      margin 0
      padding 0
      outline none

    .counter-input
      width 40px
</style>
