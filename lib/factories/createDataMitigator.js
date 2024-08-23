/**
 * Factory: Creates DataMitigator object
 *
 * Some kind of debounce implementation. It's a guard that stops new incomming
 * data and put them in the queue for some time, then he sends everything to the
 * callback.
 *
 * @param  {Function} callback Callback that supports multiple arguments (Symbol.iterator) like Array.prototype.push
 * @param  {Object}   options  Can set duration for waiting time
 * @return {Object}            Returns an Object with states and methods
 */
const createDataMitigator = (callback, options = {}) => {
  if (typeof callback !== 'function') {
    console.warn('callback must be a function')
    return
  }

  const config = {
    duration: 1000,
    ...options
  }

  const state = {
    hold: false,
    list: [],
    timeoutId: null
  }

  const methods = {
    push: (...rest) => {
      if (!state.hold) {
        callback(...rest)
        Object.assign(state, {
          hold: true,
          timeoutId: setTimeout(methods.onPush, config.duration)
        })
      } else {
        state.list.push(...rest)
      }
    },
    destroy() {
      clearTimeout(state.timeoutId)
    },
    onPush() {
      const { list } = state
      state.hold = false
      if (list.length) methods.push(...list.splice(0, list.length))
    },
    get config() {
      return config
    },
    set config(value = {}) {
      Object.assign(config, value)
    }
  }

  return {
    state,
    ...methods
  }
}
export default createDataMitigator
