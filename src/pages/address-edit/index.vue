<template>
  <div class="page-address-edit">
    <div class="form-container">
      <div class="form-item">
        <input :value="name"
          @input="handleInput('name', $event)"
          type="text" placeholder="收货人姓名">
      </div>
      <div class="form-item">
        <input :value="mobileno"
          type="number"
          @input="handleInput('mobileno', $event)"
          placeholder="手机号">
      </div>
      <div class="form-item">
        <div class="label">上海市</div>
        <input :value="address"
          @input="handleInput('address', $event)"
          type="text" placeholder="请输入详细地址">
      </div>
    </div>
    <div class="set-default">
      <ic-checkbox :value="is_use"
        label="设为默认收货地址"
        @change="setDefault"></ic-checkbox>
    </div>
    <div class="btn-fixed">
      <ic-button @click="saveAddress" type="primary" block content="保存"></ic-button>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import IcCheckbox from '@/components/checkbox'
  import IcButton from '@/components/button'

  export default {
    data () {
      return {
        name: '',
        mobileno: '',
        address: '',
        id: '',
        is_use: 0
      }
    },
    methods: {
      setDefault (val) {
        this.is_use = val ? 1 : 0
      },
      handleInput (type, event) {
        this[type] = event.mp.detail.value
      },
      saveAddress () {
        if (!/^1\d{10}$/.test(this.mobileno)) {
          return this.$showToast('手机号输入错误')
        }
        const address = {
          name: this.name,
          mobileno: this.mobileno,
          address: this.address,
          address_id: this.id,
          is_use: this.is_use
        }
        this.$get({
          action: 'addaddress',
          ...address,
          CT_token: store.state.token
        }).then(info => {
          if (info) {
            this.$showToast('添加成功')
            address.id = info.id
            store.commit('setUser', {
              ...store.state.user,
              ...{ user_addrrss: [address] }
            })
            wx.navigateTo({
              url: '/pages/payment/payment'
            })
          }
        })
      }
    },
    onShow () {
      const info = JSON.parse(this.$root.$mp.query.info || {})
      console.log(info)
      for (let key in this.$data) {
        this[key] = info[key]
      }
    },
    components: { IcCheckbox, IcButton }
  }
</script>

<style lang="stylus">
  @import '../../utils/css/var'
  page
    height 100%
  .page-address-edit
    height 100%
    background-color $background-color
    padding-bottom 60px
    .form-container
      background-color #fff
      padding 0 25px
      .form-item
        display flex
        justify-content space-between
        align-items center
        padding 15px 0
        .label
          flex 1
          border-right $border
          margin-right 25px
        input
          flex 5
      .form-item:not(:last-child)
        border-bottom $border
    .set-default
      padding 25px
      display flex
      align-items center

    .btn-fixed
      position fixed
      width 100%
      left 0
      // TODO: why set bottom to zero cause some gap?
      bottom -5px
</style>
