import md5 from 'md5'
import tinycolor from 'tinycolor2'

const stringToColor = function (str) {
  let hash = 0
  for (let h = 0; h < str.length; h++) {
    hash = str.charCodeAt(h) + ((hash << 5) - hash)
  }
  var colour = '#'
  for (var c = 0; c < 3; c++) {
    var value = (hash >> (c * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

const numberToColor = function (num) {
  const str = md5(num.toString())
  return stringToColor(str)
}

const getColor = color => {
  let darkColor = '#' + tinycolor(color).darken().toHex()
  if (tinycolor(darkColor).getLuminance() > 0.75) return getColor(darkColor)
  if (tinycolor(darkColor).getLuminance() < 0.4)
    darkColor = '#' + tinycolor(darkColor).lighten().toHex()

  return darkColor
}

const getDarkColor = color => {
  let darkColor = '#' + tinycolor(color).darken(5).toHex()
  if (tinycolor(darkColor).getLuminance() > 0.4) return getDarkColor(darkColor)
  if (tinycolor(darkColor).getLuminance() < 0.3)
    darkColor = '#' + tinycolor(darkColor).lighten(5).toHex()

  return darkColor
}

const getLightColor = color => {
  let lightColor = '#' + tinycolor(color).lighten(2.5).toHex()
  if (tinycolor(lightColor).getLuminance() < 0.92)
    return getLightColor(lightColor)
  if (tinycolor(lightColor).getLuminance() > 0.98)
    lightColor = '#' + tinycolor(lightColor).darken(2.5).toHex()
  return lightColor
}

export default {
  stringToColor,
  numberToColor,
  getColor,
  getLightColor,
  getDarkColor
}
