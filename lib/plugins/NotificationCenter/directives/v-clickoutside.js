/*
 * Vue Directive: v-clickoutside
 *
 * url: https://vuejs.org/v2/guide/custom-directive.html
 *
 * `<element v-clickoutside="onClosepanel" />`
 * binds an event listener to an Element and fire Event when mouse pointer click outside the attached element
 *
 */
const hasTouch = () => window.matchMedia('(pointer: coarse)').matches
const hasNotHover = () => window.matchMedia('(any-hover: none)').matches

const setTouchOrClickEvent = () =>
	hasTouch() && hasNotHover() ? 'touchstart' : 'click'

export default {
	// Vue Hook Functions
	created(el, binding) {
		el.pointerEvent = event => {
			const path = event.path || (event.composedPath && event.composedPath())
			!Array.from(path).includes(el) && binding.value()
			return
		}
		el.domLoadEvent = ({ target }) => {
			console.log('Event:', setTouchOrClickEvent())
			target.addEventListener(setTouchOrClickEvent(), el.pointerEvent)
		}
	},
	mounted(el) {
		document.body.addEventListener(setTouchOrClickEvent(), el.pointerEvent)
		document.querySelectorAll('iframe').forEach(iframe => {
			const { contentDocument, contentWindow } = iframe
			;[contentDocument, contentWindow].forEach(dom => {
				if (
					dom &&
					Object.prototype.hasOwnProperty.call(dom, 'addEventListener') &&
					typeof dom.addEventListener === 'function'
				)
					dom.addEventListener('DOMContentLoaded', el.domLoadEvent)
			})
		})
	},
	beforeUnmount(el) {
		document.body.removeEventListener(setTouchOrClickEvent(), el.pointerEvent)
		document.querySelectorAll('iframe').forEach(iframe => {
			const { contentDocument, contentWindow } = iframe
			;[contentDocument, contentWindow].forEach(dom => {
				if (
					dom &&
					Object.prototype.hasOwnProperty.call(dom, 'removeEventListener') &&
					typeof dom.removeEventListener === 'function'
				) {
					dom.removeEventListener(setTouchOrClickEvent(), el.pointerEvent)
					dom.removeEventListener('DOMContentLoaded', el.domLoadEvent)
				}
			})
		})
	}
}
