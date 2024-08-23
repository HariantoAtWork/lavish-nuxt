<template>
  <span class="flex">
    <textarea
      class="input-field flex-1"
      type="text"
      ref="input"
      :value="inputValue"
      :placeholder="placeholder"
      :title="placeholder"
      @input="updateValue($event.target.value)"
      @blur="saveData"
      @keyup.enter="saveData"
      @keyup.esc="revertData"
    />
  </span>
</template>

<script>
export default {
  name: 'BaseTextArea',
  props: {
    modelValue: [String, Number],
    placeholder: String
  },
  data() {
    return {
      inputValue: this.modelValue,
      savedValue: this.modelValue
    }
  },
  methods: {
    saveData(event) {
      if (!event.shiftKey && typeof this.inputValue === 'string') {
        this.savedValue = this.inputValue = this.inputValue.trim()
        this.$emit('update:modelValue', this.savedValue)
      }
    },
    revertData() {
      this.inputValue = this.savedValue
      this.$emit('update:modelValue', this.savedValue)
    },
    updateValue(value) {
      this.inputValue = value
    }
  }
}
</script>

<style lang="scss" scoped>
@tailwind utilities;
.input-field {
  width: 100%;
}

.flex {
  display: flex;

  &-1 {
    flex: 1;
  }
}
textarea {
  padding: 4px;
}
</style>
