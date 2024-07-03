function eventListeners() {
  const c = new AbortController()
  const p = new Promise((resolve) => {
    const hydrateOnEvents = '<%= options.hydrateOnEvents %>'.split(',')
    function handler(e) {
      hydrateOnEvents.forEach(e => w.removeEventListener(e, handler))
      requestAnimationFrame(() => resolve(e))
    }
    hydrateOnEvents.forEach((e) => {
      w.addEventListener(e, handler, {
        capture: true,
        once: true,
        passive: true,
        signal: c.signal,
      })
    })
  })
  return { c: () => c.abort(), p }
}

function idleListener() {
  let id
  const p = new Promise((resolve) => {
    const isMobile = w.innerWidth < 640
    const timeout = isMobile ? Number.parseInt('<%= options.postIdleTimeout.mobile %>') : Number.parseInt('<%= options.postIdleTimeout.desktop %>')
    const timeoutDelay = () => setTimeout(
      () => requestAnimationFrame(() => resolve('timeout')),
      timeout,
    )
    id = w.requestIdleCallback(timeoutDelay, { timeout: Number.parseInt('<%= options.idleCallbackTimeout %>') })
  })
  return { c: () => window.cancelIdleCallback(id), p }
}
const triggers = [idleListener(), eventListeners()]
const hydrationPromise = Promise.race(
  triggers.map(t => t.p),
).finally(() => {
  triggers.forEach(t => t.c())
})
