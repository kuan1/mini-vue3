import { effect, stop } from '../reacivity/index.js'

import { isObject, isFunction } from '../shared/index.js'

const INITIAL_WATCHER_VALUE = {}

// 这里仅仅实现 reactive对象类型 watch
export function watch(source, cb) {
  let getter

  if (isFunction(source)) {
    // 这里错误处理逻辑
    getter = source
  } else {
    // 这里不作处理，默认这里是reactive
    getter = () => source
  }

  const baseGetter = getter
  getter = () => traverse(baseGetter())

  let cleanup
  let onInvalidate = (fn) => {
    cleanup = runner.options.onStop = () => {
      fn()
    }
  }

  let oldValue = INITIAL_WATCHER_VALUE
  const job = () => {
    if (!runner.active) return
    const newValue = runner()
    cleanup && cleanup()
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  job.allowRecurse = true

  // sync
  const scheduler = job

  const runner = effect(getter, {
    lazy: true,
    scheduler,
  })

  oldValue = runner()

  return () => {
    stop(runner)
  }
}

function traverse(value, seen = new Set()) {
  if (!isObject(value) || seen.has(value)) {
    return value
  }
  for (const key in value) {
    // 主动触发
    traverse(value[key], seen)
  }
  return value
}
