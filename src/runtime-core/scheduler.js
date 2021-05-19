const resolvedPromise = Promise.resolve()
let currentFlushPromise = null

export function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
