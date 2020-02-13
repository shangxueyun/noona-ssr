<template>
  <div v-show="visible" class="bobo">
    <div v-show="visible" class="bobo-wrap" :class="customClass">
      <transition name="bobo-toast-pop">
        <div v-show="visible" class="bobo-toast" :class="className" :style="{ 'padding': iconClass === '' ? '10px' : '20px' }">
          <div v-if="topContent.contentClass && topContent.message" :class="topContent.contentClass">
            {{ topContent.message }}
          </div>
          <i v-if="iconClass !== ''" class="bobo-toast-icon" :class="iconClass" />
          <template v-if="bottomContent.contentClass && bottomContent.message">
            <span :class="bottomContent.contentClass" :style="{ 'padding-top': iconClass === '' ? '0' : '10px' }">{{ bottomContent.message }}</span>
          </template>
          <template v-else>
            <span class="bobo-toast-text" :style="{ 'padding-top': iconClass === '' ? '0' : '10px' }">{{ message }}</span>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'middle'
    },
    iconClass: {
      type: String,
      default: ''
    },
    bottomContent: {
      type: Object,
      default: () => {
        return {
          contentClass: '',
          message: ''
        }
      }
    },
    topContent: {
      type: Object,
      default: () => {
        return {
          contentClass: '',
          message: ''
        }
      }
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    customClass () {
      const classes = []
      switch (this.position) {
        case 'top':
          classes.push('is-placetop')
          break
        case 'bottom':
          classes.push('is-placebottom')
          break
        default:
          classes.push('is-placemiddle')
      }
      // classes.push(this.className)
      return classes.join(' ')
    }
  }
}
</script>

<style lang="scss">
.bobo {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
    &-wrap{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    &.is-placetop {
      top: pxTorem(50px);
      left: 50%;
      transform: translate(-50%, 0);
    }

    &.is-placemiddle {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &.is-placebottom {
      bottom: pxTorem(50px);
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  &-toast {
    max-width: 80%;
    border-radius: pxTorem(5px);
    padding:  0 pxTorem(10px);
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;

    transition: opacity .3s linear;
    &-icon {
      display: block;
      text-align: center;
      font-size: pxTorem(56px);
    }

    &-text {
      font-size: 14px;
      display: block;
      text-align: center;
    }

    &-pop-enter, &-pop-leave-active {
      opacity: 0
    }
  }
}
</style>
