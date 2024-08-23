const methods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch']

function createAjaxRequest(method) {
  const currentRequest = {}

  function makeRequest(url, params, headers = {}) {
    if (currentRequest[method]) {
      currentRequest[method].abort()
    }

    currentRequest[method] = new XMLHttpRequest()
    currentRequest[method].open(method, url)

    if (method === 'get' || method === 'head') {
      const urlParams = new URLSearchParams()
      for (const key in params) {
        urlParams.append(key, params[key])
      }
      url = `${url}?${urlParams.toString()}`
    } else {
      currentRequest[method].setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
      const encodedParams = new URLSearchParams()
      for (const key in params) {
        encodedParams.append(key, params[key])
      }
      currentRequest[method].send(encodedParams.toString())
    }

    for (const headerName in headers) {
      currentRequest[method].setRequestHeader(headerName, headers[headerName])
    }

    return new Promise((resolve, reject) => {
      currentRequest[method].onreadystatechange = function () {
        if (currentRequest[method].readyState === 4) {
          if (currentRequest[method].status === 200) {
            resolve(currentRequest[method].responseText)
          } else {
            reject(
              new Error(
                'Request failed with status code: ' +
                  currentRequest[method].status
              )
            )
          }
        }
      }
    })
  }

  return makeRequest
}

const scaffoldAjaxRequest = () => {
  const ajaxRequests = {}

  for (const method of methods) {
    ajaxRequests[method] = createAjaxRequest(method)
  }
  return ajaxRequests
}

export default scaffoldAjaxRequest
export { createAjaxRequest }
