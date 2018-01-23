const removeDuplicates = array => Array.from(new Set(array))
const removeDuplicatesBy = (fn, array) => {
  let set = new Set()
  return array.filter(x => {
    let key = fn(x)
    let isNew = !set.has(key)

    if (isNew) set.add(key)

    return isNew
  })
}

module.exports = {
  removeDuplicates,
  removeDuplicatesBy
}