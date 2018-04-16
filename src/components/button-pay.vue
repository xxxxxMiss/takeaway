<template>
  <div class="pay-container">
    <div class="pay-collapse"
      @click="handleCollapse"
      v-if="showCollapse">
      <ic-icon name="z-arrowUp"></ic-icon>
    </div>
    <a @click="handleConfirm"
      class="info-content">
      <div class="pay-badge" v-if="showIcon">
        <ic-icon :name="icon"></ic-icon>
        <div class="badge-container" v-if="showBadge">
          <ic-badge>{{ count }}</ic-badge>
        </div>
      </div>
      <div class="pay-info">
        <template v-if="amount > 0">
          <span class="currency">￥</span>
          <span class="amount">{{ amount }}</span>
        </template>
        <template v-else>未选购商品</template>
      </div>
      <div class="pay-action">
        <span>{{ text }}</span>
        <ic-icon name="jiantou"></ic-icon>
      </div>
    </a>
  </div>
</template>

<script>
  import IcIcon from '@/components/icon'
  import IcBadge from '@/components/badge'

  export default {
    props: {
      count: {
        type: [Number, String],
        default: 0
      },
      amount: {
        type: [Number, String],
        default: 0
      },
      icon: {
        type: String,
        default: 'diancan'
      },
      text: {
        type: String,
        default: '选好了'
      },
      href: {
        type: String,
        default: ''
      },
      showCollapse: {
        type: Boolean,
        default: true
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showBadge () {
        return this.count > 0
      }
    },
    methods: {
      handleCollapse () {
        this.$emit('collapse-click')
      },
      handleConfirm () {
        this.$emit('confirm')
      }
    },
    components: { IcIcon, IcBadge }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'
  .pay-container
    position relative
    .info-content
      display flex
      align-items center
      background-color $primary
      color #fff
      padding 10px 25px
    .pay-info
      flex 1
    .pay-action
      flex 1
      display flex
      text-align right
      align-items center
      justify-content flex-end
      span
        padding-right 15px
    .icon-diancan
      font-size 44px
      line-height 1.1
      padding-right 25px
    .currency
      font-size 12px
    .amount
      font-size 20px
    .pay-badge
      position relative
    .badge-container
      position absolute
      top 0
      right 0
    .pay-collapse
      background-color $primary
      color #fff
      width 52px
      height @width
      border-radius 50%
      center-x()
      z-index 0
      top -(@width / 3)
      text-align center
</style>
