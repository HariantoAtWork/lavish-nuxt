export function getLocalesFromNavigator() {
  const locales = []
  locales.push(...navigator.languages)
  return locales
}
