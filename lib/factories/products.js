import validateKeys from '@@/helpers/validateKeys'
import deepmerge from 'deepmerge'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'
import dayjs from '../dayjs'
import math from '../mathConfig'
const { evaluate, bignumber } = math

const defaults = {
  get paidType() {
    return {
      UNPAID: 'unpaid',
      PAID: 'paid',
      SPLIT: 'split'
    }
  },
  get listItem() {
    return {
      uuid: uuidv4(), // uuidv4
      active: true,
      paid: defaults.paidType.UNPAID,
      name: null,
      value: null,
      description: null,
      _meta: {
        startDate: new Date(),
        startLocation: dayjs.tz.guess()
      }
    }
  }
}

const compare = {
  listItem: {
    active(originalValue, newValue) {
      return typeof newValue === 'boolean'
        ? newValue
        : typeof originalValue === 'boolean'
        ? originalValue
        : defaults.listItem.active
    },
    paid(originalValue, newValue) {
      return Object.values(defaults.paidType).includes(newValue)
        ? newValue
        : originalValue
        ? originalValue
        : defaults.listItem.paid
    }
  }
}
const compareListItem = {
  active(originalValue, newValue) {
    return typeof newValue === 'boolean'
      ? newValue
      : typeof originalValue === 'boolean'
      ? originalValue
      : defaults.listItem.active
  },
  paid(originalValue, newValue) {
    return Object.values(defaults.paidType).includes(newValue)
      ? newValue
      : originalValue
      ? originalValue
      : defaults.listItem.paid
  }
}

//  Factory: createProductListItem
const createProductListItem = (item = {}) => {
  const { listItem } = defaults
  return reactive(
    deepmerge(listItem, validateKeys(listItem, item, compare.listItem))
  )
}
// Factory: createProductList
const createProductList = (data = {}) => {
  console.log('createProductList', { data })
  // APP: state
  const state = reactive({
    name: '',
    list: []
  })

  Object.assign(state, {
    name: data.name ? data.name : '',
    list: Array.isArray(data.list) ? data.list : []
    // list: Array.isArray(data.list) ? data.list.map(createProductListItem) : []
  })
  // APP: methods
  const methods = {
    setList(list) {
      state.list = list
    },
    setData(data) {
      Object.assign(state, data)
    },
    addItem(item) {
      item = reactive(createProductListItem(item))
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
        validateKeys(list[foundIndex], item, compareListItem)
        return list[foundIndex]
      }

      return undefined
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
          ).filter(header => header !== 'uuid' && !header.startsWith('_'))
        : [],
    activeTotalValue: () =>
      state.list
        .reduce((acc, record) => {
          try {
            return acc.add(record.active ? evaluate(record.value) : 0)
          } catch (e) {
            return acc
          }
        }, bignumber(0))
        .toFixed(2),
    activePaidValue: () =>
      state.list
        .reduce((acc, record) => {
          try {
            return acc.add(
              record.active && record.paid === 'paid'
                ? evaluate(record.value)
                : 0
            )
          } catch (e) {
            return acc
          }
        }, bignumber(0))
        .toFixed(2),
    activeNeedToPay: () =>
      evaluate(
        `${computed.activeTotalValue()} - ${computed.activePaidValue()}`
      ).toFixed(2),
    onlyActiveRecords: () => state.list.filter(record => record.active)
  }

  return {
    state,
    methods,
    ...methods,
    computed,
    ...computed
  }
}
// Class: ProductList
const ProductList = function (data = {}) {
  const { state, methods, computed } = createProductList(data)
  Object.assign(this, { state, methods, computed })
}

const products = {
  ...createProductList()
}

export default products

export {
  ProductList,
  createProductList,
  createProductListItem,
  defaults,
  evaluate
}
