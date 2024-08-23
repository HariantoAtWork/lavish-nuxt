const validateKeys = (orignalItem = {}, newItem = {}, comparingKeys = {}) => {
  // Get the existing keys from the found item
  const existingKeys = Object.keys(orignalItem)

  // Filter the item to only include existing keys
  const filteredItem = {}
  for (const key in newItem) {
    if (existingKeys.includes(key)) {
      filteredItem[key] =
        // Check if the key exists in comparingKeys
        typeof comparingKeys[key] === 'function'
          ? comparingKeys[key](orignalItem[key], newItem[key])
          : newItem[key]
    }
  }

  // Update the found record with filtered data
  Object.assign(orignalItem, filteredItem)
  return orignalItem
}

export default validateKeys
