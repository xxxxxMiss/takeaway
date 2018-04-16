<template>
  <div class="page-vendor-detail">
    <div class="vendor-info">
      <img :src="info.img">
      <div class="add-tel-placeholder"></div>
      <ul class="add-tel">
        <li class="item">
          <div class="item-desc">
            <ic-icon name="dingwei"></ic-icon>
            <span>{{ info.address }}</span>
          </div>
          <div class="btn-action">
            <ic-icon name="daohang"></ic-icon>
            <span>导航</span>
          </div>
        </li>
        <li class="item">
          <div class="item-desc">
            <ic-icon name="dianhua"></ic-icon>
            <span>{{ info.tel }}</span>
          </div>
          <div class="btn-action" @click="makePhoneCall">
            <ic-icon name="dianhua"></ic-icon>
            <span>电话</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="service-content">
      <h3>本店服务</h3>
      <div class="content">
        <span>{{ serviceTime }}小时营业</span>
      </div>
    </div>
  </div>
</template>

<script>
  import IcCell from '@/components/cell'
  import IcIcon from '@/components/icon'
  import store from '@/store'
  import { formatTime } from '@/utils/js/format'

  export default {
    data () {
      return {
        info: {}
      }
    },
    computed: {
      serviceTime () {
        return formatTime([
          this.info.work_start_time,
          this.info.work_end_time
        ])
      }
    },
    methods: {
      makePhoneCall () {
        wx.makePhoneCall({
          phoneNumber: this.info.tel
        })
      }
    },
    onShow () {
      this.$get({
        action: 'branchinfo',
        branch_id: this.$root.$mp.query.id,
        CT_token: store.state.token
      }).then(info => {
        if (info) {
          this.info = info
        }
      })
    },
    components: { IcCell, IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-vendor-detail
    background-color $background-color
    .vendor-info
      margin-bottom 10px
      img
        width 100%
        max-height 252px
    .add-tel
      background-color #fff
      .item
        display flex
        border $border
        padding 15px
        .iconfont
          padding-right 10px
      .item-desc
        flex 3
        font-size 16px
        color #999
        .iconfont
          padding-right 10px
          font-size 18px
      .btn-action
        flex 1
        text-align center
        width 95px
        height 32px
        line-height @height
        border-radius 16px
        border 1px solid #ffb142
        color #ffb142

    .service-content
      background-color #fff
      h3
        border-bottom 1px solid #f4f4f4
        margin 15px
        padding 15px 0
      .content
        padding 15px
</style>
