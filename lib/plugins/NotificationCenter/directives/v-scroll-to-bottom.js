const isObject = obj => typeof obj === 'object' && obj !== null
const ignoreScroll = options =>
  isObject(options) &&
  Object.hasOwnProperty.call(options, 'ignoreScroll') &&
  typeof options.ignoreScroll === 'boolean' &&
  options.ignoreScroll

export default {
  mounted(el, binding) {
    const { value: options } = binding
    if (!ignoreScroll(options)) el.scrollIntoView(options)
  }
}
