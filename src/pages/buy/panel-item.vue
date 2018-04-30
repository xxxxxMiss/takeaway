<template>
  <scroll-view scroll-y
    :style="{'height': height}"
    class="panel-block">
    <li class="panel-item"
      v-for="(item, index) in items"
      :key="index">
      <div class="img-container">
        <img :src="item.img">
      </div>
      <div class="good-info">
        <div class="good-names">
          <span class="name-zh">{{ item.name }}</span>
        </div>
        <div class="good-price">
          <span class="currency">￥</span>
          <span class="price">{{ item. price }}</span>
        </div>
      </div>
      <div class="good-action">
        <div class="ic-counter">
          <div v-if="item.count > 0"
            class="btn-action"
            @click.stop="changeCount(item, -1)">-</div>
          <div v-if="item.count > 0"
            class="counter-input">{{ item.count }}</div>
          <div class="btn-action"
            @click.stop="changeCount(item, 1)">+</div>
        </div>
      </div>
    </li>
  </scroll-view>
</template>

<script>
  import IcCounter from '@/components/counter'

  export default {
    props: {
      items: Array,
      height: String
    },
    methods: {
      changeCount (item, step) {
        this.$emit('panel-count-change', {
          count: step,
          item
        })
      }
    },
    components: { IcCounter }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .panel-block
    position absolute
    left 0
    width 100%
    bottom 0
    background-color #fff
    overflow hidden
  .panel-item
    display flex
    margin 0 16px
    border-bottom 1px solid #dadada
    padding 16px 0
    .img-container
      width 104px
      height 71px
      margin-right 25px
      img
        width 100%
        height 100%
    .good-info
      flex 2
    .good-price
      color $primary
      .currency
        font-size 12px
      .price
        font-size 18px
    .good-action
      flex 1
      position relative
      .ic-counter
        position absolute
        bottom 0
        right 0
    .good-names
      padding-bottom 24px
    .name-zh
      font-size 16px
      padding-right 10px
    .name-en
      font-size 12px
      color #999


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
