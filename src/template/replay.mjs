(() => {
  w._$delayHydration.then((e) => {
    if ((!(e instanceof PointerEvent) && !(e instanceof MouseEvent) && !(window.TouchEvent && e instanceof TouchEvent)) || e instanceof MouseEvent && e.type !== 'click') {
      return
    }
    setTimeout(() => w.requestIdleCallback(() => setTimeout(() => e.target && e.target.click(), 500)), 50)
  })
})()
