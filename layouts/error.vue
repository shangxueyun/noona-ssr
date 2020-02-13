<template>
  <div class="container">
    <div v-if="error.statusCode === 404" class="error-msg">
      <p class="error-code">
        {{ error.statusCode }}
      </p>
      <p>{{ error.message }}</p>
    </div>
    <div v-else class="error-msg">
      Page does not exist
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  layout: 'error'
}
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #f7f8fb;
  display: flex;
  justify-content: center;
  .error-msg {
    margin-top: 30%;
    text-align: center;
    font-size: 20px;
    color: #7f828b;
    .error-code {
      color: #47494e;
      font-size: 50px;
    }
  }
}
</style>
