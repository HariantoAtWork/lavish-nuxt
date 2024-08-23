import sanitizeHtml from 'sanitize-html'

export default {
  // Vue Hook Functions
  mounted(el, binding) {
    const { value } = binding
    const options = {
      allowedClasses: {
        '*': ['*']
      }
    }
    el.innerHTML = sanitizeHtml(value, options)
  }
}
