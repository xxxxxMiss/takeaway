<template>
  <a :href="info.href" class="ic-item">
    <div class="item-left">
      <slot>
        <ic-icon :name="info.icon"></ic-icon>
        <span>{{ info.leftText }}</span>
      </slot>
    </div>
    <div class="item-right">
      <span>{{ info.rightText }}</span>
      <ic-icon v-if="showArrow" name="jiantou"></ic-icon>
    </div>
  </a>
</template>

<script>
  export default {
    name: 'ic-cell',

    props: {
      info: {
        type: Object,
        default: () => ({
          href: '',
          icon: '',
          leftText: '',
          rightText: ''
        })
      },
      showArrow: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="stylus">
  .ic-item
    display flex
    justify-content space-between
    align-items center
    padding 8px 15px
    border-bottom 1px solid #eee
    .item-left
      display flex
      align-items center
    .item-left span
      padding-left 15px
    .item-right
      text-align right
      span
        color #ccc
</style>
