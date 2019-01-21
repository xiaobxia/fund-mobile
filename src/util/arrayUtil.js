function getIndex (target, filterModel) {
  for (let i = 0; i < target.length; i++) {
    const item = target[i]
    let same = true
    for (let key in filterModel) {
      if (filterModel[key] !== item[key]) {
        same = false
        break
      }
    }
    if (same) {
      return i
    }
  }
}
const arrayUtil = {
  findObjectItem (array, keyName, keyValue) {
    for (let k = 0, len = array.length; k < len; k++) {
      if (array[k][keyName] === keyValue) {
        return array[k]
      }
    }
  },
  removeObjectItem (array, keyName, keyValue) {
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      if (item[keyName] === keyValue) {
        array.splice(i, 1)
        break
      }
    }
  },
  findIndex (target, filterModel) {
    return getIndex(target, filterModel)
  },
  findOne (target, filterModel) {
    return target[getIndex(target, filterModel)]
  }
}

export default arrayUtil
