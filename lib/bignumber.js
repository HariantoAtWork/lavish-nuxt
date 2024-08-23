import BigNumber from 'bignumber.js'
export default BigNumber
console.log({ BigNumber })
const ALPHABET = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const BnAlpha = BigNumber.clone({
  ALPHABET
})

const alphaToDigits = alpha => {
  const x = new BnAlpha(alpha, ALPHABET.length)
  return x.toString()
}

const digitsToAlpha = digits => {
  const y = new BnAlpha(digits)
  return y.toString(ALPHABET.length)
}

const offsetAlphaToDigits = alpha => {
  const x = new BnAlpha(alpha, ALPHABET.length)
  const subtracted = BnAlpha(x.toString()).minus(alphaToDigits('A00000'))
  return subtracted.toString()
}

const offsetDigitsToAlpha = digits => {
  const y = new BnAlpha(BnAlpha(digits).plus(alphaToDigits('A00000')))
  return y.toString(ALPHABET.length)
}

export {
  ALPHABET,
  BnAlpha,
  alphaToDigits,
  digitsToAlpha,
  offsetAlphaToDigits,
  offsetDigitsToAlpha
}
