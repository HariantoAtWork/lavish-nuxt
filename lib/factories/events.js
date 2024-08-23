import deepmerge from '@@/deepmerge'
import validateKeys from '@@/helpers/validateKeys'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'
// import dayjs from './dayjs'

const defaults = {
  get listItem() {
    return {
      uuid: uuidv4(), // uuidv4
      name: null, // name
      apps: [],
      _meta: {
        created: {
          date: dayjs.utc().format(),
          location: dayjs.tz.guess()
        },
        start: {
          date: null,
          location: dayjs.tz.guess()
        },
        end: {
          date: null,
          location: dayjs.tz.guess()
        }
      }
    }
  }
}

const compare = {
  listItem: {}
}

// Factory: createEventListItem(data)
const createEventListItem = item => {
  const { listItem } = defaults
  return deepmerge(listItem, validateKeys(listItem, item, compare.listItem))
}
// Factory: createEventList
const createEventList = function (data = {}) {
  // APP: state
  const state = reactive({
    name: '',
    list: []
  })

  Object.assign(state, {
    name: data.name ? data.name : '',
    list: Array.isArray(data.list) ? data.list.map(createEventListItem) : []
  })
  // APP: methods
  const methods = {
    setData(data) {
      Object.assign(state, data)
    },
    addItem(item) {
      item = reactive(createEventListItem(item))
      state.list.push(item)
      return item
    },
    removeItem(item) {
      methods.removeItem(item.uuid)
    },
    removeItemByUuid(uuid) {
      const { list } = state
      const foundIndex = list.findIndex(item => item.uuid === uuid)
      if (foundIndex > -1) list.splice(foundIndex, 1)
    },
    updateItem(item) {
      const { list } = state
      const { uuid } = item
      delete item.uuid

      const foundIndex = list.findIndex(r => r.uuid === uuid)
      if (foundIndex > -1) {
        validateKeys(list[foundIndex], item, compare.listItem)
        return list[foundIndex]
      }

      return undefined
    },
    containsTypeofKey(value) {
      switch (typeof value) {
        case 'function':
          return true
        case 'object':
          return true
        default:
          return false
      }
    }
  }
  // APP: computed
  const computed = {
    headers: () =>
      state.list.length
        ? Object.keys(
            state.list.reduce((acc, o) => {
              Object.assign(acc, o)
              return acc
            }, {})
          ).filter(
            header =>
              !['uuid', 'apps'].includes(header) && !header.startsWith('_')
          )
        : []
  }

  return {
    state,
    methods,
    ...methods,
    computed,
    ...computed
  }
}

// Class: EventListItem
const EventListItem = (item, { parentMethods }) => {
  Object.assign(this, createEventListItem(item, { parentMethods }))
}

// Class: EventList
const EventList = function (data = {}) {
  Object.assign(
    this,
    deepmerge(createEventList(data), {
      methods: {
        addItem(item) {
          item = reactive(
            new EventListItem(item, {
              get parentMethods() {
                return this.methods
              }
            })
          )
          this.state.list.push(item)
          return item
        }
      }
    })
  )
}

const eventList = {
  ...createEventList()
}

export default eventList

export { EventList, EventListItem, createEventList, createEventListItem }
