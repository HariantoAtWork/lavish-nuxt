import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'

import dayjs from './helpers/dayjs-extend'
import deepmerge from './helpers/deepmerge'
import validateKeys from './helpers/validateKeys'
import createEventBus from './lib/createEventBus'
import createTimer from './lib/createTimer'

const defaults = {
	// #region notificationType
	get notificationType() {
		return {
			DEFAULT: 'default',
			INFO: 'info',
			SUCCESS: 'success',
			WARNING: 'warning',
			DANGER: 'danger',
			ERROR: 'error'
		}
	},
	// #endregion notificationType

	// #region notificationPosition
	get notificationPosition() {
		return {
			TOPLEFT: 'topLeft',
			TOPCENTER: 'topCenter',
			TOPRIGHT: 'topRight',
			BOTTOMLEFT: 'bottomLeft',
			BOTTOMCENTER: 'bottomCenter',
			BOTTOMRIGHT: 'bottomRight'
		}
	},
	// #endregion notificationPosition

	// #region defaultNotification
	// Default Settings for Notification
	get notification() {
		return {
			uuid: uuidv4(),
			title: null,
			message: null,
			elements: [],
			type: this.notificationType.DEFAULT,
			position: this.notificationPosition.BOTTOMLEFT,
			options: {
				show: false,
				canClose: true,
				showCloseButton: false,
				timeStart: null, // Date object
				timeDuration: 3e3,
				elementClass: '' // Append CSS class name in the element, ex: `notification--notify`
			},
			meta: {} // Empty Object: pass any property values
		}
	}
	// #endregion defaultNotification
}

const compare = {
	notification: {
		type(originalValue, newValue) {
			return Object.values(defaults.notificationType).includes(newValue)
				? newValue
				: originalValue
				? originalValue
				: defaults.notification.type
		},
		position(originalValue, newValue) {
			return Object.values(defaults.notificationPosition).includes(newValue)
				? newValue
				: originalValue
				? originalValue
				: defaults.notification.position
		}
	}
}

// Factory: createNotification
const createNotification = function (notification, { parentMethods }) {
	const { notification: defaultNotification } = defaults
	notification = reactive(
		deepmerge(
			defaultNotification,
			validateKeys(defaultNotification, notification, compare.notification)
		)
	)

	const event = createEventBus(),
		{ $on, $off, $emit } = event

	let timerId = null

	const now = new Date(),
		{ options } = notification,
		timeStart = options.timeStart ? options.timeStart : now

	const timer = createTimer({
		timeStart,
		timeDuration: options.timeDuration,
		onStartTimer() {
			// console.log('started!', notification.uuid);
			options.show = true
		},
		onEndTimer() {
			// console.log('ended!', notification.uuid);
			if (options.timeDuration) actions.destroy()
		}
	})

	if (
		dayjs(now).isBetween(
			timeStart,
			dayjs(timeStart).add(options.timeDuration, 'millisecond'),
			null,
			'[]'
		)
	) {
		timer.startTimer()
	} else if (dayjs(now).isSameOrBefore(timeStart)) {
		// console.log('Future!', notification.uuid);
		const timeDiff = timeStart.getTime() - now.getTime()
		timerId = setTimeout(timer.startTimer, timeDiff)
	}

	const actions = {
		toggleVisibility() {
			options.show = !options.show
			console.log({ show: options.show })
		},
		hide() {
			options.show = false
		},
		destroy() {
			actions.destroyEvents()
			parentMethods.removeNotification(notification)
		},
		destroyEvents() {
			clearTimeout(timerId)
			timer.stopTimer()
			event.$emit('destroy', { notification })
			event.$destroy()
			if (typeof notification.onDestroy === 'function') notification.onDestroy()
		}
	}

	return {
		...notification,
		...actions,
		$on,
		$off,
		$emit
	}
}

// Factory: createNotificationCenter
const createNotificationCenter = function (notifications) {
	// STORE: state
	const state = reactive({
		notifications: Array.isArray(notifications) ? notifications : []
	})
	// STORE: methods
	const methods = {
		addNotification(notification) {
			if (typeof notification === 'string') {
				const message = notification
				notification = {
					title: 'Message',
					message
				}
			}
			// const notice = reactive(new Notification(notification))
			const notice = reactive(
				createNotification(notification, { parentMethods: methods })
			)
			state.notifications.unshift(notice)
			return notice
		},
		removeNotification(notification) {
			return methods.removeNotificationByUuid(notification.uuid)
		},
		removeNotificationByUuid(uuid) {
			const { notifications } = state
			const foundIndex = notifications.findIndex(
				notification => notification.uuid === uuid
			)
			if (foundIndex > -1) return notifications.splice(foundIndex, 1)
		},
		removeNotifications() {
			const { notifications } = state
			return notifications.splice(0, notifications.length)
		}
	}

	return {
		state,
		methods,
		...methods
	}
}

const notificationCenter = {
	...createNotificationCenter(),
	createNotificationCenter,
	defaults,
	dayjs
}

export default notificationCenter

// export { state, methods };

// #region window
// Test: window.notificationCenter
window.notificationCenter = notificationCenter
// #endregion window
