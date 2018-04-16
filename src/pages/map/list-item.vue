<template>
  <li class="list-item">
    <img class="img" :src="item.img">
    <div class="info">
      <div class="title">{{ item.name }}-{{ item.content }}</div>
      <div class="desc">{{ item.address }}</div>
      <div class="quickly-enter">
        <span>{{ item.distance }}</span>
        <a :href="'/pages/vendor-detail/vendor-detail?id=' + item.id" title="门店详情">门店详情&nbsp;&nbsp;></a>
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    }
  }
</script>

<style lang="stylus">
  .list-item
    display flex
    padding 15px
    .img
      width 110px
      height @width
      border-radius 6px
    .info
      flex 1
      margin-left 22px
      .title
        font-size 16px
      .desc
        font-size 14px
        color #999
        border-bottom 1px dashed #eee
        padding 23px 0 15px
        margin-bottom 10px
      .quickly-enter
        font-size 12px
        display flex
        justify-content space-between
        align-item center
        a
          color #2383f4
</style>
