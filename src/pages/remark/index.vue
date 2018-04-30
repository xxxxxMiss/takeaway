<template>
  <div class="page-remark">
    <h3>备注</h3>
    <textarea placeholder="请输入您的需求"
      @input="handleTextarea"
      :value="remark"
      :auto-height="true"
      :show-confirm-bar="false"></textarea>
    <ic-button type="primary" block
      content="确定"
      @click="handleConfirm"></ic-button>
  </div>
</template>

<script>
  import IcButton from '../../components/button'

  export default {
    data () {
      return {
        remark: ''
      }
    },
    methods: {
      handleTextarea (e) {
        this.remark = e.mp.detail.value
      },
      handleConfirm () {
        wx.navigateTo({
          url: `/pages/payment/payment?remark=${this.remark}`
        })
      }
    },
    components: { IcButton }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'

  .page-remark
    padding 16px
    h3
      margin-bottom 10px
    textarea
      border 1px solid #ccc
      border-radius 6px
      padding 15px
      min-height 150px
      width 100%
      box-sizing border-box
      margin-bottom 20px
</style>

