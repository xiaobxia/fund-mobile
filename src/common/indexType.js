import indexList from '@/common/indexList.js'
import dateUtil from '@/util/dateUtil'
import storageUtil from '@/util/storageUtil.js'
import setting from '@/setting.js'

// 机构指数
let jigou = []

// 垃圾指数
let laji = [
]

const d = dateUtil.getDate()
const month = d.getMonth() + 1
// 在结算期，没有机构和垃圾的概念
if (month < 11) {
  jigou = [
    'shengwu',
    'yiliao',
    'baijiu',
    'shipin'
  ]
  // 垃圾不要嫌少，本来其实就没有太大的买的必要
  const noLaji = storageUtil.getData('noBuySellConfig', 'noLaji') || false
  if (!noLaji) {
    laji = [
      'jijian',
      'chuanmei'
      // 'gangtie',
      // 'meitan',
      // 'jijian',
      // 'dichan',
      // 'youse',
      // 'huanbao',
      // // 军工暂时可以不是垃圾
      // // 'jungong',
      // 'chuanmei'
    ]
  }
}

// 高费率指数
const highRate = setting.highRate

// 宽指数
const kuanji = setting.kuanji

function keyToName (keyList) {
  const list = []
  for (let i = 0; i < keyList.length; i++) {
    for (let j = 0; j < indexList.length; j++) {
      if (keyList[i] === indexList[j].key) {
        list.push(indexList[j].name)
        break
      }
    }
  }
  return list
}

export default {
  jigou,
  highRate,
  laji,
  kuanji,
  jigouName: keyToName(jigou),
  lajiName: keyToName(laji)
}
