<template>
  <span class="flex"
    ><input type="checkbox" :title="placeholder" v-model="checked"
  /></span>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    placeholder: String
  },
  emits: ['update:modelValue'],
  data() {
    return {
      checked: this.modelValue
    }
  },
  watch: {
    checked(newVal) {
      this.$emit('update:modelValue', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;

  &-1 {
    flex: 1;
  }
}
input {
  padding: 4px;
}
</style>
