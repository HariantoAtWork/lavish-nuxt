import { isMobile } from '../helpers/utility'

export default {
	created(el, binding) {
		const { value: callback } = binding
		const resizeEvent = () => {
			callback(isMobile())
		}
		resizeEvent()
		el.resizeEvent = resizeEvent
	},
	mounted(el) {
		window.addEventListener('resize', el.resizeEvent)
	},
	beforeUnmount(el) {
		window.removeEventListener('resize', el.resizeEvent)
	}
}
