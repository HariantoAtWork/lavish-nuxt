<script>
import appStore from '@store/app'

export default {
  data: () => ({
    isExpanded: false
  }),
  computed: {
    settings() {
      return appStore.state.settings
    }
  },
  methods: {
    onToggleExpanded() {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<template>
  <div class="base-layout relative">
    <aside
      class="base-layout-aside z-[10] flex flex-col"
      :class="{
        'is-expanded': isExpanded
      }"
    >
      <div
        class="header header--aside sticky top-[0px] z-[1] flex items-center"
      >
        <v-switch
          class="flex-1 p-2"
          v-model="settings.editMode"
          :label="$__(`BaseLayout.editMode`, 'Edit Mode')"
          color="success"
          hide-details
        ></v-switch>
        <i
          @click="onToggleExpanded"
          class="toggle-expander fa-duotone fa-bars p-2"
        ></i>
      </div>
      <slot name="aside" class="flex-1" />
    </aside>
    <main class="base-layout-main flex-1 flex flex-col relative">
      <div
        class="header header--main sticky top-[0px] z-[2] flex justify-start items-center"
      >
        <i
          @click="onToggleExpanded"
          class="toggle-expander fa-duotone fa-bars p-2"
        ></i>
      </div>
      <header class="base-layout-header"><slot name="header" /></header>

      <div class="flex-1 overflow-x-hidden overflow-y-auto"><slot /></div>

      <footer class="base-layout-footer"><slot name="footer" /></footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.header {
  background-color: darken($color-russian-violet, 10%);
  height: 40px;

  &--aside {
  }
  &--main {
  }

  @include media-breakpoint-up(lg) {
    &--aside {
      .toggle-expander {
        display: none;
      }
    }
    &--main {
      display: none;
    }
  }
}
.base-layout {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  @include media-breakpoint-up(lg) {
  }

  &-aside {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // z-index: 2;
    width: 300px;
    background-color: $color-bg;
    border-right: 4px solid darken($color-russian-violet, 10%);

    &:not(.is-expanded) {
      transform: translateX(-100%);
    }
    &.is-expanded {
      &::before {
        z-index: -10;
        content: '';
        display: block;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        // background-color: rgba(255, 255, 255, 0.8); /* Opacity set to 80% */
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px); /* Blur radius of 8 pixels */
      }
    }

    @include media-breakpoint-up(lg) {
      position: unset;
      &:not(.is-expanded) {
        transform: unset;
      }

      &.is-expanded {
        &::before {
          display: none;
        }
      }
    }
  }

  &-main {
  }
  &-header,
  &-footer {
    &:empty {
      display: none;
    }
  }
}
</style>
