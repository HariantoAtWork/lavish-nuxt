<template>
  <div class="progressbar">
    <span class="progressbar-inner" :style="{ width: percentage }" />
  </div>
  <pre ref="pre" style="word-wrap: break-word; white-space: pre-wrap" />
</template>

<!--script>
// import { notificationCenter } from '@/plugins/NotificationCenter'
// import axios from 'axios'
// import { createApp } from 'vue'
// const Buffer = require('buffer/').Buffer // note: the trailing slash is important!

export default {
  // inject: ['nc'],
  data: () => ({
    response: Promise.resolve(),
    loading: true,
    chunks: [],
    file: '',
    // text: '',
    controller: {},
    rate: 0
  }),
  computed: {
    text() {
      return this.chunks.length ? this.chunks.join('') : ''
    },
    percentage() {
      return `${this.rate * 100}%`
    }
  },
  // LifeCycle Hooks
  mounted() {
    const BYTE = 1024
    const fetchData = () => {
      this.controller = new AbortController()

      const createFileReader = ({
        self,
        data,
        node,
        onSetData = Function,
        onSetRate = Function,
        onComplete = Function
      }) => {
        const BYTE = 1024
        const state = {
          chunkIndex: 0,
          chunkLength: Math.ceil(data.size / BYTE), // Chunk size of 1KB
          get rate() {
            return this.chunkIndex / this.chunkLength
          }
        }
        // const notification = self.nc.addNotification({
        //   title: 'Buffer',
        //   position: 'topLeft',
        //   options: {
        //     timeDuration: null
        //   }
        // })

        const reader = new FileReader()
        reader.onload = event => {
          const {
            target: { result }
          } = event
          // this.chunks.push(result)
          // const node = this.$refs['pre']
          // this.file += result
          if (typeof onSetData === 'function') onSetData(result)
          if (typeof onSetRate === 'function') onSetRate(state.rate)
          node.insertAdjacentHTML('beforeend', result)
          // notification.message = `${state.chunkIndex}/${state.chunkLength}`
          // this.rate = state.chunkIndex / state.chunkLength
          // console.log('onload:', event.target.result)
          if (state.chunkIndex < state.chunkLength) {
            const nextChunk = data.slice(
              state.chunkIndex * BYTE,
              (state.chunkIndex + 1) * BYTE
            )
            state.chunkIndex++
            reader.readAsText(nextChunk)
          } else {
            // this.loading = false
            if (typeof onComplete === 'function')
              onComplete({ self, data, node })
          }
        }
        return reader
      }

      axios
        .get(
          'https://raw.githubusercontent.com/dscape/spell/master/test/resources/big.txt',
          {
            signal: this.controller.signal,
            responseType: 'blob',
            onUploadProgress: function (axiosProgressEvent) {
              const { bytes, loaded, upload } = axiosProgressEvent
              console.log('UPLOAD:', { upload, bytes, loaded })
              /*{
                loaded: number;
                total?: number;
                progress?: number; // in range [0..1]
                bytes: number; // how many bytes have been transferred since the last trigger (delta)
                estimated?: number; // estimated time in seconds
                rate?: number; // upload speed in bytes
                upload: true; // upload sign
              }*/
            },

            onDownloadProgress: function (axiosProgressEvent) {
              const { bytes, loaded, download } = axiosProgressEvent
              console.log('DOWNLOAD:', { download, bytes, loaded })
              /*{
                loaded: number;
                total?: number;
                progress?: number;
                bytes: number;
                estimated?: number;
                rate?: number; // download speed in bytes
                download: true; // download sign
              }*/
            }
          }
        )
        .then(response => {
          const state = {
            response,
            blobSize: response.data.size,
            chunkIndex: 0,
            chunkLength: Math.ceil(response.data.size / BYTE) // Chunk size of 1KB
          }

          // const vm = {
          //   template: `<div>Hello world</div>`
          // }

          // const component = createApp(Progressbar, {
          //   rate: 0.7
          // })

          // const notification = this.nc.addNotification({
          //   // title: 'Buffer',
          //   elements: [component],
          //   position: 'topRight',
          //   options: {
          //     timeDuration: null,
          //     elementClass: 'notification--progressbar'
          //   }
          // })

          // const reader = new FileReader()
          // reader.onload = event => {
          //   const {
          //     target: { result }
          //   } = event
          //   // this.chunks.push(result)
          //   const node = this.$refs['pre']
          //   // this.file += result
          //   node.insertAdjacentHTML('beforeend', result)
          //   // notification.message = `${state.chunkIndex}/${state.chunkLength}`
          //   // component.rate = 0.7
          //   this.rate = state.chunkIndex / state.chunkLength
          //   // console.log('onload:', event.target.result)
          //   if (state.chunkIndex < state.chunkLength) {
          //     const nextChunk = response.data.slice(
          //       state.chunkIndex * BYTE,
          //       (state.chunkIndex + 1) * BYTE
          //     )
          //     state.chunkIndex++
          //     reader.readAsText(nextChunk)
          //   } else {
          //     this.loading = false
          //     notification.destroy()
          //   }
          // }
          const reader = createFileReader({
            self: this,
            data: response.data,
            node: this.$refs['pre'],
            onSetData() {},
            onSetRate() {},
            onComplete() {
              console.log('COMPLETE')
            }
          })

          reader.readAsText(response.data.slice(0, 0))
          return response
        })
    }

    fetchData().then(response => {
      console.log('finihsed')
    })
  },
  beforeUnmount() {
    console.log('------ beforeUnmount')
    this.controller.abort()
  }
}
</script-->
<script>
import { createProxy } from '@@/factories/createProxy'
import { createApp } from 'vue'
import Progressbar from './Progressbar.vue'
import axios from 'axios'
export default {
  inject: ['nc'],
  data: () => ({
    rate: 0
  }),
  computed: {
    percentage() {
      return `${this.rate * 100}%`
    }
  },
  methods: {
    onDestroy() {
      if (typeof this.reader?.abort === 'function') this.reader.abort()
      if (typeof this.notification?.destroy === 'function')
        this.notification.destroy()
      if (typeof this.controller?.abort === 'function') this.controller.abort()
      console.log('------ destroy')
    }
  },
  // LifeCycle Hooks
  mounted() {
    const {
      nc: { addNotification },
      rate
    } = this

    const BYTE = 1024
    const fetchData = () => {
      this['controller'] = new AbortController()

      const createFileReader = ({
        self,
        data,
        node,
        onSetData = Function,
        onSetRate = Function,
        onComplete = Function
      }) => {
        const BYTE = 1024
        const state = {
          chunkIndex: 0,
          chunkLength: Math.ceil(data.size / BYTE), // Chunk size of 1KB
          get rate() {
            return this.chunkIndex / this.chunkLength
          }
        }
        const proxy = createProxy(Progressbar)
        const notification = addNotification({
          // title: 'Buffer',
          elements: [proxy.$el],
          position: 'topRight',
          options: {
            timeDuration: null,
            elementClass: 'notification--progressbar'
          }
        })

        Object.assign(this, { notification })

        const reader = new FileReader()
        reader.onload = event => {
          const {
            target: { result }
          } = event
          // this.chunks.push(result)
          // const node = this.$refs['pre']
          // this.file += result
          if (typeof onSetData === 'function') onSetData(result)
          if (typeof onSetRate === 'function') onSetRate(state.rate)
          node.insertAdjacentHTML('beforeend', result)
          // notification.message = `${state.chunkIndex}/${state.chunkLength}`
          proxy.updateRate(state.chunkIndex / state.chunkLength)
          // this.rate = state.chunkIndex / state.chunkLength
          // console.log('onload:', event.target.result)
          if (state.chunkIndex < state.chunkLength) {
            const nextChunk = data.slice(
              state.chunkIndex * BYTE,
              (state.chunkIndex + 1) * BYTE
            )
            state.chunkIndex++
            reader.readAsText(nextChunk)
          } else {
            // this.loading = false
            if (typeof onComplete === 'function')
              onComplete({ self, data, node })
          }
        }
        return reader
      }

      axios
        .get(
          'https://raw.githubusercontent.com/dscape/spell/master/test/resources/big.txt',
          {
            signal: this.controller.signal,
            responseType: 'blob',
            onUploadProgress: function (axiosProgressEvent) {
              const { bytes, loaded, upload } = axiosProgressEvent
              console.log('UPLOAD:', { upload, bytes, loaded })
              /*{
                loaded: number;
                total?: number;
                progress?: number; // in range [0..1]
                bytes: number; // how many bytes have been transferred since the last trigger (delta)
                estimated?: number; // estimated time in seconds
                rate?: number; // upload speed in bytes
                upload: true; // upload sign
              }*/
            },

            onDownloadProgress: function (axiosProgressEvent) {
              const { bytes, loaded, download } = axiosProgressEvent
              console.log('DOWNLOAD:', { download, bytes, loaded })
              /*{
                loaded: number;
                total?: number;
                progress?: number;
                bytes: number;
                estimated?: number;
                rate?: number; // download speed in bytes
                download: true; // download sign
              }*/
            }
          }
        )
        .then(response => {
          const state = {
            response,
            blobSize: response.data.size,
            chunkIndex: 0,
            chunkLength: Math.ceil(response.data.size / BYTE) // Chunk size of 1KB
          }

          const reader = createFileReader({
            self: this,
            data: response.data,
            node: this.$refs['pre'],
            onSetData() {},
            onSetRate() {},
            onComplete() {
              console.log('COMPLETE')
            }
          })

          Object.assign(this, { reader })
          reader.onabort = event => {
            console.log('reader.onabort', 'Hello')
            this.onDestroy()
          }

          reader.readAsText(response.data.slice(0, 0))
          return response
        })
    }

    fetchData()
  },
  beforeUnmount() {
    this.onDestroy()
    console.log('UNMOUNT')
  }
}
</script>

<style lang="scss" scoped>
pre {
  padding: 4px;
  font-size: 10px;
}

.progressbar {
  pointer-events: none;
  background-color: purple;
  height: 2px;
  width: 100%;
  &-inner {
    float: left;
    white-space: pre;
    height: 100%;
    background-color: yellow;
  }
}
</style>
