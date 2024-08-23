<template>
  <div
    class="alert-center modal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
    @click.self="onCloseSelf"
  >
    <header />
    <transition-group
      name="fade-list"
      tag="div"
      class="notification-center__notification-list notification-center__notification-list--top u-events--none"
    >
      <Notification
        v-for="notification in alertNotification"
        :key="notification.uuid"
        class="fade-list-item notification-center__notification u-events--all mx-auto"
        :notification="notification"
      />
    </transition-group>
  </div>
</template>

<script>
import Notification from './Notification.vue'

import notificationCenter from '../notificationCenter'
const { state } = notificationCenter

export default {
  name: 'AlertCenter',
  components: {
    Notification
  },
  computed: {
    notifications: () => state.notifications,
    showNotifications() {
      return this.notifications.filter(
        notification => notification.options?.show
      )
    },
    alertNotification() {
      return this.showNotifications.filter(
        notification => notification.meta?.displayOnAlertCenterOnly
      )
    }
  },
  watch: {
    alertNotification(value, oldValue) {
      if (value.length > oldValue.length) {
        $(this.$el).modal('show')
      } else if (!value.length) {
        this.onCloseSelf()
      }
    }
  },
  methods: {
    onCloseSelf() {
      $(this.$el).modal('hide')
    }
  }
}
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
    position: absolute;
  }

  &-item {
    transition: all 0.2s;
  }
}

.notification-center__notification-list--top {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: center;
  left: 40px;
  right: 40px;
}

.notification-center__notification {
  max-width: 600px;
  width: 100%;
}
</style>
