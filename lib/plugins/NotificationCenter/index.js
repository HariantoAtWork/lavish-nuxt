// plugins/NotificationCenter/index.js
import Notification from './components/Notification.vue'
import NotificationCenter from './components/NotificationCenter.vue'
import notificationCenter from './notificationCenter'
import './scss/index.scss'

export const provide = {
	nc: notificationCenter.methods
}
export const component = {
	NotificationCenter
}
export const plugin = {
	install(vueApp) {
		vueApp.component('NotificationCenter', NotificationCenter)
		vueApp.provide('nc', notificationCenter.methods)
		vueApp.config.globalProperties.$notify =
			notificationCenter.methods.addNotification
	}
}
export default {
	...plugin,
	Notification,
	NotificationCenter,
	component,
	notificationCenter,
	provide
}
