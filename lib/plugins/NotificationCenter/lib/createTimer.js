// Factory: createTimer
const createTimer = function (data) {
  const state = {
    active: false, // cFlag
    timeoutID: null,
    timeStart: new Date(),
    timeDuration: null,
    timeDiff: null,
    percent: 0,
    ...data
  }

  const methods = {
    timerPercent() {
      const now = new Date()
      const timeDiff = now.getTime() - state.timeStart.getTime()
      state.timeDiff = timeDiff
      const percent = (timeDiff / state.timeDuration) * 100
      if (percent <= 100) {
        state.percent = percent
        state.timeoutID = setTimeout(methods.timerPercent, 1)
      } else {
        methods.onEndTimer()
      }
      return percent
    },
    startTimer() {
      if (!state.active) {
        methods.timerPercent()
        state.active = true
        methods.onStartTimer()
      }
    },
    stopTimer() {
      state.active = false
      clearTimeout(state.timeoutID)
    },
    // Events
    onStartTimer() {
      const hasOnStartTimer = Object.prototype.hasOwnProperty.call(
        data,
        'onStartTimer'
      )
      if (hasOnStartTimer) data.onStartTimer()
    },
    onEndTimer() {
      methods.stopTimer()
      const hasOnEndTimer = Object.prototype.hasOwnProperty.call(
        data,
        'onEndTimer'
      )
      if (hasOnEndTimer) data.onEndTimer()
    }
  }

  return methods
}

export default createTimer
