export function moveChildrenAndRemoveParent(parent) {
  const children = parent.childNodes
  const parentNode = parent.parentNode

  for (let i = 0; i < children.length; i++) {
    parentNode.insertBefore(children[i], parent)
  }

  parentNode.removeChild(parent)
}
