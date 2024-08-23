import { createApp } from 'vue/dist/vue.esm-bundler'

import log from '../helpers/log'
let logText = ''
const appendChild = (parentNode, childNode) => {
  log(
    `-- # constructor: ${childNode?.constructor?.name} (${
      childNode instanceof HTMLElement
    })`
  )

  switch (true) {
    case childNode instanceof HTMLTemplateElement:
      log('---- HTMLTemplateElement')
      logText += '.HTMLTemplateElement'
      log(logText)
      logText = ''
      Array.from(childNode.childNodes).forEach(child =>
        parentNode.appendChild(child)
      )
      break

    case childNode instanceof DocumentFragment ||
      childNode instanceof Text ||
      childNode instanceof HTMLElement:
      log('---- DocumentFragment|Text|HTMLElement')
      logText += '.DocumentFragment|Text|HTMLElement'
      log(logText)
      logText = ''
      if (childNode?.parentNode?.childNodes) {
        Array.from(childNode.parentNode.childNodes).forEach(child =>
          parentNode.appendChild(child)
        )
      } else {
        parentNode.appendChild(childNode)
      }
      break

    case childNode instanceof Object:
      log('---- Object Vue Component')
      let template = document.createElement('template')
      logText += '.VueComponent'
      // Check if object is a Vue App or Vue Component
      if (typeof childNode.mount === 'function') {
        // Vue App
        log('------ by: createApp')
        logText += '.createApp'
        if (childNode._container) {
          log('-------- is already mounted')
          logText += '._container'
          template = childNode._container
        } else {
          log('-------- mount the childNode')
          logText += '.mountChildNodeToTemplate'
          childNode.mount(template)
        }
      } else {
        // Vue Component
        log('------ by: defineComponent')
        logText += '.defineComponent'
        if (childNode?.$?.isMounted) {
          logText += '.$el'
          template = childNode.$el
        } else {
          logText += '.createAppAndMount'
          createApp(childNode).mount(template)
        }
      }
      appendChild(parentNode, template)
      break

    default:
      log('---- nothing')
      logText += '.nothing'
      log(logText)
      logText = ''
      break
  }
}

export default {
  mounted(el, binding) {
    const { value: elements } = binding
    elements.forEach(childNode => appendChild(el, childNode))
  }
}
