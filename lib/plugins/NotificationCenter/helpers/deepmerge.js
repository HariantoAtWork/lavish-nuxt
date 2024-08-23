import dm from 'deepmerge'
const filterUnique = (value, index, self) => self.indexOf(value) === index

const arrayMerge = (target, update) =>
	[...target, ...update].filter(filterUnique)

const deepmerge = (...updates) => {
	let target = {}
	while (updates.length) {
		target = dm(target, updates.shift(), { arrayMerge })
	}
	return target
}

export default deepmerge
