import Vue from 'vue'
import store from '@store'

let mountWrapper

const createDivInBody = () => {
  mountWrapper = document.getElementById('mount-wrapper')
  if (!mountWrapper) {
    mountWrapper = document.createElement('div')
    mountWrapper.id = 'mount-wrapper'
    mountWrapper.classList.add('mount-wrapper')
    document.body.appendChild(mountWrapper)
  }

  const el = document.createElement('div')
  mountWrapper.insertBefore(el, null)
  return el
}

export default function mountComponentAsRoot({ component, data, events }) {
  const el = createDivInBody()
  const vue = new Vue({
    el,
    store,
    render: h =>
      h(component, {
        props: data,
        on: events
      })
  })

  const destroy = () => {
    const v = vue.$children[0]?.$children[0]
    if (!v) return
    v.$destroy()
    v.$el?.parentNode?.removeChild(v.$el)
  }

  return {
    vue,
    destroy
  }
}
