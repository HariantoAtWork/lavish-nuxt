<template>
  <div class="notification-types">
    <div class="notification__container">
      <aside
        v-if="!showType('default')"
        class="notification__aside"
        :class="`notification__aside--${type}`"
      >
        <Spinner
          v-if="showType('loading')"
          class="spinner"
          :color="colorSpinner"
        />
        <i v-if="showType('success')" class="material-icons">check_circle</i>
        <i v-if="showType('info')" class="material-icons">information</i>
        <i
          v-if="showType('warning') || showType('danger')"
          class="material-icons"
          >warning_outline</i
        >
      </aside>
      <div v-if="title || message" class="notification__message-container">
        <h1 v-if="title" class="notification__title" v-text="title" />
        <div
          v-if="message"
          v-sanitize-html="message"
          class="notification__message"
        />
        <div v-if="redirect?.url" class="notification__redirect">
          <a :href="redirect.url" :target="target">
            {{ redirect.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SanitizeHtml from '../directives/v-sanitize-html'
import eventEventBus from '../lib/createEventBus'
import Spinner from './Spinner.vue'

export default {
  name: 'NotificationTypes',
  directives: {
    SanitizeHtml
  },
  components: {
    Spinner
  },
  // inject: ['i18n'],
  props: {
    type: {
      type: String,
      default: 'default'
    },
    colorSpinner: {
      type: String,
      default: 'black'
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    redirect: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    target() {
      return this.redirect?.opens_in_new_tab ? '_blank' : '_self'
    }
  },
  methods: {
    showType(type) {
      return this.type === type
    }
  },
  // LifeCycle Hooks
  beforeCreate() {
    const {
      $on: $$on,
      $off: $$off,
      $emit: $$emit,
      $destroy: $$destroy
    } = eventEventBus()
    Object.assign(this, {
      $$on,
      $$off,
      $$emit,
      $$destroy
    })
  }
}
</script>
