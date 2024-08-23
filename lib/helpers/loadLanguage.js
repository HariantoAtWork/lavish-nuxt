const getLanguage = (
  language = 'default',
  languagesImportMetaGlob /* './locales/*.json' */
) =>
  new Promise((resolve, reject) => {
    const foundItem = Object.keys(languagesImportMetaGlob).find(i => {
      const regexp = /^\.\/locales\/(.+)\.json$/
      return regexp.exec(i)[1] === language
    })
    foundItem ? resolve(languagesImportMetaGlob[foundItem]()) : reject({})
  })

export const loadLanguage = (
  language = 'default',
  languagesImportMetaGlob /* './locales/*.json' */
) =>
  Promise.resolve()
    .then(() => {
      if (language !== 'default' && language.length > 2) {
        return getLanguage(language, languagesImportMetaGlob).catch(() =>
          getLanguage(language.slice(0, 2), languagesImportMetaGlob)
        )
      } else {
        return getLanguage(language, languagesImportMetaGlob)
      }
    })
    .catch(() => getLanguage('default', languagesImportMetaGlob))
