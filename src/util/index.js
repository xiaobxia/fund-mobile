export function debounce(fn, delay) {
  let timer = null

  return function() {
    const args = arguments
    const context = this

    if (timer) {
      clearTimeout(timer)

      timer = setTimeout(function() {
        fn.apply(context, args)
      }, delay)
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args)
      }, delay)
    }
  }
}

export function throttle(func, delay) {
  var prev = Date.now()
  return function() {
    var context = this
    var args = arguments
    var now = Date.now()
    if (now - prev >= delay) {
      func.apply(context, args)
      prev = Date.now()
    }
  }
}
