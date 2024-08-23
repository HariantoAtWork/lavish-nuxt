// import { createApp } from 'vue/dist/vue.esm-bundler.js'
import NotificationTypes from '../components/NotificationTypes.vue'
import deepmerge from '../helpers/deepmerge'
import { createProxy } from '../lib/createProxy'
import notificationCenter from '../notificationCenter'
const {
  methods: { addNotification },
  defaults: { notificationPosition, notificationType }
} = notificationCenter

const capitalize = s => {
  if (typeof s !== 'string') return ''
  s = (' ' + s).slice(1)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Factory: createExampleTypeMethods
const createExampleTypeMethods = typesObject => {
  const methods = {}

  Object.values(typesObject).forEach(value => {
    methods['exampleType' + capitalize(value)] = (notification = {}) => {
      return addNotification(
        deepmerge(
          {
            title: capitalize(value),
            type: value
          },
          notification
        )
      )
    }
  })
  return methods
}
// Factory: createExamplePositionMethods
const createExamplePositionMethods = typesObject => {
  const methods = {}
  Object.values(typesObject).forEach(value => {
    methods['examplePosition' + capitalize(value)] = (notification = {}) => {
      return addNotification(
        deepmerge(
          {
            title: value.toUpperCase(),
            position: value
          },
          notification
        )
      )
    }
  })
  return methods
}

const methods = {
  ...createExampleTypeMethods(notificationType),
  ...createExamplePositionMethods(notificationPosition),
  exampleTypes(notification = {}) {
    Object.values(createExampleTypeMethods(notificationType)).forEach(fn =>
      fn(
        deepmerge(
          {
            options: {
              timeDuration: null
            }
          },
          notification
        )
      )
    )
  },
  examplePositions(notification = {}) {
    Object.values(createExamplePositionMethods(notificationPosition)).forEach(
      fn =>
        fn(
          deepmerge(
            {
              options: {
                // canClose: true,
                // showCloseButton: true,
                timeDuration: null
              }
            },
            notification
          )
        )
    )
  },
  exampleElements() {
    // Use Options API
    const optionsApi = {
      template: `Hello {{ text }} world`,
      data: () => ({
        text: 'My'
      })
    }

    // Use HTMLElement template
    const createClonedFromTemplate = () => {
      const template = document.createElement('template')
      template.innerHTML =
        '<div>Nigga</div>Hello <b>bold</b> world <strong>strong</strong>'

      // Get the content of the `template.content`
      return template.content.cloneNode(true) // Clone the content
    }

    // HTMLElement
    const CustomDOMButton = buttonText => {
      const root = document.createElement('button'),
        textNode = document.createTextNode(buttonText),
        clickEvent = event => {
          root.innerHTML = 'Clicked'
          console.log('Cat say:' + buttonText)
          notification.destroy()
        }

      root.onclick = clickEvent
      root.classList.add('btn', 'btn-primary')
      root.appendChild(textNode)
      return root
    }

    // use Extend Vue Module with `createProxy`
    const proxy = createProxy({
      data: () => ({
        text: 'Proxy'
      }),
      template: `As the world {{text}} turns<button @click="onDestroy">Destroy</button>`,
      methods: {
        onDestroy() {
          if (typeof this.destroy === 'function') this.destroy()
        }
      }
    })
    proxy.destroy = () => {
      notification.destroy()
    }

    // use Extend Vue Module with `createProxy`
    const proxyUnmountButton = createProxy({
      data: () => ({
        text: 'Proxy'
      }),
      template: `<button @click="onUnmount">Unmount this element</button>`,
      methods: {
        onUnmount() {
          if (typeof this.destroy === 'function') this.destroy(this)
        }
      }
    })
    proxyUnmountButton.destroy = vm => {
      vm.$.appContext.app.unmount()
    }

    // Notification
    const notification = addNotification({
      elements: [
        optionsApi,
        createClonedFromTemplate(),
        CustomDOMButton('CustomButton'),
        proxy.$el,
        proxyUnmountButton.$el
      ],
      position: 'topRight',
      options: {
        timeDuration: null,
        elementClass: 'notification--notice'
      }
    })
    return notification
  },
  pushNotice(type, notification = {}) {
    const { title, message } = notification
    delete notification.title
    delete notification.message

    // console.log(NotificationTypes)
    const proxy = createProxy(NotificationTypes, {
      type,
      title,
      message
    })
    console.log({
      proxy,
      $el: proxy.$el,
      typeOf: proxy.$el instanceof Text,
      constructor: proxy.$el.constructor.name,
      tagName: proxy.$el.tagName
    })
    proxy.$$on('decline', () => {
      console.log('--- DESTROY')
      notice.destroy()
    })
    const notice = addNotification(
      deepmerge(
        {
          elements: [proxy.$el],
          options: {
            timeDuration: null,
            elementClass: 'notification--notice'
          }
        },
        notification,
        {
          type
        }
      )
    )
    return notice
  }
}

export default methods

setTimeout(() => {
  methods.examplePositions({
    options: {
      // showCloseButton: true,
      timeDuration: null
    }
  })
  ;['default', 'info', 'danger', 'loading', 'success'].forEach(type => {
    methods.pushNotice(type, {
      title: type,
      message:
        type === 'danger'
          ? 'Push your water glass on the floor commence midnight zoomies, find something else more interesting. Drool sugar, my siamese, stalks me (in a good way), day and night found somthing move i bite it tail.'
          : null,
      options: {
        canClose: true,
        // showCloseButton: true,
        timeDuration: null
      }
    })
  })
  methods.exampleElements()
}, 2e3)

window.exampleNotification = methods
