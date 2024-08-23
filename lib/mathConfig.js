import { create, all } from 'mathjs'

// create a mathjs instance with configuration
const config = {
  number: 'BigNumber',
  precision: 64,
  epsilon: 1e-60,
  matrix: 'Matrix',
  predictable: false,
  randomSeed: null
}

const math = create(all, config)

export default math
