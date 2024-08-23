import validateKeys from '@@/helpers/validateKeys'
import deepmerge from 'deepmerge'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'

const defaults = {
  get activeType() {
    return {
      INACTIVE: 'inactive',
      PROGRESS: 'progress',
      ONHOLD: 'onhold',
      DONE: 'done'
    }
  },
  get listItem() {
    return {
      uuid: uuidv4(),
      active: defaults.activeType.INACTIVE,
      subject: '',
      _meta: {
        start: {
          date: dayjs.utc().format(),
          location: dayjs.tz.guess()
        }
      }
    }
  }
}
const compare = {
  listItem: {
    active(originalValue, newValue) {
      return Object.values(defaults.activeType).includes(newValue)
        ? newValue
        : originalValue
        ? originalValue
        : defaults.listItem.active
    }
  }
}

// Factory: createTodoListItem
const createTodoListItem = item => {
  const { listItem } = defaults
  return deepmerge(listItem, validateKeys(listItem, item, compare.listItem))
}

// Factory: createTodoList
const createTodoList = (data = {}) => {
  // APP: state
  const state = reactive({
    name: typeof data.name === 'string' ? data.name : '',
    list: Array.isArray(data.list) ? data.list.map(createTodoListItem) : []
  })
  // App: methods
  const methods = {
    setList(list) {
      state.list = list
    },
    addItem(item) {
      item = reactive(createTodoListItem(item))
      state.list.push(item)
      return item
    },
    removeItem(item) {
      methods.removeItem(item.uuid)
    },
    removeItemByUuid(uuid) {
      const { list } = state
      const foundIndex = list.findIndex(item => item.uuid === uuid)
      if (foundIndex > -1) return list.splice(foundIndex, 1)
    },
    // updateItem(item) {
    //   const { list } = state
    //   const { uuid } = item
    //   delete item.uuid
    //   const found = list.find(item => item.uuid === uuid)
    //   return found ? Object.assign(found, item) : undefined
    // },
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
    }
  }

  const computed = {
    headers: () =>
      state.list.length
        ? Object.keys(
            state.list.reduce((acc, o) => {
              Object.assign(acc, o)
              return acc
            }, {})
          ).filter(header => header !== 'uuid' && !header.startsWith('_'))
        : [],
    inactiveList() {
      const { list } = state
      const { activeType } = defaults
      return list.filter(r => r.active === activeType.INACTIVE)
    },
    processList() {
      const { list } = state
      const { activeType } = defaults
      return list.filter(r => r.active === activeType.PROGRESS)
    },
    onholdList() {
      const { list } = state
      const { activeType } = defaults
      return list.filter(r => r.active === activeType.ONHOLD)
    },
    doneList() {
      const { list } = state
      const { activeType } = defaults
      return list.filter(r => r.active === activeType.DONE)
    }
  }

  return {
    state,
    methods,
    ...methods,
    computed,
    ...computed
  }
}

const todos = {
  ...createTodoList()
}

export default todos

export { createTodoList, createTodoListItem, defaults }
