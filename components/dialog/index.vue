<template>
  <div v-show="show" class="dialog-box" @touchmove="endMove($event)">
    <transition name="dialog-mask">
      <div v-show="show" class="dialog-mask" @click="hide" />
    </transition>
    <div v-show="show" class="dialog-container" :class="{offsetTop: offsetTop && !Detect.os.ios}">
      <transition name="dialog-container">
        <div v-show="show">
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Detect from '~/plugins/detect'
export default {
  name: 'BbDialog',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fixIosFocus: {
      type: Boolean,
      default: false
    },
    hideOnBlur: Boolean,
    offsetTop: {
      type: Boolean,
      default: false
    },
    isMove: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Detect,
      bodyTop: 0
    }
  },
  watch: {
    show (val) {
      this.$emit('update:show', val)
      const stopScroll = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (val) {
        let ios = Detect.os.ios
        if (ios && this.fixIosFocus) {
          document.body.style = 'overflow:hidden;position: fixed;width: 100%;'
        } else {
          document.body.style = 'overflow:hidden;'
        }
        if (this.isMove) {
          this.bodyTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
          document.body.style.top = -1 * this.bodyTop + 'px'
          document.body.style.position = 'fixed'
          document.body.addEventListener('scroll', stopScroll)
        }
      } else {
        document.body.style = 'overflow:auto'
        if (this.isMove) {
          document.body.style.position = null
          document.body.style.top = null
          document.documentElement.scrollTop = this.bodyTop
          document.body.scrollTop = this.bodyTop
          document.body.removeEventListener('scroll', stopScroll)
        }
      }
    }
  },
  mounted () {
    let bodyTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    this.bodyTop = bodyTop
    // if (process.server) return
  },
  methods: {
    hide () {
      if (this.hideOnBlur) {
        this.$emit('update:show', false)
        this.$emit('change', false)
      // this.$emit('on-click-mask')
      }
    },
    endMove (event) {
      if (!this.isMove) {
        event.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss">
  .dialog-box{
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    .dialog-mask{
      position: fixed;
      z-index: 100;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .6);
    }
    .dialog-container{
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 101;
      transform: translate(-50%, -50%);
      &.offsetTop{
        top:0;
        transform: translate(-50%, 0);
      }
    }
  }
  .dialog-mask-enter,
  .dialog-mask-leave-active{
    opacity: 0;
  }
  .dialog-mask-leave-active,
  .dialog-mask-enter-active {
    transition: opacity 300ms;
  }
  .dialog-container-enter-active {
  animation: dialog-container-in .5s;
}
.dialog-container-leave-active {
  animation: dialog-container-out .3s;
}
@keyframes dialog-container-in {
  0% {
    transform: scale(1.185);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes dialog-container-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.85);
    opacity: 0;
  }
}

</style>
