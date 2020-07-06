export default [
  {
    key: 'chuangye',
    code: 'sz399006',
    name: '创业',
    threshold: 0.94,
    wave: 0.9277112676056345,
    rate: 0.9621341463414633,
    fixLine: -19,
    relieveFixLine: 5,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 15,
    cutDownLine: 30,
    quarterHotLine: 20,
    relieveZ45Line: -6
  },
  {
    key: 'yiyao',
    code: 'sh000037',
    name: '医药',
    attach: 'chuangye',
    threshold: 0.94,
    rate: 0.9339416058394158,
    wave: 0.9391726618705037,
    fixLine: -18,
    relieveFixLine: 5,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 10,
    cutDownLine: 19,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: 0
  },
  {
    key: 'jisuanji',
    code: 'sz399363',
    name: '计算机',
    attach: 'chuangye',
    threshold: 1.04,
    rate: 1.0100719424460431,
    wave: 1.06308,
    fixLine: -19,
    relieveFixLine: 5,
    reduceLine: 8,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 20,
    cutDownLine: 30,
    mix: false,
    quarterHotLine: 20,
    relieveZ45Line: -5
  },
  {
    key: 'dianzi',
    code: 'sz399811',
    name: '电子',
    attach: 'chuangye',
    threshold: 0.9,
    rate: 0.8832450331125826,
    wave: 0.9248263888888891,
    fixLine: -20.5,
    relieveFixLine: 5,
    reduceLine: 8,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 20,
    cutDownLine: 40,
    mix: false,
    quarterHotLine: 20,
    relieveZ45Line: 0
  },
  {
    key: 'wulin',
    code: 'sh000016',
    name: '50',
    threshold: 0.73,
    rate: 0.7160122699386505,
    wave: 0.7482424242424242,
    fixLine: -10,
    relieveFixLine: 5,
    reduceLine: 4,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 14,
    cutDownLine: 17,
    quarterHotLine: 20,
    relieveZ45Line: 0
  },
  {
    key: 'yinhang',
    code: 'sz399986',
    name: '银行',
    attach: 'wulin',
    threshold: 0.7,
    rate: 0.6845000000000002,
    wave: 0.7059375,
    fixLine: -10,
    relieveFixLine: 3,
    reduceLine: 4,
    downTrendLine: -3.3,
    days: 1000,
    topLine: 7.5,
    cutDownLine: 14,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: 0
  },
  {
    key: 'shipin',
    code: 'sz399396',
    name: '食品',
    attach: 'wulin',
    threshold: 0.85,
    rate: 0.7876623376623377,
    wave: 0.9127884615384618,
    fixLine: -15,
    relieveFixLine: 5,
    reduceLine: 8,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 24,
    cutDownLine: 30,
    mix: false,
    quarterHotLine: 30,
    relieveZ45Line: 0
  },
  {
    key: 'jungong',
    code: 'sz399959',
    name: '军工',
    attach: 'chuangye',
    threshold: 0.93,
    wave: 0.9716906474820142,
    rate: 0.8817687074829932,
    fixLine: -15,
    relieveFixLine: 2,
    reduceLine: 5.5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 14,
    cutDownLine: 24,
    mix: false,
    quarterHotLine: 20,
    relieveZ45Line: -9
  },
  {
    key: 'xinxi',
    code: 'sh000993',
    name: '信息',
    attach: 'chuangye',
    threshold: 1.03,
    rate: 1.0703999999999998,
    wave: 0.9838741721854306,
    fixLine: -20,
    relieveFixLine: 5,
    reduceLine: 6,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 18,
    cutDownLine: 27,
    mix: false,
    quarterHotLine: 20,
    relieveZ45Line: -6
  },
  {
    key: 'jijian',
    code: 'sz399995',
    name: '基建',
    threshold: 0.62,
    rate: 0.619496855345912,
    wave: 0.628292682926829,
    fixLine: -20,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 10,
    cutDownLine: 20,
    mix: false,
    quarterHotLine: 13,
    relieveZ45Line: 0
  },
  {
    key: 'huanbao',
    code: 'sh000827',
    name: '环保',
    threshold: 0.67,
    rate: 0.6970833333333336,
    wave: 0.6393312101910825,
    fixLine: -20,
    relieveFixLine: 4,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 5.5,
    cutDownLine: 7,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: 0
  },
  {
    key: 'qiche',
    code: 'sz399432',
    name: '汽车',
    threshold: 0.61,
    rate: 0.5677702702702703,
    wave: 0.6542647058823531,
    fixLine: -18,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 5,
    cutDownLine: 7,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: -3.5
  },
  {
    key: 'yiqian',
    code: 'sh000852',
    name: '1000',
    threshold: 0.81,
    rate: 0.8312195121951221,
    wave: 0.7816081871345026,
    fixLine: -19,
    relieveFixLine: 3,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 7.5,
    cutDownLine: 15,
    quarterHotLine: 10,
    relieveZ45Line: -6
  },
  {
    key: 'chuanmei',
    code: 'sz399971',
    name: '传媒',
    attach: 'chuangye',
    threshold: 0.86,
    rate: 0.8374025974025976,
    wave: 0.8754518072289161,
    fixLine: -21,
    relieveFixLine: 4,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 12,
    cutDownLine: 15,
    mix: false,
    quarterHotLine: 15,
    relieveZ45Line: -6
  },
  {
    key: 'zhengquan',
    code: 'sz399437',
    name: '证券',
    threshold: 0.83,
    rate: 0.8198026315789474,
    wave: 0.8370723684210525,
    fixLine: -18,
    relieveFixLine: 5,
    reduceLine: 7,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 15,
    cutDownLine: 30,
    mix: false,
    quarterHotLine: 25,
    relieveZ45Line: 0
  },
  {
    key: 'youse',
    code: 'sh000823',
    name: '有色',
    threshold: 0.92,
    wave: 0.8558865248226952,
    rate: 0.9762650602409638,
    fixLine: -22,
    relieveFixLine: 4,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 8.5,
    cutDownLine: 11,
    mix: false,
    quarterHotLine: 9,
    relieveZ45Line: -4
  },
  {
    key: 'dichan',
    code: 'sz399393',
    name: '地产',
    attach: 'wulin',
    threshold: 0.94,
    rate: 0.9072847682119207,
    wave: 0.9646258503401361,
    fixLine: -18,
    relieveFixLine: 3,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 15,
    cutDownLine: 20,
    mix: false,
    quarterHotLine: 15,
    relieveZ45Line: 0
  },
  {
    key: 'yiliao',
    code: 'sz399989',
    name: '医疗',
    attach: 'chuangye',
    threshold: 0.97,
    wave: 1.0519615384615388,
    rate: 0.8889999999999998,
    fixLine: -16,
    relieveFixLine: 5,
    reduceLine: 6,
    downTrendLine: -3.3,
    days: 1000,
    topLine: 30,
    cutDownLine: 30,
    mix: false,
    quarterHotLine: 15,
    relieveZ45Line: -5
  },
  {
    key: 'shengwu',
    code: 'sz399441',
    name: '生物',
    attach: 'chuangye',
    threshold: 0.89,
    rate: 0.8235460992907802,
    wave: 0.9630645161290321,
    fixLine: -15,
    relieveFixLine: 5,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 30,
    cutDownLine: 30,
    mix: false,
    quarterHotLine: 15,
    relieveZ45Line: -4
  },
  {
    key: 'wubai',
    code: 'sh000905',
    name: '500',
    threshold: 0.75,
    wave: 0.6947452229299363,
    rate: 0.7977976190476194,
    fixLine: -17.5,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 7.5,
    cutDownLine: 9,
    quarterHotLine: 8,
    relieveZ45Line: -5
  },
  {
    key: 'gangtie',
    code: 'sz399440',
    name: '钢铁',
    threshold: 0.84,
    wave: 0.8545666666666663,
    rate: 0.8308843537414968,
    fixLine: -20,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 7,
    cutDownLine: 7,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: 0
  },
  {
    key: 'meitan',
    code: 'sz399998',
    name: '煤炭',
    threshold: 0.82,
    wave: 0.8193571428571426,
    rate: 0.8109589041095889,
    fixLine: -20,
    relieveFixLine: 1,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 20,
    cutDownLine: 20,
    mix: false,
    quarterHotLine: 10,
    relieveZ45Line: -5
  },
  {
    key: 'baoxian',
    code: 'sz399809',
    name: '保险',
    attach: 'wulin',
    threshold: 1,
    wave: 1.022290322580645,
    rate: 0.9797972972972975,
    fixLine: -16,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 900,
    topLine: 20,
    cutDownLine: 35,
    mix: false,
    quarterHotLine: 18,
    relieveZ45Line: 0
  },
  {
    key: 'sanbai',
    code: 'sh000300',
    name: '300',
    threshold: 0.68,
    rate: 0.6461783439490445,
    wave: 0.7182926829268294,
    fixLine: -11.5,
    relieveFixLine: 2,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 11,
    cutDownLine: 15,
    quarterHotLine: 15,
    relieveZ45Line: 0
  }
]
