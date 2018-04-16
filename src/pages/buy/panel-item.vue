<template>
  <ul class="panel-block">
    <li class="panel-item"
      v-for="(item, index) in items"
      :key="index">
      <div class="img-container">
        <img :src="item.img">
      </div>
      <div class="good-info">
        <div class="good-names">
          <span class="name-zh">{{ item.name }}</span>
          <span class="name-en">{{ item.en_name }}</span>
        </div>
        <div class="good-price">
          <span class="currency">￥</span>
          <span class="price">{{ item. price }}</span>
        </div>
      </div>
      <div class="good-action">
        <ic-counter @change="handleCountChange"
          :index="index"
          :data="item"
          :value="item.count"></ic-counter>
      </div>
    </li>
  </ul>
</template>

<script>
  import IcCounter from '@/components/counter'

  export default {
    props: {
      items: Array
    },
    methods: {
      handleCountChange (data) {
        this.$emit('panel-count-change', data)
      }
    },
    components: { IcCounter }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .panel-block
    position absolute
    top 50px
    left 0
    width 100%
    bottom 0
    background-color #fff
    max-height 400px
    overflow hidden
    overflow-y scroll
  .panel-item
    display flex
    margin 0 15px
    border-bottom 1px solid #dadada
    padding 25px 0
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
    .good-names
      padding-bottom 24px
    .name-zh
      font-size 16px
      padding-right 10px
    .name-en
      font-size 12px
      color #999
</style>
