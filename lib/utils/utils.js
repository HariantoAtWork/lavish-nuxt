export const convertLinks = text => {
  const regExp = /(https?|ftp|file):\/\/([\w\-]+\.[\w\-]+)([-\w\.,~%#?&//=]*)/g
  return text.replace(regExp, (match, protocol, domain, path) => {
    return `<a href="${match}" target="_blank">${match}</a>`
  })
}

export const reConvertdata = data => JSON.parse(JSON.stringify(data))
