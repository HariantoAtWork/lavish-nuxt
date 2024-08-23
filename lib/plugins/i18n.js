// plugins/i18n.js
import { reactive } from 'vue'
import dm from '~/lib/deepmerge'

// --- state
export const state = reactive({
  language: import.meta.browser ? navigator.language : 'default',
  messages: {}
})
// --- methods
export const methods = {
  updateMessages(data = {}) {
    return Object.assign(state.messages, dm(state.messages, data))
  },
  findLanguage(
    localesImportMetaGlob /* import.meta.glob('./locales/*.json') */,
    language = 'default'
  ) {
    return new Promise((resolve, reject) => {
      const foundItem = Object.keys(localesImportMetaGlob).find(i => {
        const regexp = /^\.\/locales\/(.+)\.json$/
        return regexp.exec(i).length > 1 && regexp.exec(i)[1] === language
      })
      localesImportMetaGlob[foundItem] instanceof Function
        ? resolve(localesImportMetaGlob[foundItem]())
        : reject({})
    })
  },
  getFallbackLanguage(
    localesImportMetaGlob /* import.meta.glob('./locales/*.json') */,
    language = 'default'
  ) {
    return Promise.resolve()
      .then(() => {
        if (language !== 'default' && language.length > 2) {
          return this.findLanguage(localesImportMetaGlob, language).catch(() =>
            this.findLanguage(localesImportMetaGlob, language.slice(0, 2))
          )
        } else {
          return this.findLanguage(localesImportMetaGlob, language)
        }
      })
      .catch(() => this.findLanguage(localesImportMetaGlob, 'default'))
  },
  onChangeLanguage(
    localesImportMetaGlob /*import.meta.glob('./locales/*.json')*/,
    language = 'default',
    messagesDefault = {}
  ) {
    // Language
    return methods
      .getFallbackLanguage(
        localesImportMetaGlob /*import.meta.glob('./locales/*.json')*/,
        language
      )
      .then(methods.updateMessages)
      .catch(error => {
        console.log('--- RESET IT', error)
        methods.updateMessages(messagesDefault)
      })
  }
}

// ----------------------------------------------------------------
// ----- Mixin
/*
  import { languageMixin } from '~/lib/plugins/i18n'
  mixins: [
    languageMixin(import.meta.glob('./locales/*.json'), {
      ProductOverview: {}
    }),
  ],
*/
export const languageMixin = function (
  localesImportMetaGlob = import.meta.browser
    ? import.meta.glob('./locales/*.json')
    : {},
  messagesDefault = {}
) {
  return import.meta.client
    ? {
        computed: {
          $language() {
            return state.language
          },
          $messages() {
            return state.messages
          }
        },
        watch: {
          $language(newValue, oldValue) {
            // console.log({ newValue, oldValue })

            methods.onChangeLanguage(
              localesImportMetaGlob,
              newValue,
              messagesDefault
            )
          },
          $messages(newValue, oldValue) {
            // console.log('messages', { newValue })
          }
        },
        methods: {
          $loadLanguage(language = 'nl') {
            // Language
            return (
              methods
                // Get Fallback json file
                .onChangeLanguage(
                  localesImportMetaGlob,
                  language,
                  messagesDefault
                )
            )
          }
        },
        // LifeCycle Hooks
        mounted() {
          this.$loadLanguage(this.$language)
        }
      }
    : {}
}

// ----------------------------------------------------------------
// ----- Plugin: Vue Plugin
export const plugin = {
  install(App, options) {
    const translate = (key, replace) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      const output = key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
      return output ? output : replace ? replace : key
    }
    // Able to Provide/Inject  with: `inject: ['i18n'],`
    // And access with: this.i18n.translate('Products.buyProduct', 'Koop product')
    // access with: this.i18n.$__('Products.buyProduct', 'Koop product')
    // (https://vuejs.org/guide/reusability/plugins)
    App.provide('i18n', {
      translate,
      $__: import.meta.browser ? translate : Function
    })
    // inject a globally available $__() method
    App.config.globalProperties.$__ = import.meta.browser ? translate : Function
  }
}

export default plugin
