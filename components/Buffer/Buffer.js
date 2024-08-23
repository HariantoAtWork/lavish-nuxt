import { reactive } from 'vue'
import { addNotification } from '@/plugins/NotificationCenter'
import Progressbar from './Progressbar.vue'

const createGetRequest = function () {
  const state = reactive({
    reponse: Promise.resolve(),
    loading: true,
    loadedBytes: Number(),
    totalBytes: Number(),
    chunkIndex: Number(),
    chunkLength: Number(),
    abort: false,
    isAborted: false,
    notification: null
  })

  const computed = {
    progress() {
      const { loadedBytes, totalBytes } = state
      return loadedBytes / totalBytes
    }
  }

  const methods = {
    createFileReader({
      self,
      data,
      node,
      onSetData = Function,
      onSetRate = Function,
      onComplete = Function
    }) {
      const BYTE = 1024
      const component = createApp(Progressbar, {
        rate: 0.75
      })

      Object.assign(state, {
        chunkIndex: 0,
        chunkLength: Math.ceil(data.size / BYTE), // Chunk size of 1KB
        get rate() {
          return this.chunkIndex / this.chunkLength
        },
        notification: addNotification({
          // title: 'Buffer',
          elements: [component],
          position: 'topRight',
          options: {
            timeDuration: null
          }
        })
      })

      const { chunkIndex, chunkLength, notification, rate } = state

      const reader = new FileReader()
      reader.onload = event => {
        const {
          target: { result }
        } = event
        // this.chunks.push(result)
        const node = this.$refs['pre']
        node.insertAdjacentHTML('beforeend', result)
        notification.message = `${state.chunkIndex}/${state.chunkLength}`

        if (state.chunkIndex < state.chunkLength) {
          const nextChunk = response.data.slice(
            state.chunkIndex * BYTE,
            (state.chunkIndex + 1) * BYTE
          )
          state.chunkIndex++
          reader.readAsText(nextChunk)
        } else {
          this.loading = false
          notification.destroy()
        }
      }
      return reader
    }
  }

  return {
    state,
    computed,
    ...methods
  }
}
