<template>
  <div class="page-map">
    <map :style="{ width: '100%', height: measurement.mapH }"
      show-location
      :latitude="lat"
      :longitude="log"
      :markers="markers">
    </map>
    <div class="scroll-container" id="scroller">
      <div class="collapse-container" @click="handleCollapse">
        <ic-icon :name="iconName"></ic-icon>
        <div class="collapse-text">{{ collapseText }}</div>
      </div>
      <scroll-view scroll-y
        :style="{ height: measurement.scrollerH }"
        class="scroll-content">
        <ul>
          <list-item v-for="(item, index) in list"
            :key="index" :item="item"></list-item>
        </ul>
      </scroll-view>
    </div>
    <ic-button @click="goBuy"
      content="进入点餐" bg-color="#000" block></ic-button>
  </div>
</template>

<script>
  import store from '@/store'
  import IcButton from '@/components/button'
  import IcIcon from '@/components/icon'
  import ListItem from './list-item'

  const ITEM_HEIGHT = 131
  const COLLAPSE_HEIGHT = 48
  const BUTTON_HEIGHT = 55
  export default {
    data () {
      return {
        list: [],
        markers: [],
        log: '',
        lat: '',
        isUp: true,
        measurement: {}
      }
    },
    computed: {
      iconName () {
        return this.isUp ? 'z-arrowUp' : 'z-arrowDown'
      },
      collapseText () {
        return this.isUp ? '查看全部门店' : '返回地图'
      }
    },
    methods: {
      handleCollapse () {
        this.isUp = !this.isUp

        this.measurement = this.getMeasurement()
      },
      goBuy () {
        wx.navigateTo({
          url: `/pages/buy/buy?log=${this.log}&lat=${this.lat}`
        })
      },
      getMeasurement (n = 1) {
        const sysinfo = wx.getSystemInfoSync()
        let scrollerH = ITEM_HEIGHT * n
        if (scrollerH + COLLAPSE_HEIGHT + BUTTON_HEIGHT > sysinfo.windowHeight) {
          scrollerH = sysinfo.windowHeight - scrollerH - COLLAPSE_HEIGHT
        }
        // 5: tweak bottom some gaps
        let mapH = sysinfo.windowHeight - scrollerH - COLLAPSE_HEIGHT - BUTTON_HEIGHT + 5
        return {
          mapH: `${mapH}px`,
          scrollerH: `${scrollerH}px`
        }
      }
    },
    onShow () {
      new Promise((resolve, reject) => {
        wx.getLocation({
          success: ({ latitude, longitude }) => {
            this.lat = latitude
            this.log = longitude
            resolve({latitude, longitude})
          },
          fail: (e) => {
            this.$showToast('定位失败~')
            reject(e)
          }
        })
      }).then(({latitude, longitude}) => {
        this.$get({
          lat: latitude,
          log: longitude,
          action: 'branchlist',
          CT_token: store.state.token
        }, true).then(info => {
          if (!info) return
          const list = []
          const markers = []
          info.forEach(item => {
            const { id, lat, log } = item
            list.push(item)
            markers.push({
              id,
              latitude: lat,
              longitude: log,
              iconPath: '/static/images/small_logo.png',
              width: 20,
              height: 25
            })
          })
          this.list = list
          this.markers = markers
        })
      })
    },
    onReady () {
      this.measurement = this.getMeasurement()
    },
    components: { IcButton, ListItem, IcIcon }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  .page-map, page
    height 100%
    width 100%
    overflow hidden
    .ic-btn
      background-color #000
      color #fff

    .scroll-container
      .scroll-content
        height calc(100% - 50px)
        ul
          background-color #fff
      .collapse-container
        text-align center
        position relative
        background-color rgba(255, 255, 255, 0)
        font-size 12px
        color #ccc
        margin 0 15px
        padding-bottom 6px
        border-bottom 1px dashed #cbcbcb
</style>
