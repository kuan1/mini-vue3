import { effect } from '../reacivity/index.js'
import { hasChanged, isObject } from '../shared/index.js'

const INITIAL_WATCHER_VALUE = {}

export function watch(source, cb) {
  let getter = () => source
  const baseGetter = getter
  getter = () => traverse(baseGetter())
  let oldValue = INITIAL_WATCHER_VALUE
  const job = () => {
    // effect开关
    if (!runner.active) return
    const newValue = runner()
    if (hasChanged(newValue, oldValue)) {
      cb && cb(newValue, INITIAL_WATCHER_VALUE ? undefined : oldValue)
    }
    oldValue = newValue
  }

  const runner = effect(getter, { lazy: true, scheduler: () => Promise.resolve().then(job) })

  oldValue = runner()

  return () => {
    if (runner.active) {
      runner.active = false
    }
  }
}

function traverse(value, seen = new Set()) {
  if (!isObject() || seen.has(value)) {
    return value
  }
  seen.add(value)
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}
