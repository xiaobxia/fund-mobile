/**
 * Created by xiaobxia on 2018/4/5.
 */
// 格式化金额显示
function formatMoneyRaw (str) {
  let newStr = ''
  let count = 0
  let startCode = ''
  str = str ? '' + str : '0'
  if (str.charAt(0) === '-') {
    str = str.slice(1)
    startCode = '-'
  }
  // 当数字是整数
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
    // 自动补小数点后两位
    return startCode + str
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr
    return startCode + str
  }
}
const numberUtil = {
  countRate: function (numerator, denominator) {
    denominator = denominator || 1
    return Math.round(10000 * (numerator / denominator)) / 100
  },
  countDifferenceRate: function (numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return Math.round(10000 * ((numerator - denominator) / denominator)) / 100
  },
  countDifferenceRateHigh: function (numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return Math.round(1000000 * ((numerator - denominator) / denominator)) / 10000
  },
  keepTwoDecimals: function (number) {
    return Math.round(100 * number) / 100
  },
  keepFourDecimals: function (number) {
    return Math.round(10000 * number) / 10000
  },
  ifAround: function (number, target) {
    const step = 100
    return (number >= (target - step)) && (number <= (target + step))
  },
  // 格式化金额显示
  $formatMoney (value) {
    // 只到整数
    return formatMoneyRaw(value)
  }
}

export default numberUtil
