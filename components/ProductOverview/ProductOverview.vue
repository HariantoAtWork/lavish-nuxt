<script>
import BaseCheckbox from '@components/BaseCheckbox.vue'
import BaseInputField from '@components/BaseInputField.vue'
import BaseTextarea from '@components/BaseTextarea.vue'
import { createProductList, defaults, evaluate } from '@factories/products'
import makeHtml from '@lib/config/makeHtml'
import languageMixin from '@mixins/language.mixin'
import settingsMixin from '@mixins/settings.mixin'
import { convertLinks } from '@utils/utils.js'
import draggable from 'vuedraggable'

export default {
  inject: ['i18n', 'nc'],
  mixins: [
    languageMixin(import.meta.glob('./locales/*.json'), {
      ProductOverview: {}
    }),
    settingsMixin()
  ],
  components: {
    BaseCheckbox,
    BaseInputField,
    BaseTextarea,
    draggable
  },
  props: {
    app: Object
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
    },
    activeTotalValue() {
      return this.computed?.activeTotalValue()
    },
    activePaidValue() {
      return this.computed?.activePaidValue()
    },
    activeNeedToPay() {
      return this.computed?.activeNeedToPay()
    }
  },
  watch: {
    list: {
      handler(newValue, oldValue) {
        console.log('length', newValue.length, oldValue.length)
        // this.nc.addNotification({
        //   position: 'topRight',
        //   message: newValue.length
        // })
      },
      deep: true
    }
  },
  // Methods
  methods: {
    hasMathExpression(text) {
      const hasMathExpression =
        /^[\s]*[0-9]+(?:\.[0-9]+)?[\+\-\*\/]?[\s]*[0-9]+(?:\.[0-9]+)?(?:\s|$)/.test(
          text
        )
      return hasMathExpression
    },
    selectItems(key) {
      const items = {
        paid: Object.values(defaults.paidType).map(value => ({
          title: this.$__(`ProductOverview.${value}`, value),
          value
        }))
      }
      return items[key] ? items[key] : []
    },
    convertLinks,
    evaluate,
    reEvaluate(value) {
      try {
        return evaluate(value).toFixed(2)
      } catch (e) {
        return '#error'
      }
    },
    makeHtml,
    // Event Listeners
    onToggleDrawer() {
      this.showDrawer = !this.showDrawer
    }
  },
  // LifeCycle Hooks
  beforeCreate() {
    const { app } = this,
      products = createProductList(app.state),
      { state, methods, computed } = products
    // Assign to app
    Object.assign(app, { state })
    // Assign to Vue View
    Object.assign(this, { state, ...methods, computed })
  }
}
</script>

<template>
  <div class="product-overview">
    <header class="product-overview-header">
      <small>Product Overview</small>
      <div class="flex items-center cursor-pointer" @click="onToggleDrawer">
        <v-text-field
          class="font-bold"
          variant="underlined"
          clearable
          v-if="settings.editMode"
          v-model="app.state.name"
          hide-details
          :label="$__(`ProductOverview.appName`, 'App name')"
        />
        <h1
          v-else-if="app?.state?.name"
          v-text="app.state.name"
          class="product-overview-title flex-1 cursor-pointer"
        />

        <span v-if="!settings.editMode && !showDrawer" class="pl-2 pr-2"
          >{{ `${activePaidValue} / ${activeTotalValue}` }}
        </span>
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

    <!-- Value info -->
    <div v-show="showDrawer || settings.editMode" class="value-info pt-2 pb-2">
      <p>
        <strong>
          {{ $__(`ProductOverview.activeTotalValue`, 'Total Value') }}
          {{ activeTotalValue }}
        </strong>
      </p>
      <p>
        <span class="alreadyPaid"
          >{{ $__(`ProductOverview.alreadyPaid`, 'Already paid') }}
          {{ activePaidValue }}</span
        >&nbsp;-&nbsp;<span class="needToPay"
          >{{ $__(`ProductOverview.needToPay`, 'Amount left to pay') }}
          {{ activeNeedToPay }}</span
        >
      </p>
    </div>
    <!-- Table -->
    <section
      v-show="showDrawer || settings.editMode"
      class="table-container relative"
    >
      <div
        class="table--header sticky z-[1] grid"
        :class="{ 'edit-mode': settings.editMode }"
      >
        <div
          class="header--cell"
          :class="[`cell--${header}`, `cell--${index}`]"
          :title="header"
          v-for="(header, index) in headers"
          :key="index"
        >
          {{ $__(`ProductOverview.${header}`, header) }}
        </div>
      </div>

      <draggable
        v-model="state.list"
        v-bind="{
          sort: settings.editMode,
          group: 'products',
          handle: '.drag-btn'
        }"
        @start="drag = true"
        @end="drag = false"
        item-key="uuid"
      >
        <template #item="{ element }">
          <div
            class="table--row relative grid"
            :class="{ 'edit-mode': settings.editMode }"
          >
            <div
              class="drag-btn absolute left-0 top-1 bottom-1"
              :class="{ 'drag-btn--disabled': !settings.editMode }"
              :title="$__(`ProductOverview.dragMe`, 'Drag me')"
            ></div>
            <div
              class="table--cell"
              :class="[`cell--${header}`, `cell--${index}`]"
              v-for="(header, index) in headers"
              :key="index"
            >
              <!-- Edit TRUE -->
              <template v-if="settings.editMode">
                <v-select
                  v-if="['paid'].includes(header)"
                  v-model="element[header]"
                  :label="$__(`ProductOverview.${header}`, header)"
                  :items="selectItems(header)"
                  variant="underlined"
                  item-title="title"
                  item-value="value"
                  hide-details
                ></v-select>
                <v-switch
                  v-else-if="typeof element[header] === 'boolean'"
                  v-model="element[header]"
                  :title="$__(`ProductOverview.${header}`, header)"
                  variant="underlined"
                  color="success"
                  inset
                  hide-details
                ></v-switch>
                <v-textarea
                  v-else-if="['description'].includes(header)"
                  v-model="element[header]"
                  :label="$__(`ProductOverview.${header}`, header)"
                  variant="underlined"
                  clearable
                  hide-details
                  auto-grow
                  rows="1"
                />
                <v-text-field
                  v-else
                  v-model="element[header]"
                  :label="$__(`ProductOverview.${header}`, header)"
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
                  :title="$__(`ProductOverview.${header}`, header)"
                  color="success"
                  hide-details
                  min-height="0"
                ></v-switch>
                <pre
                  class="text pt-2 pb-2"
                  v-else-if="element[header]"
                  v-html="
                    ['paid'].includes(header)
                      ? $__(
                          `ProductOverview.${element[header]}`,
                          element[header]
                        )
                      : ['value'].includes(header)
                      ? reEvaluate(element[header])
                      : makeHtml(element[header])
                  "
                />
              </template>
            </div>
            <div
              class="close-btn absolute right-0 top-1 bottom-1"
              v-if="settings.editMode"
              :title="$__(`ProductOverview.close`, 'Close')"
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
        v-text="$__('ProductOverview.add', 'Add')"
      />
    </footer>

    <!-- <pre v-text="list" /> -->
  </div>
</template>
<style lang="scss">
.v-switch .v-selection-control {
  min-height: unset;
}
</style>
<style scoped lang="scss">
.product-overview {
  // background-color: rgb(24, 24, 24);
  border-bottom: 1px solid black;
  padding: 16px;
  // margin-bottom: 10px;
  background-color: white;

  &-header {
    margin: -8px -8px 0 -8px;
    padding: 8px;
    color: rgb(41, 41, 164);
    background-color: rgb(242, 242, 242);
  }
}
$coll0: 80px;
$coll1: 150px;
$coll2: 250px;
$coll3: 150px;

.table-container {
  display: grid;
  grid-template-rows: auto 1fr;
  // width: 100vw;
  padding: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.table--header {
  // display: grid;
  grid-template-columns: $coll0 $coll1 $coll2 $coll3 1fr;
  border-bottom: 1px solid #ccc;
  background-color: white;
  top: 0px;
  @include media-breakpoint-up(lg) {
    top: 0;
  }

  &:not(.edit-mode) {
    .cell {
      &--value {
        text-align: right;
      }
    }
  }
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
  // display: grid;
  grid-template-columns: $coll0 $coll1 $coll2 $coll3 1fr;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.2);

  &:not(.edit-mode) {
    .cell {
      &--value {
        text-align: right;
      }

      &--name,
      &--description {
        color: lighten($color-russian-violet, 20%);
      }
    }
  }

  .cell {
    &--0 {
      display: flex;
      justify-self: center;
      align-items: baseline;
    }
    &--name {
      font-weight: bold;
      * {
        font-weight: inherit;
      }
    }
  }
}

.table--cell {
  padding: 4px;
  // border-bottom: 1px solid #414141;
  word-break: break-word;
  /* Added to prevent text overlapping */
}

// Note: Dynamic css modifiers
@media (max-width: 639px) {
  .table--header,
  .table--row {
    // display: grid;
    &:not(.edit-mode) {
      grid-template-columns: 60px 80px 1fr;
    }
    &.edit-mode {
      grid-template-columns: 80px 1fr 1fr;
    }
  }
  .table--header {
    display: none;
  }
  .table--row {
    &:not(.edit-mode) {
      .table--cell {
        padding: 1px;
      }
      .cell {
        &--0 {
          // active
          order: 1;
          grid-column: 1;
          display: flex;
          justify-self: center;
        }
        &--1 {
          // paid
          order: 2;
          grid-column: 2;
        }
        &--2 {
          // name
          order: 4;
          grid-column: 2 / span 3;
        }
        &--3 {
          // value
          order: 3;
          grid-column: 3;
          text-align: right;
        }
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 3;
          > * {
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    &.edit-mode {
      padding: 4px;
      .table--cell {
        padding: 4px;
      }
      .cell {
        &--0 {
          // active
          order: 1;
          grid-column: 1;
          display: flex;
          justify-self: center;
        }
        &--1 {
          // paid
          order: 2;
          grid-column: 2;
        }
        &--2 {
          // name
          order: 4;
          grid-column: 2 / span 3;
        }
        &--3 {
          // value
          order: 3;
          grid-column: 3;
          text-align: right;
        }
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 3;
        }
      }
    }
  }
}

// Mixin: Grid Responsive
@mixin grid-responsive() {
  .table--header,
  .table--row {
    // display: grid;
    grid-template-columns: $coll0 $coll1 $coll2 1fr;
    &:not(.edit-mode) {
      // grid-template-columns: 60px 80px 1fr;
    }
    &.edit-mode {
      // grid-template-columns: 80px 1fr 1fr;
    }
  }
  .table--header {
    // grid-template-columns: $coll0 $coll1 $coll2 1fr;

    &:not(.edit-mode) {
      .cell {
        &--0 {
          display: flex;
          justify-self: center;
        }
        &--value {
          text-align: right;
        }
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 4;
          display: none;
        }
      }
    }
    &.edit-mode {
      .cell {
        &--0 {
          display: flex;
          justify-self: center;
        }
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 4;
          display: none;
        }
      }
    }
  }
  .table--row {
    // grid-template-columns: $coll0 $coll1 $coll2 1fr;
    &:not(.edit-mode) {
      .cell {
        &--0 {
          display: flex;
          justify-self: center;
        }
        &--value {
          text-align: right;
        }
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 4;
          > * {
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    &.edit-mode {
      .cell {
        &--4 {
          // description
          order: 5;
          grid-column: 2 / span 4;
        }
      }
    }
  }
}
// Include: Grid Responsive
@media (min-width: 640px) and (max-width: 900px) {
  @include grid-responsive();
}
@media (min-width: 992px) and (max-width: 1202px) {
  @include grid-responsive();
}

.drag-btn {
  left: -15px;
  width: 1px;
  background-color: pink;
  border: 7px solid rgba(0, 0, 0, 0.2);
  cursor: -webkit-grabbing;
  cursor: grabbing;

  &--disabled {
    width: 0;
    border-width: 0;
    cursor: unset;
  }
}
.close-btn {
  right: 0px;
  width: 1px;
  // background-color: pink;
  // border: 7px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
// textarea,
// input {
//   padding: 4px;
// }

.alreadyPaid {
  color: rgb(40, 147, 40);
}

.needToPay {
  color: rgb(183, 0, 0);
}

pre.text {
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  word-wrap: break-word;
  white-space: wrap;
}
</style>
