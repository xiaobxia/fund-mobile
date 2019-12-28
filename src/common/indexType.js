import indexList from '@/common/indexList.js'
// 机构指数
const jigou = [
  'shengwu',
  'yiliao',
  'baijiu',
  'yiyao',
  'shipin'
]

// 高费率指数
const highRate = [
  'chuanmei',
  'youse',
  'dichan',
  'gangtie',
  'meitan',
  'baoxian'
]

// 垃圾指数
const laji = [
  // 'gangtie',
  // 'huanbao',
  // 'meitan',
  // 'jijian',
  // 'qiche',
  // 'youse',
  // 'chuanmei'
]

// 宽指数
const kuanji = [
  'sanbai',
  'wubai',
  'wulin',
  'yiqian',
  'chuangye'
]

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
