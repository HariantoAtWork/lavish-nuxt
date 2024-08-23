<template>
  <div class="progressbar" :title="width">
    <span class="progressbar-inner" :style="{ width }" />
  </div>
</template>

<script>
export default {
  // props: {
  //   rate: {
  //     type: Number,
  //     default: 0.5,
  //     required: true
  //   }
  // },
  data: () => ({
    rate: 0.5
  }),
  computed: {
    width() {
      return `${this.rate * 100}%`
    }
  },
  methods: {
    updateRate(value) {
      this.rate = value
    }
  }
}
</script>

<style lang="scss" scoped>
.progressbar {
  pointer-events: none;
  background-color: purple;
  height: 2px;
  width: 100%;
  &-inner {
    float: left;
    white-space: pre;
    height: 100%;
    background-color: yellow;
  }
}
</style>
