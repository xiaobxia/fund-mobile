export default {
  // 根据20天线判断是否锁仓
  ifNoSell: function (averageList) {
    let last = averageList[averageList.length - 1]
    let lastTwo = averageList[averageList.length - 2]
    if (last > 0) {
      let max = 0
      let maxIndex = 0
      for (let i = 0; i < (averageList.length - 2); i++) {
        let now = averageList[i]
        if (now > max) {
          max = now
          maxIndex = i
        }
      }
      if (max <= 0) {
        if (lastTwo > 0) {
          return true
        }
        return false
      } else {
        for (let j = maxIndex; j < averageList.length; j++) {
          let now = averageList[j]
          if (now < (max * 0.5)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }
}
