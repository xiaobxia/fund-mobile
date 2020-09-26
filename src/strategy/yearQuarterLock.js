// 是否达成年季度锁仓
function ifYearQuarterLock (yearDiff, quarterDiff, sLine) {
  // 年线是正的，季度线是负的
  if (yearDiff > 0 && quarterDiff < 0) {
    // 满足条件
    if (quarterDiff <= sLine) {
      return true
    }
  }
  return false
}

// 是否解开年季度锁
function ifUnYearQuarterLock (yearDiff, quarterDiff) {
  // 年线转成负的就结束
  if (yearDiff <= 0) {
    return true
  }
  // 季度线转成正的就终结
  if (quarterDiff > 0) {
    return true
  }
  return false
}

function isInYearQuarterLock () {
}

function isInUnYearQuarterLock () {
}

export default {
  ifYearQuarterLock,
  ifUnYearQuarterLock,
  isInYearQuarterLock,
  isInUnYearQuarterLock
}
