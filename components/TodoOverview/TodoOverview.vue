<script>
import { createTodoList, defaults } from '@@/factories/todos'
import languageMixin from '@mixins/language.mixin'
import settingsMixin from '@mixins/settings.mixin'
import { convertLinks } from '@utils/utils.js'
import draggable from 'vuedraggable'

export default {
  inject: ['i18n', 'nc'],
  mixins: [
    languageMixin(import.meta.glob('./locales/*.json'), {
      TodoOverview: {}
    }),
    settingsMixin()
  ],
  components: {
    draggable
  },
  props: {
    app: {
      type: Object,
      required: true
    }
  },
  data: () => ({ drag: false, showDrawer: false }),
  computed: {
    name() {
      return this.state.name
    },
    list() {
      return this.state.list
    },
    headers() {
      return this.computed?.headers()
    }
  },

  methods: {
    selectItems(key) {
      const items = {
        active: Object.values(defaults.activeType).map(value => ({
          title: this.$__(`TodoOverview.${value}`, value),
          value
        }))
      }
      return items[key] ? items[key] : []
    },
    onToggleDrawer() {
      this.showDrawer = !this.showDrawer
    },
    convertLinks
  },
  // LifeCycle Hooks
  beforeMount() {
    console.log('TodoOverview beforeMount')
    const { app } = this,
      todos = createTodoList(app.state),
      { state, methods, computed } = todos

    console.log({ todos })
    // Assign to app
    Object.assign(app, { state })
    // Assign to Vue View
    Object.assign(this, { state, ...methods, computed })
  }
}
</script>

<template>
  <div class="todo-overview">
    <!-- Header -->
    <header class="todo-overview-header">
      <small>Todo Overview</small>
      <div class="flex items-center cursor-pointer" @click="onToggleDrawer">
        <v-text-field
          class="font-bold"
          variant="underlined"
          clearable
          v-if="settings.editMode"
          v-model="app.state.name"
          hide-details
          :label="$__(`TodoOverview.appName`, 'App name')"
        />
        <h1
          v-else-if="app?.state?.name"
          v-text="app.state.name"
          class="product-overview-title flex-1 cursor-pointer"
        />

        <!-- Score -->
        <div v-if="!settings.editMode" class="pl-2 pr-2 flex">
          <span class="mr-2"
            ><i class="fa-duotone fa-pause"></i>
            {{ computed.inactiveList().length }}</span
          >&nbsp;<span class="mr-2"
            ><i class="fa-duotone fa-play"></i>
            {{ computed.processList().length }}</span
          >&nbsp;<span class="mr-2"
            ><i class="fa-duotone fa-forward-step"></i>
            {{ computed.onholdList().length }}</span
          >&nbsp;<span class="mr-2"
            ><i class="fa-duotone fa-flag-checkered"></i>
            {{ computed.doneList().length }}</span
          >
        </div>

        <!-- Show Drawer -->
        <div v-if="!settings.editMode">
          <i v-if="!showDrawer" class="fa-solid fa-caret-left"></i>
          <i v-else class="fa-solid fa-caret-down"></i>
        </div>
        <i
          v-if="settings.editMode"
          @click="$emit('on-delete-app')"
          class="fa-duotone fa-eraser"
        ></i>
      </div>
    </header>

    <!-- Body -->
    <section
      v-show="showDrawer || settings.editMode"
      class="table-container mb-3 relative"
    >
      <div class="table--header">
        <div
          class="header--cell"
          :class="'cell--' + header"
          :title="header"
          v-for="(header, index) in headers"
          :key="index"
        >
          {{ $__(`TodoOverview.${header}`, header) }}
        </div>
      </div>

      <draggable
        v-model="state.list"
        v-bind="{
          group: 'todos',
          handle: '.drag-btn'
        }"
        @start="drag = true"
        @end="drag = false"
        item-key="uuid"
      >
        <template #item="{ element }">
          <div class="table--row relative">
            <div
              class="drag-btn absolute left-0 top-1 bottom-1"
              :title="$__(`TodoOverview.dragMe`, 'Drag me')"
            ></div>
            <div
              class="table--cell"
              :class="'cell--' + header"
              v-for="(header, index) in headers"
              :key="index"
            >
              <!-- Edit TRUE -->
              <template v-if="settings.editMode">
                <v-select
                  v-if="['active'].includes(header)"
                  v-model="element[header]"
                  :label="$__(`TodoOverview.${header}`, header)"
                  :items="selectItems(header)"
                  variant="underlined"
                  item-title="title"
                  item-value="value"
                  hide-details
                ></v-select>
                <v-switch
                  v-else-if="typeof element[header] === 'boolean'"
                  v-model="element[header]"
                  :title="$__(`TodoOverview.${header}`, header)"
                  variant="underlined"
                  color="success"
                  inset
                  hide-details
                ></v-switch>
                <v-textarea
                  v-else-if="['subject'].includes(header)"
                  v-model="element[header]"
                  :label="$__(`TodoOverview.${header}`, header)"
                  variant="underlined"
                  clearable
                  hide-details
                  auto-grow
                  rows="1"
                />
                <v-text-field
                  v-else
                  v-model="element[header]"
                  :label="$__(`TodoOverview.${header}`, header)"
                  variant="underlined"
                  hide-details
                />
              </template>
              <!-- Edit FALSE -->
              <template v-else>
                <v-switch
                  class="v-switch"
                  v-if="typeof element[header] === 'boolean'"
                  v-model="element[header]"
                  :title="$__(`TodoOverview.${header}`, header)"
                  color="success"
                  hide-details
                  min-height="0"
                ></v-switch>
                <pre
                  class="text pt-2 pb-2"
                  v-else-if="element[header]"
                  v-html="
                    ['active'].includes(header)
                      ? $__(`TodoOverview.${element[header]}`, element[header])
                      : convertLinks(element[header])
                  "
                />
              </template>
            </div>
            <div
              class="close-btn absolute right-0 top-1 bottom-1"
              :title="$__(`TodoOverview.close`, 'Close')"
              @click="removeItemByUuid(element.uuid)"
            >
              <i class="fa-duotone fa-trash"></i>
            </div>
          </div>
        </template>
      </draggable>
    </section>

    <!-- Footer -->
    <footer v-if="settings.editMode">
      <v-btn
        @enter="addItem"
        @click="addItem"
        v-text="$__('TodoOverview.add', 'Add')"
      />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
$coll1: 180px;
$coll2: 150px;
$coll3: 250px;
$coll4: 150px;
.todo-overview {
  // background-color: rgb(24, 24, 24);
  border-bottom: 1px solid black;
  padding: 16px;
  background-color: white;

  &-header {
    margin: -8px -8px 0 -8px;
    padding: 8px;
    color: rgb(41, 41, 164);
    background-color: rgb(242, 242, 242);
  }
}

.table-container {
  display: grid;
  grid-template-rows: auto 1fr;
  // width: 100vw;
  padding: 4px;
}

.table--header {
  display: grid;
  grid-template-columns: $coll1 repeat(auto-fit, minmax(40px, 1fr));
  border-bottom: 1px solid #ccc;
}

.header--cell {
  padding: 4px;
  text-align: left;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  /* Added to prevent text overflowing the table header */
}

.table--row {
  display: grid;
  grid-template-columns: $coll1 repeat(auto-fit, minmax(40px, 1fr));
  border-bottom: 1px dashed #0000002d;
}

.table--cell {
  padding: 4px;
  word-break: break-word;
  /* Added to prevent text overlapping */
}

.drag-btn {
  left: -15px;
  width: 1px;
  background-color: pink;
  border: 7px solid rgba(0, 0, 0, 0.2);
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
.close-btn {
  right: 0px;
  width: 1px;
  // background-color: pink;
  // border: 7px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.u-list {
  list-style: none;
  padding-left: unset;
}
pre.text {
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
