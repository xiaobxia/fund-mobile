export default {
  // 通过positionFg计算
  indexNumber: 25.5,
  sellFixList: [
    // 控制10000一下
    // 'shengwu',
    // 控制2000一下，然后定制定投
    'yiqian'
    // 'jisuanji',
    // 'xinxi',
    // 'dianzi',
    // 生物太多了
    // 'shengwu'
  ],
  // 移除定投
  removeFixList: [
    // E大认为可以定投电子信息
    // 'jisuanji',
    // 'xinxi',
    // 'dianzi',
    'yiqian',
    'huangjin'
  ],
  // 坏指数，不能做仓位跟随
  badIndexList: [
    'meitan', 'gangtie', 'chuanmei', 'jijian', 'dichan'
  ]
}
