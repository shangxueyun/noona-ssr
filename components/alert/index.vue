<template>
  <bb-dialog v-model="show" :fix-ios-focus="fixIosFocus" :offset-top="offsetTop" :hide-on-blur="hideOnBlur">
    <div class="bb-alert">
      <div :class="closeClass" @click="hide" />
      <slot name="title">
        <h3 class="bb-alert-title" v-html="title" />
      </slot>
      <div class="bb-alert-content">
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </bb-dialog>
</template>

<script>
import bbDialog from '../dialog'
export default {
  name: 'BbAlert',
  components: { bbDialog },
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    hideOnBlur: Boolean,
    fixIosFocus: {
      type: Boolean,
      default: false
    },
    offsetTop: {
      type: Boolean,
      default: false
    },
    closeClass: {
      type: String,
      default: 'bb-alert-close'
    }
  },
  data () {
    return {
      dialogShow: false
    }
  },
  watch: {
    show (val) {
      this.dialogShow = val
      this.$emit('update:show', val)
      this.$emit('change', val)
    },
    dialogShow (val) {
      this.show = val
    }
  },
  created () {
    if (typeof this.show !== 'undefined') {
      this.dialogShow = this.show
    }
  },
  methods: {
    hide () {
      this.$emit('update:show', false)
      this.$emit('change', false)
      this.$emit('on-hide')
    }
  }
}
</script>

<style lang="scss">
.bb-alert{
  background: #fff;
  width: 320px;
  border-radius: 8px;
  padding: 30px 20px 20px;
  font-size: 16px;
  position: relative;
  &-title{
    font-size: 20px;
    color: #3B424C;
  }
  &-content{
    min-height: 50px;
    padding: 15px 0;
    p{
      line-height: 1.5;
      font-size: 15px;
    }
  }
  &-close{
    position: absolute;
    background: url(./close.png) center center no-repeat;
    background-size: 15px 15px;
    width: 35px;
    height: 35px;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
