const link = document.createElement('a')
export const saveAs = (data, fileName = 'file.json') => {
  // const blob = new Blob([JSON.stringify(data, null, '\t')], {
  //   type: 'text/plaincharset=utf-8'
  // })
  // const blobURL = URL.createObjectURL(blob)
  // const link = document.createElement('a')
  // link.href = blobURL
  // link.setAttribute('download', fileName)
  // link.click()
  // URL.revokeObjectURL(blobURL)

  try {
    const blob = new Blob([JSON.stringify(data, null, '\t')], {
      type: 'application/json'
    })
    const url = window.URL.createObjectURL(blob)

    link.href = url
    link.download = fileName
    link.click()
  } catch (error) {
    console.error(error)
  }
}
