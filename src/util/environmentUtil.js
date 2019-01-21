const environmentUtil = {
  setAdaptive () {
    let baseFontSize = 20
    // 和width有关
    let winWidth = 0
    let winHeight = 0
    if (window.innerWidth) {
      winWidth = window.innerWidth
    } else if ((document.body) && (document.body.clientWidth)) {
      winWidth = document.body.clientWidth
    }
    if (window.innerHeight) {
      winHeight = window.innerHeight
    } else if ((document.body) && (document.body.clientHeight)) {
      winHeight = document.body.clientHeight
    }
    // 通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
      winWidth = document.documentElement.clientWidth
      winHeight = document.documentElement.clientHeight
    }
    let fontScale = winWidth / 375
    let ua = navigator.userAgent
    let matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i)
    let UCversion = ua.match(/U3\/((\d+|\.){5,})/i)
    let isUCHd = UCversion && parseInt(UCversion[1].split('.').join(''), 10) >= 80
    let isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi)
    let dpr = window.devicePixelRatio || 1
    if (!isIos && !(matches && matches[1] > 534) && !isUCHd) {
      // 如果非iOS, 非Android4.3以上, 非UC内核, 就不执行高清, dpr设为1;
      dpr = 1
    }
    let scale = 1 / dpr
    let metaEl = document.querySelector('meta[name="viewport"]')
    if (!metaEl) {
      metaEl = document.createElement('meta')
      metaEl.setAttribute('name', 'viewport')
      document.head.appendChild(metaEl)
    }
    metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale)
    document.documentElement.style.fontSize = (baseFontSize / 2 * dpr * fontScale) + 'px'
    document.documentElement.setAttribute('data-dpr', dpr)
    let fontSize = baseFontSize / 2 * dpr * fontScale
    window.adaptive = {
      winHeight: winHeight,
      winWidth: winWidth,
      dpr: dpr,
      fontSize: fontSize,
      baseFontSize: baseFontSize,
      zoom: fontSize / 20
    }
  }
}

export default environmentUtil
