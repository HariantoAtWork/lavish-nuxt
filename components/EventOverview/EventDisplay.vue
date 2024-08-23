<script>
import BaseCheckbox from '@components/BaseCheckbox.vue'
import BaseInputField from '@components/BaseInputField.vue'
import ProductOverview from '@components/ProductOverview/ProductOverview.vue'
import TodoOverview from '@components/TodoOverview/TodoOverview.vue'
import settingsMixin from '@mixins/settings.mixin'
import vuetify from '@plugins/vuetify'
import eventsStore from '@store/events'
import { v4 as uuidv4 } from 'uuid'
import { createApp } from 'vue'
import draggable from 'vuedraggable'

const components = {
  ProductOverview,
  TodoOverview
}
export default {
  name: 'Events',
  inject: ['i18n', 'nc'],
  mixins: [settingsMixin()],
  components: {
    ...components,
    BaseCheckbox,
    BaseInputField,
    draggable
  },
  props: {
    event: {
      type: Object,
      default: {},
      required: true
    }
  },
  data: () => ({
    drag: false,
    formData: {
      eventName: '',
      productName: ''
    },
    flushQueue: []
  }),
  computed: {
    headers() {
      return this.computed.headers()
    },
    components: () => Object.keys(components)
  },

  methods: {
    addEvent() {
      const {
        methods,
        formData,
        formData: { eventName: name },
        $emit
      } = this
      console.log('addEvent', { name })
      console.log({ methods })
      // methods.addItem({ name })
      $emit('addItem', { name })
      formData.eventName = ''
    },
    addApp(item, component, data = {}) {
      console.log('addApp', { item, component })
      console.log('isArray', Array.isArray(item.apps))
      const { apps } = item
      const components = {
        get defaults() {
          return {
            uuid: uuidv4(),
            component,
            app: {
              ...(Object.keys(data).length ? { state: data } : undefined)
            }
          }
        },
        get ProductOverview() {
          return this.defaults
        },
        get TodoOverview() {
          return this.defaults
        }
      }
      if (
        components.hasOwnProperty(component) &&
        this.components.includes(component)
      )
        apps.push(components[component])
    },
    removeNotification(notification) {
      return this.removeNotificationByUuid(notification.uuid)
    },
    removeNotificationByUuid(uuid) {
      const { flushQueue: notifications } = this
      const foundIndex = notifications.findIndex(
        notification => notification.uuid === uuid
      )
      if (foundIndex > -1) return notifications.splice(foundIndex, 1)
    },
    removeAppByUuid(uuid) {
      const { apps } = this.event
      const foundIndex = apps.findIndex(item => item.uuid === uuid)
      if (foundIndex > -1) apps.splice(foundIndex, 1)
    },
    // Events
    onDeleteApp({ uuid }) {
      // console.log({ appItem })
      // console.log(this.event.apps)
      this.removeAppByUuid(uuid)
    },
    onSelectEvent(event) {
      // console.log(arguments)
      Object.assign(this, { event })
    },
    onCloseEvent() {
      this.$emit('close-event')
    },
    onDeleteEvent(item) {
      return eventsStore.deleteEvent(item).then(() => {
        if (this.event.uuid === item.uuid) this.onCloseEvent()
        this.nc.addNotification({
          title: 'Database: Events',
          message: `deleted: ${item.uuid}`,
          position: 'bottomLeft'
        })
      })
    },
    onAddApp(component) {
      if (!this.components.includes(component)) return
      console.log(`onAddApp:${component}`)
      const template = document.createElement('template')
      const app = createApp({
        data: () => ({
          name: ''
        }),
        methods: {
          onAdd: () => {
            const { event, addApp } = this
            console.log(typeof addApp === 'function', { name: vm.name })
            addApp(event, component, { name: vm.name })
            n.destroy()
          },
          onClose: () => {
            n.destroy()
          }
        },
        template: `<div class="flex">
          <v-text-field ref="field" v-model="name" label="Name" @keypress.enter="onAdd" @keydown.esc="onClose">
            <template v-slot:append>
              <v-btn class="button" @click="onAdd">Add</v-btn>
            </template>
          </v-text-field>
        </div>`,
        beforeMount() {
          this.$nextTick(() => {
            const field = this.$refs.field.$el
            const input = field.querySelector(
              'input:not([type=hidden]),textarea:not([type=hidden])'
            )
            if (input) {
              setTimeout(input.focus.bind(input), 0)
            }
          })
        }
      })
      app.use(vuetify)
      const vm = app.mount(template)

      const titles = {
        ProductOverview: {
          title: 'Add Product Overview'
        },
        TodoOverview: {
          title: 'Add Todo Overview'
        }
      }

      const n = this.nc.addNotification({
        elements: [vm.$el],
        title: titles[component].title,
        position: 'bottomLeft',
        options: {
          showCloseButton: true,
          timeDuration: null,
          elementClass: 'focused'
        }
      })
      n.$on('destroy', ({ notification }) => {
        this.removeNotification(notification)
      })
      this.onFlushQueue()
      this.flushQueue.push(n)
    },
    onFlushQueue() {
      this.flushQueue.forEach(n => n.destroy())
    },
    // LifeCycle Hooks
    beforeUnmount() {
      this.onFlushQueue()
    }
  }
}
</script>

<template>
  <section class="events-overview" v-if="Object.keys(event).length">
    <!-- Header -->
    <header class="events-overview-header p-3 flex">
      <v-text-field
        class="font-bold header-text-field"
        variant="underlined"
        v-if="settings.editMode"
        v-model="event.name"
        hide-details
        :label="$__(`EventOverview.eventName`, 'Event name')"
      />
      <h2 v-else class="flex-1" v-text="event.name" />

      <button @click="onCloseEvent">
        <i class="fa-duotone fa-xmark"></i>
      </button>
    </header>

    <!-- Body -->
    <draggable
      class="events-overview-body"
      v-model="event.apps"
      v-bind="{
        sort: settings.editMode,
        tag: 'section',
        group: 'apps',
        handle: '.drag-btn'
      }"
      @start="drag = true"
      @end="drag = false"
      item-key="uuid"
    >
      <template #item="{ element: appItem }">
        <template v-if="components.includes(appItem.component)">
          <article class="relative">
            <div
              class="drag-btn top-0 left-0 right-0 width-[100%]"
              :class="{ 'drag-btn--disabled': !settings.editMode }"
              :title="$__(`Events.dragMe`, 'Drag me')"
            ></div>
            <component
              :is="appItem.component"
              v-bind="{ app: appItem.app }"
              @on-delete-app="onDeleteApp(appItem)"
              :key="appItem.uuid"
            />
            <!-- <pre v-text="appItem" /> -->
          </article>
        </template>
      </template>
    </draggable>

    <!-- Panel -->
    <footer
      v-if="settings.editMode"
      class="panel relative inline-flex mt-3 mb-3 pl-3 pr-1"
    >
      <header class="panel-button inline-flex">
        <v-btn style="width: 40px; height: 40px">
          <i class="fa-duotone fa-plus-large"></i>
        </v-btn>
      </header>
      <div
        class="panel-drawer drawer absolute bottom-0 left-[100%] flex flex-col"
      >
        <!-- Product Overview -->
        <v-btn @click="onAddApp('ProductOverview')" class="mt-1">
          <i class="fa-duotone fa-plus"></i>&nbsp;<strong
            >Product Overview</strong
          >
        </v-btn>
        <!-- Todo Overview -->
        <v-btn @click="onAddApp('TodoOverview')" class="mt-1">
          <i class="fa-duotone fa-plus"></i>&nbsp;<strong>Todo Overview</strong>
        </v-btn>
      </div>
    </footer>
  </section>
</template>

<style lang="scss">
.header-text-field {
  input {
    font-size: 1.5rem;
  }
}
</style>
<style scoped lang="scss">
$coll1: 80px;
$coll2: 100px;

.drag-btn {
  // left: -15px;
  // width: 1px;
  background-color: rgb(41, 41, 164);
  border: 7px solid rgba(0, 0, 0, 0.2);
  cursor: -webkit-grabbing;
  cursor: grabbing;
  &--disabled {
    border-width: 0px;
  }
}

.events-overview {
  &-header {
    background-color: orange;
    color: rgb(110, 72, 0);
  }
}

.panel {
  &:not(:hover) .panel-drawer {
    display: none;
  }
  &-button {
  }
  &-drawer {
  }
}

.aside {
  padding: 4px;
  ul {
    list-style: none;
    padding-left: unset;
    > li {
      &:hover {
        cursor: pointer;
        // background-blend-mode: color-burn;
        background-color: rgba(0, 0, 0, 0.709);
      }
      &:focus {
        background-color: rgba(255, 105, 180, 0.612);
      }
      &.active {
        background-color: orange;
        color: rgb(110, 72, 0);
      }
    }
  }
}
</style>
