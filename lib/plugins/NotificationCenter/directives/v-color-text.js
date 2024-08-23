import colorHelper from '../helpers/color'

export default {
	// Vue Hook Functions
	mounted(el, binding) {
		const {
			value: { defaultId }
		} = binding
		const color = colorHelper.getDarkColor(colorHelper.numberToColor(defaultId))
		el.style.color = color
	}
}
