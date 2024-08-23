import Vue from 'vue'

// Factory: Delay
const Delay = function () {
	const state = {
		throttleTimerId: null,
		debouceTimerId: null
	}

	const methods = {
		// Throttle: Throttling is a technique in which, no matter how many times the user fires the event, the attached function will be executed only once in a given time interval.
		throttle(callback, delay) {
			if (state.throttleTimerId) {
				return
			}

			state.throttleTimerId = setTimeout(() => {
				callback()
				state.throttleTimerId = null
			}, delay)
			return state.throttleTimerId
		},
		cancelThrottle() {
			clearTimeout(state.throttleTimerId)
		},
		// Debounce: In the debouncing technique, no matter how many times the user fires the event, the attached function will be executed only after the specified time once the user stops firing the event.
		debounce(callback, delay) {
			clearTimeout(state.debouceTimerId)
			state.debouceTimerId = setTimeout(callback, delay)
		},
		cancelDebounce() {
			clearTimeout(state.debouceTimerId)
		},
		cancelAll() {
			methods.cancelThrottle()
			methods.cancelDebounce()
		}
	}

	return methods
}

// Factory: vueDirective
const vueDirective = function () {
	// Init Factory Delay
	const delay = Delay()

	const state = Vue.observable({
		disabled: false,
		isScrollTop: false,
		directionIsUp: false,
		scrollCount: 0,
		touchstartY: 0
	})

	const methods = {
		checkScrollDirectionIsUp(event) {
			if (event.wheelDelta) {
				return event.wheelDelta > 0
			}
			return event.deltaY < 0
		},
		resetScrollCount() {
			state.scrollCount = 0
		},
		// Attach Events to API
		addEventListeners(el, Events) {
			Object.entries(Events).forEach(([eventName, fn]) => {
				el.addEventListener(eventName, fn, {
					passive: true
				})
			})
		},
		// Detach Events from API
		removeEventListerners(el, Events) {
			Object.entries(Events).forEach(([eventName, fn]) => {
				el.removeEventListener(eventName, fn, {
					passive: true
				})
			})
		}
	}

	return {
		created(el, binding) {
			el.style.overscrollBehaviorY = 'contain'

			const { value } = binding
			const callback =
				typeof value === 'function'
					? value
					: typeof value === 'object'
					? value.callback
					: console.warn.bind(console, 'callback needed')
			const disabled = typeof value === 'object' ? value.disabled : false
			state.disabled = disabled

			methods.resetScrollCount()
			const pullScrollTransformY = px => {
				el.style.transform = `translateY(${(px / 40) * px}px)`
			}

			const Events = {
				scroll(event) {
					const isScrollTop = event.currentTarget.scrollTop <= 0
					state.isScrollTop = isScrollTop

					if (
						!disabled &&
						isScrollTop &&
						state.directionIsUp &&
						typeof callback === 'function'
					) {
						// console.log('scrollEvent');
						callback()
					}
				},
				wheel(event) {
					const directionIsUp = methods.checkScrollDirectionIsUp(event)
					state.directionIsUp = directionIsUp

					if (!directionIsUp) methods.resetScrollCount()

					if (!disabled && state.isScrollTop && directionIsUp) {
						// console.log('wheelEvent', el.scrollHeight, state.scrollCount);

						pullScrollTransformY(state.scrollCount)

						delay.debounce(() => {
							methods.resetScrollCount()
							pullScrollTransformY(state.scrollCount)
						}, 200)
						if (state.scrollCount >= 40) {
							delay.throttle(() => {
								callback()
								methods.resetScrollCount()
								pullScrollTransformY(state.scrollCount)
							}, 200)
						} else {
							++state.scrollCount
						}
					}
				},
				touchstart(event) {
					state.touchstartY = event.touches[0].pageY
				},
				touchmove(event) {
					const y = event.touches[0].pageY
					// Activate custom pull-to-refresh effects when at the top fo the container
					// and user is scrolling up.
					if (
						event.currentTarget.scrollTop === 0 &&
						y > state.touchstartY &&
						!disabled
					) {
						// console.log('touchmoveEvent');
						callback()
					}
				}
			}
			Object.assign(el, {
				Events
			})
		},
		mounted(el) {
			methods.addEventListeners(el, el.Events)
		},
		beforeUnmount(el) {
			methods.removeEventListerners(el, el.Events)
			methods.resetScrollCount()
			delay.cancelAll()
		}
	}
}

export default vueDirective
