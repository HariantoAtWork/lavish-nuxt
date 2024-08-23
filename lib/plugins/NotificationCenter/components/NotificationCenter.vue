<template>
  <div
    v-detect-mobile-view="setMobileView"
    class="notification-center u-events--none"
  >
    <template v-if="isMobile">
      <!-- top: mobile default -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--top"
      >
        <Notification
          v-for="notification in showNotifications"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :class="{ notification__slim: isMobile }"
          :notification="notification"
        />
      </transition-group>
    </template>
    <template v-else>
      <!-- top-left -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--top-left"
      >
        <Notification
          v-for="notification in topLeftNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>
      <!-- top-center -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--top-center"
      >
        <Notification
          v-for="notification in topCenterNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>
      <!-- top-right -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--top-right"
      >
        <Notification
          v-for="notification in topRightNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>

      <!-- bottom-left -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--bottom-left"
      >
        <Notification
          v-for="notification in bottomLeftNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>
      <!-- bottom-center -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--bottom-center"
      >
        <Notification
          v-for="notification in bottomCenterNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>
      <!-- bottom-right -->
      <transition-group
        name="fade-list"
        tag="div"
        class="notification-center__notification-list notification-center__notification-list--bottom-right"
      >
        <Notification
          v-for="notification in bottomRightNotification"
          :key="notification.uuid"
          class="fade-list-item notification-center__notification u-events--all"
          :notification="notification"
        />
      </transition-group>
    </template>
  </div>
</template>

<script>
import Notification from './Notification.vue'

import vDetectMobileView from '../directives/v-detect-mobile-view'
import notificationCenter from '../notificationCenter'

const {
  state: { notifications },
  methods: { addNotification },
  defaults: { notificationPosition }
} = notificationCenter

export default {
  name: 'NotificationCenter',
  directives: {
    detectMobileView: vDetectMobileView
  },
  components: {
    Notification
  },
  data: () => ({
    isMobile: false,
    notifications
  }),
  computed: {
    showNotifications() {
      return this.notifications.filter(
        notification =>
          notification.options?.show &&
          !notification.meta?.displayOnAlertCenterOnly
      )
    },
    topNotification() {
      const positions = [
        notificationPosition.TOPLEFT,
        notificationPosition.TOPCENTER,
        notificationPosition.TOPRIGHT
      ]
      return this.showNotifications
        .slice()
        .reverse()
        .filter(notification => positions.includes(notification.position))
    },
    topLeftNotification() {
      return this.topNotification.filter(
        notification => notification.position === notificationPosition.TOPLEFT
      )
    },
    topCenterNotification() {
      return this.topNotification.filter(
        notification => notification.position === notificationPosition.TOPCENTER
      )
    },
    topRightNotification() {
      return this.topNotification.filter(
        notification => notification.position === notificationPosition.TOPRIGHT
      )
    },
    bottomNotification() {
      const positions = [
        notificationPosition.BOTTOMLEFT,
        notificationPosition.BOTTOMCENTER,
        notificationPosition.BOTTOMRIGHT
      ]
      return this.showNotifications.filter(notification =>
        positions.includes(notification.position)
      )
    },
    bottomLeftNotification() {
      return this.bottomNotification.filter(
        notification =>
          notification.position === notificationPosition.BOTTOMLEFT
      )
    },
    bottomCenterNotification() {
      return this.bottomNotification.filter(
        notification =>
          notification.position === notificationPosition.BOTTOMCENTER
      )
    },
    bottomRightNotification() {
      return this.bottomNotification.filter(
        notification =>
          notification.position === notificationPosition.BOTTOMRIGHT
      )
    }
  },
  // Vue LifeCycle Hooks
  methods: {
    addNotification,
    setMobileView(bool) {
      this.isMobile = bool
    }
  }
}

export { addNotification }
</script>

<style scoped lang="scss">
.u-events {
  &--none {
    pointer-events: none;
  }
  &--all {
    pointer-events: all;
  }
}

.fade-list {
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-leave-active {
    &:not(:only-child) {
      position: absolute;
    }
  }

  &-item {
    transition: all 0.2s;
  }
}
</style>
