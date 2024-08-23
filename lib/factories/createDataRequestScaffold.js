// Title: createDataRequestScaffold
// Using: axiosBluebird.
const axiosBluebird = require('axiosbluebird')
const { Promise } = axiosBluebird

// Factory: createDataRequest
const createDataRequest = (
  axiosBluebirdMethodName = 'get',
  customErrorMessage = 'ERROR'
) => {
  let dataRequest = Promise.resolve()

  const request = (url, params) => {
    dataRequest.cancel()
    dataRequest = axiosBluebird[axiosBluebirdMethodName](url, params)
    return dataRequest
      .then(json => json.data)
      .catch(console.error.bind(console, `FAIL: - ${customErrorMessage}`))
  }

  return request
}

// Factory: createDataRequestScaffold
const createDataRequestScaffold = (name = 'Scaffold') => {
  const dr = {}
  ;[
    'axios',
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch'
  ].forEach(n => {
    // wil create, ie: dr.getData - FAIL: {name} getData
    dr[`${n}Data`] = createDataRequest(n, `${name} ${n}Data`)
  })

  return dr
}

export default createDataRequestScaffold
export { createDataRequest }
const {reactive } from 

const createGetRequest