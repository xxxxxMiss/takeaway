<template>
  <div class="ic-input"
    :class="[
      'ic-input--' + size,
      {
        'ic-input--round': round,
        'ic-input--prefix': prefixIcon,
        'ic-input--suffix': suffixIcon || clearable,
        'ic-input--timer': timer,
        'ic-input--error': showError,
        'ic-input--focus': isFocus
      }
    ]">
    <slot name="prepend"></slot>
    <div class="ic-input__inner" @click.stop="$emit('click', $event)">
      <template v-if="type !== 'textarea'">
        <ic-icon v-if="prefixIcon"
          :name="prefixIcon"></ic-icon>
        <input class="ic-input__input"
          :unselectable="unselectable"
          :readonly="readonly"
          ref="input"
          @focus="handleFocus"
          @blur="handleBlur"
          @keyup.enter="$emit('keyup', $event)"
          :value="currentValue"
          :type="type"
          :autofocus="autofocus"
          :placeholder="placeholder"
          v-bind="$attrs"
          >
        <ic-icon v-if="suffixIcon"
          :name="suffixIcon"
          @click.stop="clickSuffix"></ic-icon>
        <ic-icon v-show="showClearable"
          name="clean"
          @click.stop="onClear"></ic-icon>
        <ic-button v-if="timer"
          timer
          text
          @timer-end="timerEnd"
          @click="timerClick"></ic-button>
      </template>

      <template v-else>
        <textarea
          class="ic-input__textarea"
          :value="currentValue"
          @focus="handleFocus"
          @blur="handleBlur"
          @keyup.enter="$emit('keyup', $event)"
          :rows="rows"
          :autofocus="autofocus"
          ref="textarea"
          :placeholder="placeholder"
          v-bind="$attrs"
          :unselectable="unselectable"
          :readonly="readonly"
        ></textarea>
        <div
          ref="mirror"
          class="ic-input__textarea ic-textarea--mirror"
          contenteditable
        >{{ currentValue }}</div>
      </template>
    </div>
    <div v-show="errorMsg"
      class="ic-input__errormsg">{{ errorMsg }}</div>
    <slot name="append"></slot>
  </div>
</template>

<script>
  import IcIcon from './icon'

  export default {
    name: 'ic-input',

    props: {
      prefixIcon: String,
      suffixIcon: String,
      size: {
        type: String,
        default: 'medium' // large, medium, small
      },
      clearable: {
        type: Boolean,
        default: false
      },
      round: {
        type: Boolean,
        default: false
      },
      value: {},
      autofocus: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      timer: {
        type: Boolean,
        default: false
      },
      timerEnd: {
        type: Function,
        default: () => {}
      },
      to: [String, Object],
      rows: {
        type: [String, Number],
        default: 3
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      showError: {
        type: Boolean,
        default: false
      },
      errorMsg: String,
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: String
    },
    computed: {
      currentValue: {
        set (v) {
          this.resizeTextarea()
          // https://github.com/vuejs/vue/issues/7042
          this.$nextTick(_ => this.$emit('input', v))
        },
        get () {
          return this.value
        }
      },
      showClearable () {
        return this.clearable && this.value && this.isFocus
      },
      style () {
        return {
          paddingRight: this.showClearable && this.suffixIcon
            ? '90px'
            : !this.showClearable && this.suffixIcon ||
              this.showClearable && !this.suffixIcon
              ? '50px'
              : '15px'
        }
      },
      unselectable () {
        return this.readonly ? 'on' : 'off'
      }
    },
    data () {
      return {
        textareaStyle: {},
        isFocus: false
      }
    },
    methods: {
      resizeTextarea () {
        if (this.type === 'textarea') {
          const { mirror, textarea } = this.$refs
          const mHeight = mirror.getBoundingClientRect().height
          const tHeight = textarea.getBoundingClientRect().height
          if (mHeight >= tHeight) {
            this.textareaStyle.height = `${mHeight}px`
          }
        }
      },
      onClear () {
        this.currentValue = ''
      },
      clickSuffix (e) {
        this.$emit('click-suffix', e)
        if (this.to) {
          this.$router.push(this.to)
        }
      },
      timerClick (e) {
        this.$emit('timer-click', e)
      },
      handleFocus (e) {
        this.isFocus = true
        // fix IOS `readonly`
        if (this.readonly) e.target.blur()
        this.$emit('focus', e)
      },
      handleBlur (e) {
        this.isFocus = false
        this.$emit('blur', e)
      }
    },
    components: { IcIcon }
  }
</script>

<style lang="stylus">
  @import '../utils/css/var'

  $caret-color = #FF6644
  $input-background-color = #F5F5F8
  $sizes = {
    large: {
      height: 45px,
      padding: 0 15px
      fontSize: 16px
    },
    medium: {
      height: 40px,
      padding: 0 20px
      fontSize: 14px
    },
    small: {
      height: 32px,
      padding: 0 15px,
      fontSize: 13px
    }
  }

  +prefix-classes($prefix-classes)
    .input
      &__inner
        position relative
      &__input, &__textarea
        outline none
        -webkit-appearance none
        background-color $input-background-color
        border 1px solid $input-background-color
        color $black
        font-weight 600
        width 100%
        border-radius 4px
        transition box-shadow .2s
        &[readonly]
          text-overflow ellipsis
        // caret-color $caret-color // 待定，该属性兼容性目前不是很好
      &__input[type=search]::-webkit-search-cancel-button
        -webkit-appearance none
      &__input::-webkit-input-placeholder
      &__textarea::-webkit-input-placeholder
        color $gray-dark

      &--focus &__input
      &--focus &__textarea
        background-color $white
        border-color $white
        box-shadow 0 4px 12px 0 rgba(0, 0, 0, .1)
      &--focus &__input[type=search]
        box-shadow none
        background-color $input-background-color

      for key, val in $sizes
        &--{key} &__input
          height: val['height']
          padding: val['padding']
          font-size: val['fontSize']

      &--suffix .icon-suffix
        center-y()
        right 15px
        font-size $font-size-xlarge
        color $gray-dark
      &--suffix .icon-suffix + .icon-suffix
          right 50px
      &--suffix &__input
          padding-right 50px

      &--prefix .icon-prefix
        center-y()
        left 15px
        font-size $font-size-xlarge
        color $gray-dark
      &--prefix &__input
          padding-left 45px

      &--round &__input
        border-radius 16px

      &--timer &__input
        padding-right 94px
      &--timer .btn
        center-y()
        right 0
        background-color $input-background-color
      &--focus .btn
        background-color $white

      &--error
        .icon-suffix
        .icon-prefix
          color $primary
      &--error &__input
      &--error &__textarea
        color $primary

      &__errormsg
        color $primary
        font-size $font-size-small
        padding-top 4px

      &__textarea
        line-height 1.5
        resize none
        padding 12px $padding-x
        font-size $font-size-medium
    .textarea--mirror
      opacity 0
      position absolute
      top 0
      z-index -1
</style>
