import { createApp } from 'vue'

export const createProxy = (
  vueOjbject = { template: `<span>test</span>` },
  props = {}
) => {
  const template = document.createElement('template')
  const app = createApp(vueOjbject, props)
  return app.mount(template) // Proxy Object
}
