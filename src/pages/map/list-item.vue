<template>
  <li class="list-item">
    <img class="img" :src="item.img">
    <div class="info">
      <div class="title">{{ item.name }}</div>
      <div class="desc">{{ item.address }}</div>
      <div class="quickly-enter">
        <span>{{ distance }}</span>
        <a :href="href" title="门店详情">门店详情&nbsp;&nbsp;></a>
      </div>
    </div>
  </li>
</template>

<script>
  import { formatNumber } from '../../utils/js/format'

  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      href () {
        return `/pages/vendor-detail/vendor-detail?id=${this.item.id}`
      },
      distance () {
        return formatNumber(this.item.distince)
      }
    }
  }
</script>

<style lang="stylus">
  .list-item
    display flex
    padding 15px
    .img
      width 90px
      height @width
      border-radius 6px
    .info
      flex 1
      margin-left 22px
      .title
        font-size 16px
        color #666
      .desc
        font-size 14px
        color #999
        border-bottom 1px dashed #eee
        padding 10px 0 5px
        margin-bottom 10px
      .quickly-enter
        font-size 12px
        display flex
        justify-content space-between
        align-item center
        color #999
        a
          color #2383f4
</style>
