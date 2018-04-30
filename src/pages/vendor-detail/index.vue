<template>
  <div class="page-vendor-detail">
    <div class="vendor-info">
      <img :src="info.img">
      <div class="add-tel-placeholder">
          <ul class="add-tel">
            <li class="name">{{ info.name }}</li>
            <li class="item">
              <div class="item-desc">
                <ic-icon name="dingwei"></ic-icon>
                <span>{{ info.address }}</span>
              </div>
              <div class="btn-action" @click="openLocation">
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
            <span>{{ info.content }}</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import IcCell from '@/components/cell'
  import IcIcon from '@/components/icon'
  import store from '@/store'

  export default {
    data () {
      return {
        info: {}
      }
    },
    methods: {
      makePhoneCall () {
        wx.makePhoneCall({
          phoneNumber: this.info.tel
        })
      },
      handleNavigator () {
        wx.navigateTo({
          url: `/pages/navigator/navigator?lat=${this.info.lat}&log=${this.info.log}&address=${this.info.address}`
        })
      },
      openLocation () {
        const { lat, log, address } = this.info
        // lat and log must be numbers in openLocation api
        wx.openLocation({
          latitude: lat * 1,
          longitude: log * 1,
          name: address
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
  page
    width 100%
    height 100%
    overflow hidden
  .page-vendor-detail
    background-color $background-color
    .vendor-info
      margin-bottom 10px
      img
        width 100%
        max-height 200px
    .add-tel-placeholder
      position absolute
      left 50%
      top 130px
      transform translateX(-50%)
      width 100%
      height 100px
      border-radius 50%
      background-color #fff
    .add-tel
      position absolute
      width 100%
      height 180px
      top 50px
      background-color #fff
      .name
        text-align center
        font-size 16px
        color #666
        padding 0 15px 30px
      .item
        display flex
        border-bottom $border
        padding 15px
        .iconfont
          padding-right 10px
        &:last-child
          border-bottom 0
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

    .divider
      background-color $background-color
      height 10px

    .service-content
      margin-top 170px
      background-color #fff
      h3
        border-bottom 1px solid #f4f4f4
        margin 15px
        padding 15px 0
      .content
        padding 15px
</style>
