<template>
  <div class="ic-filter">
    <scroll-view scroll-y
      :style="{ height: height }"
      class="filter-menu">
      <ul>
        <li class="menu-item"
          :class="{ 'checked': index === currentIndex }"
          v-for="(item, index) in menus"
          :key="index"
          @click="handleMenuClick(item, index)">
          <img class="item-img" :src="item.img">
          <div class="item-text">{{ item.name }}</div>
        </li>
      </ul>
    </scroll-view>
    <scroll-view scroll-y
      :style="{ height: height }"
      class="filter-goods">
      <ul>
        <li class="good-item"
          v-for="(good, index) in goods"
          :key="index">
          <ul v-show="index === currentIndex">
            <li class="item-card"
              v-for="(item, idx) in good"
              :key="item.count">
              <div class="card-image">
                <img :src="item.img">
              </div>
              <div class="card-desc">
                <div>
                  <span class="name">{{ item.name }}</span>
                </div>
                <div class="amount-row">
                  <span class="currency">￥</span>
                  <span class="amount">{{ item.price }}</span>
                </div>
                <div class="ic-counter">
                  <div v-if="item.count > 0"
                    class="btn-action"
                    @click="changeCount(item, -1)">-</div>
                  <div v-if="item.count > 0"
                    class="counter-input">{{ item.count }}</div>
                  <div class="btn-action"
                    @click="changeCount(item, 1)">+</div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </scroll-view>
  </div>
</template>

<script>
  import IcCounter from '@/components/counter'

  export default {
    name: 'ic-filter',

    props: {
      info: Object,
      height: 'auto'
    },
    data () {
      return {
        menus: [],
        goods: [],
        currentIndex: 0
      }
    },
    watch: {
      info (newVal) {
        if (newVal) {
          const { menus, goods } = newVal
          this.menus = menus
          this.goods = goods
        }
      }
    },
    methods: {
      handleMenuClick (item, index) {
        this.currentIndex = index
      },
      changeCount (item, step) {
        const count = item.count + step
        this.$emit('count-change', {
          count,
          item
        })
      }
    },
    components: { IcCounter }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  // .ic-filter
  //   display flex
  //   background-color $background-color
  //   .filter-menu
  //     box-sizing border-box
  //     height 100%
  //     width 66px
  //     margin-right 16px
  //     color #666
  //     text-align center
  //     font-size 12px
  //     ul
  //       height 100%
  //     .menu-item
  //       background-color #fff
  //       padding 22px 2px
  //       margin 4px 0
  //       &.checked
  //         background-color $background-color
  //         border-left 3px solid #cc8e35
  //         color #cc8e35
  //       .item-img
  //         display none
  //         width 58px
  //         height 62px
  //       &.checked .item-img
  //         display inline-block
  //       &.checked .item-text
  //         padding-top 9px

  //   .filter-goods
  //     box-sizing border-box
  //     // height 100%
  //     width calc(100% - 66)
  //     background-color $background-color
  //     padding-right 16px
  //     ul
  //       height 100%
  //     .item-card
  //       display flex
  //       justify-content space-between
  //       align-items center
  //       padding 12px
  //       border $border
  //       border-radius 4px
  //       margin-bottom 12px
  //       background-color #fff
  //       .card-image
  //         width 72px
  //         height 45px
  //         img
  //           max-width 100%
  //           max-height 100%
  //       .card-desc
  //         text-align right
  //         .name
  //           font-size 16px
  //           padding-right 10px
  //         .en_name
  //           font-size 12px
  //           color #999
  //       .amount-row
  //         padding 15px 0
  //       .currency
  //         color $primary
  //         font-size 12px
  //       .amount
  //         color $primary
  //         font-size 18px

  // .ic-counter
  //   display flex
  //   justify-content flex-end
  //   align-items center
  //   text-align center
  //   color $gray-dark
  //   font-size 16px

  //   .btn-action
  //     display inline-block
  //     width 20px
  //     height @width
  //     line-height (@width - 4)
  //     border 1px solid $primary
  //     border-radius 50%
  //     font-size 24px
  //     color $primary
  //     background-color #fff
  //     margin 0
  //     padding 0
  //     outline none

  //   .counter-input
  //     width 40px
</style>
