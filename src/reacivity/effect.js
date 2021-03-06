export const ITERATE_KEY = Symbol('')

const effectStack = []
let activeEffect

let shouldTrack = true
const trackStack = [] // Boolean[]

let uid = 0

// 原始对象和依赖 对应关系
const targetMap = new WeakMap()

/**
 * 1. 给target 对应Key关联依赖的Set对象 加入 effect函数
 * 2. effect函数 属性deps数组 加入 target关联key的依赖Set
 * @param {*} target 原始对象
 * @param {*} key 追踪key
 */
// 保存key对应的更新函数，并把key对应的所有的更新函数，给当前更新函数作为一个属性
export function track(target, key) {
  // 不在effect函数中，或者手动停止追踪直接返回
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  // 根据原始对象，找到所有依赖的Map对象
  let depsMap = targetMap.get(target)
  // 如果没有找到依赖Map对象，添加一个空Map对象
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 获取key对应所有依赖
  let dep = depsMap.get(key)
  // 没有对应key的依赖Set，赋值空Set
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 添加依赖
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

// 根据原始数据找到dep，循环执行effect函数
export function trigger(target, key, type) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 获取要触发的函数
  const effects = new Set()

  // 添加依赖
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        effect !== activeEffect && effects.add(effect)
      })
    }
  }

  switch (type) {
    case 'delete':
    case 'add':
      // 如果是添加或者删除，触发ownkeys追踪
      add(depsMap.get(ITERATE_KEY))
      break
    default:
      break
  }

  // 添加key对应依赖
  key !== void 0 && add(depsMap.get(key))

  // 循环触发key对应的更新函数，computed/watch触发options.scheduler追踪value
  effects.forEach((effect) => (effect.options.scheduler ? effect.options.scheduler(effect) : effect()))
}

export function isEffect(fn) {
  return fn && fn._isEffect === true
}

export function effect(fn, options = {}) {
  // 获取原始函数
  isEffect(fn) && (fn = fn.raw)
  const effect = function reactiveEffect() {
    // 加入一个副作用的开关
    if (!effect.active) {
      return fn()
    }
    // 防止effect嵌套使用队列维护，清空所有依赖此更新函数，重新收集依赖加入新的更新函数
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        // 防止effect执行中调用另一个effect，使用数组保存shouldEffect、effect
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        // 执行结束后，删除数组最后一个shouldEffect、effect
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  // 副作用函数递增的唯一标识
  effect.id = uid++
  // 加入一个是effect标识
  effect.__isEffect = true
  // 加入一个副作用函数的开关，控制是否停止副作用
  effect.active = true
  // 没有副作用原始函数
  effect.raw = fn
  effect.deps = []
  effect.options = options
  // computed在获取value的时候才去收集依赖
  !options.lazy && effect()
  return effect
}

export function stop(effect) {
  if (effect.active) {
    cleanup(effect)
    if (effect.options.onStop) {
      effect.options.onStop()
    }
    effect.active = false
  }
}

// 新增变量shouldTrack true，并保存旧shouldTrack变量到trackStack
function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

// 清空effect函数的deps数组，和原始数据对应的dep（effect.deps可能收集多个相应对象的deps）
function cleanup(effect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

// interface ReactiveEffect<T = any> {
//   (): T
//   _isEffect: true
//   id: number
//   active: boolean
//   raw: () => T
//   deps: Array<Dep>
//   options: ReactiveEffectOptions
// }

// export interface ReactiveEffectOptions {
//   lazy?: boolean
// }
