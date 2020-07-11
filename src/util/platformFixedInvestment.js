/**
 * Created by xiaobxia on 2018/6/28.
 */
import numberUtil from './numberUtil'

function ifMatch (raw, target) {
  let match = true
  for (let key in target) {
    if (target[key] !== raw[key]) {
      match = false
      break
    }
  }
  return match
}

function Util (config) {
  this.threshold = config.threshold
  this.rate = config.rate
  this.wave = config.wave
}

Util.prototype = {
  getFlag: function (record, lv) {
    let flag = {}
    flag.ifUpOpen = this.ifUpOpen(record)
    flag.ifOpenHigh = this.ifOpenHigh(record)
    flag.ifUpClose = this.ifUpClose(record)
    flag.ifCloseHigh = this.ifCloseHigh(record)
    flag.ifCloseHigh2 = this.ifCloseHigh2(record, lv)
    flag.ifSessionDown = this.ifSessionDown(record)
    flag.ifSessionDownHigh = this.ifSessionDownHigh(record)
    flag.ifSessionUpClose = this.ifSessionUpClose(record)
    flag.ifSessionUpCloseHigh = this.ifSessionUpCloseHigh(record)
    flag.ifSessionUp = this.ifSessionUp(record)
    flag.ifSessionUpHigh = this.ifSessionUpHigh(record)
    flag.ifSessionDownClose = this.ifSessionDownClose(record)
    flag.ifSessionDownCloseHigh = this.ifSessionDownCloseHigh(record)
    flag.ifHighPreCloseDown = this.ifHighPreCloseDown(record)
    flag.ifHighPreCloseDownHigh = this.ifHighPreCloseDownHigh(record)
    flag.ifHighPreCloseUp = this.ifHighPreCloseUp(record)
    flag.ifHighPreCloseUpHigh = this.ifHighPreCloseUpHigh(record)
    return flag
  },
  // 是否高开
  ifUpOpen: function (record) {
    const preClose = record.preClose
    const open = record.open
    return open >= preClose
  },
  // 是否开盘高幅度
  ifOpenHigh: function (record) {
    const rate = this.rate
    const preClose = record.preClose
    const open = record.open
    return Math.abs(numberUtil.countDifferenceRate(open, preClose)) >= rate
  },
  // 是否上涨
  ifUpClose: function (record) {
    return record.netChangeRatio > 0
  },
  // 是否大幅上涨
  ifCloseHigh: function (record) {
    const rate = this.rate
    return Math.abs(record.netChangeRatio) >= rate
  },
  ifCloseHigh2: function (record, lv) {
    const rate = this.rate
    // return Math.abs(record.netChangeRatio) >= 2.25 * rate && Math.abs(record.netChangeRatio) <= 2.5 * rate
    return Math.abs(record.netChangeRatio) >= (lv || 2.5) * rate
  },
  // 盘中下跌
  ifSessionDown: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -wave
  },
  // 盘中大幅下跌
  ifSessionDownHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -(2 * wave)
  },
  // 收盘拉起
  ifSessionUpClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= wave
  },
  // 收盘大幅拉起
  ifSessionUpCloseHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= (2 * wave)
  },
  // 盘中上升
  ifSessionUp: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= wave
  },
  // 盘中大幅上升
  ifSessionUpHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= (2 * wave)
  },
  // 收盘回落
  ifSessionDownClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -wave
  },
  // 收盘大幅回落
  ifSessionDownCloseHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -(2 * wave)
  },
  // 无抵抗下跌
  ifHighPreCloseDown: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -rate
  },
  // 大幅无抵抗下跌
  ifHighPreCloseDownHigh: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -(2 * rate)
  },
  // 大涨
  ifHighPreCloseUp: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.low, record.preClose) > rate
  },
  // 暴涨
  ifHighPreCloseUpHigh: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.low, record.preClose) > (2 * rate)
  },
  ifBuyChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.1)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.1)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.1)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.1)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuySanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellSanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.3)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record, 2.3)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyBaijiu: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.5)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellBaijiu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifBuyShipin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellShipin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifSellYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  },
  ifBuyHuangjin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    return false
  },
  ifSellHuangjin: function (record, oneDayRecord) {
    const today = this.getFlag(record, 1.9)
    // 大涨
    if (ifMatch(today,
      {'ifHighPreCloseUpHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-100-0'
      }
    }
    // 涨幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': true, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'sell-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'xiong'
      }
    }
    return false
  }
}

const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    threshold: 1.01,
    wave: 1.0815568862275453,
    rate: 0.9367763157894737,
    mix: true
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    threshold: 0.76,
    rate: 0.7031645569620255,
    wave: 0.8081952662721895,
    mix: true
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    threshold: 0.77,
    rate: 0.7243790849673197,
    wave: 0.825182926829268,
    mix: true
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    threshold: 0.86,
    wave: 0.853157894736842,
    rate: 0.868132530120482,
    mix: true
  },
  'yiqian': {
    code: 'sh000852',
    name: '1000',
    threshold: 0.83,
    rate: 0.7927516778523488,
    wave: 0.8675304878048783
  },
  'baijiu': {
    code: 'sz399997',
    name: '白酒',
    threshold: 1.25,
    rate: 1.1202272727272722,
    wave: 1.374864864864865
  },
  'shipin': {
    code: 'sz399396',
    name: '食品',
    threshold: 0.85,
    rate: 0.7876623376623377,
    wave: 0.9127884615384618
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗',
    threshold: 0.97,
    wave: 1.0519615384615388,
    rate: 0.8889999999999998
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物',
    threshold: 0.89,
    rate: 0.8235460992907802,
    wave: 0.9630645161290321
  },
  'huangjin': {
    code: 'sh518880',
    name: '黄金',
    threshold: 0.37,
    rate: 0.4959514675767919,
    wave: 0.24661200135226474
  }
}
const fnMap = {
  chuangyeBuy: 'ifBuyChuangye',
  chuangyeSell: 'ifSellChuangye',
  wulinBuy: 'ifBuyWulin',
  wulinSell: 'ifSellWulin',
  sanbaiBuy: 'ifBuySanbai',
  sanbaiSell: 'ifSellSanbai',
  wubaiBuy: 'ifBuyWubai',
  wubaiSell: 'ifSellWubai',
  yiqianBuy: 'ifBuyYiqian',
  yiqianSell: 'ifSellYiqian',
  baijiuBuy: 'ifBuyBaijiu',
  baijiuSell: 'ifSellBaijiu',
  shipinBuy: 'ifBuyShipin',
  shipinSell: 'ifSellShipin',
  yiliaoBuy: 'ifBuyYiliao',
  yiliaoSell: 'ifSellYiliao',
  shengwuBuy: 'ifBuyShengwu',
  shengwuSell: 'ifSellShengwu',
  huangjinBuy: 'ifBuyHuangjin',
  huangjinSell: 'ifSellHuangjin'
}

const FixedInvestment = {
  Util,
  codeMap,
  fnMap,
  formatData: function (list) {
    let listTemp = []
    for (let i = 0; i < list.length; i++) {
      listTemp.push({
        date: '' + list[i].date,
        ...list[i].kline
      })
    }
    let xData = []
    for (let j = 0; j < 7; j = j + 0.1) {
      xData.push({
        number: j.toFixed(1),
        count: 0,
        countList: [],
        count2: 0,
        countList2: []
      })
    }
    list.forEach((item, index) => {
      let value = Math.abs(numberUtil.countDifferenceRate(item.kline.close, item.kline.preClose))
      let value2 = Math.abs(numberUtil.countDifferenceRate(item.kline.high, item.kline.low))
      for (let i = 0; i < xData.length; i++) {
        if (value >= xData[i].number && xData[i + 1] && value < xData[i + 1].number) {
          xData[i].count++
          xData[i].countList.push(value)
          break
        }
      }
      for (let j = 0; j < xData.length; j++) {
        if (value2 >= xData[j].number && xData[j + 1] && value2 < xData[j + 1].number) {
          xData[j].count2++
          xData[j].countList2.push(value2)
          break
        }
      }
    })
    let all = 0
    let count = 0
    let all2 = 0
    let count2 = 0
    for (let k = 0; k < xData.length; k++) {
      if (xData[k].count >= 5) {
        count = count + xData[k].count
        for (let c = 0; c < xData[k].countList.length; c++) {
          all = all + xData[k].countList[c]
        }
      }
      if (xData[k].count2 >= 5) {
        count2 = count2 + xData[k].count2
        for (let b = 0; b < xData[k].countList2.length; b++) {
          all2 = all2 + xData[k].countList2[b]
        }
      }
    }
    xData.sort((a, b) => {
      return b.count2 - a.count2
    })
    let a = (all2 / count2) / 2
    let c = all / count
    let threshold = numberUtil.keepTwoDecimals((a + c) / 2)
    return {list: listTemp, threshold: threshold, rate: c, wave: a}
  }
}

export default FixedInvestment
