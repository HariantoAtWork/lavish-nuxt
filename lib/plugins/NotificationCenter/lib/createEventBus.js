// Factory: createEventBus
const createEventBus = function () {
  const state = {
    listeners: {}
  }

  const methods = {
    $on(eventType, callback) {
      if (!Array.isArray(state.listeners[eventType])) {
        state.listeners[eventType] = []
      }
      if (state.listeners[eventType].indexOf(callback) === -1)
        state.listeners[eventType].push(callback)
    },
    $off(eventType, callback) {
      if (Array.isArray(state.listeners[eventType])) {
        const index = state.listeners[eventType].indexOf(callback)
        if (index !== -1) state.listeners[eventType].splice(index, 1)
      }
    },
    $emit(eventType, data) {
      if (Array.isArray(state.listeners[eventType]))
        state.listeners[eventType].forEach(cb => cb(data))
    },
    $destroy() {
      state.listeners = {}
    }
  }

  return methods
}

// Class: EventBus
const EventBus = function () {
  Object.assign(this, createEventBus())
}

export default createEventBus
export { EventBus }
