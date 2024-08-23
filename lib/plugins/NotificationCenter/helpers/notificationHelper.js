import { createApp } from 'vue'
import NotificationTypes from '../components/NotificationTypes.vue'
import notificationCenter from '../notificationCenter'
import deepmerge from './deepmerge'

const addNotification = notificationCenter.methods.addNotification

const extendedTypes = ({ type, title, message, redirect }) => {
  const component = createApp(NotificationTypes, {
    type,
    title,
    message,
    redirect
  })
  return component
}

const notificationHelper = {
  pushNotification(notification = {}) {
    const { title, message, type, redirect } = notification
    delete notification.title
    delete notification.message

    const vmTypes = extendedTypes({ type, title, message, redirect })

    const notice = addNotification(
      deepmerge(
        {
          elements: [vmTypes]
        },
        notification,
        {
          options: {
            showCloseButton: true,
            timeDuration: null
          }
        }
      )
    )
    return notice
  },
  pushEmergencyNotification(notification = {}) {
    const { title, message, type, redirect } = notification
    delete notification.title
    delete notification.message

    const vmTypes = extendedTypes({ type, title, message, redirect })

    const notice = addNotification(
      deepmerge(
        {
          elements: [vmTypes],
          options: {
            timeDuration: null,
            elementClass: 'notification--notice',
            showCloseButton: true
          }
        },
        notification
      )
    )
    return notice
  }
}

export default notificationHelper
console.log('window: notificationHelper')
window.notificationHelper = notificationHelper
