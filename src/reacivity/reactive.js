import { isObject, hasOwn, hasChanged } from '../shared/index.js'
import { track, trigger } from './effect.js'

// 保存所有的响应对象
export const reactiveMap = new WeakMap()

export const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive',
  RAW: '__v_raw',
}

// 获取响应式数据的原始对象
export function toRaw(observed) {
  return (observed && toRaw(observed[ReactiveFlags.RAW])) || observed
}

// 此处target仅支持简单对象，详细代码看 [@vue/reactivity](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/src/reactive.ts)
export function reactive(target) {
  // 如果不是对象直接返回
  if (!isObject) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
    return target
  }

  // 如果对象已经有了相应proxy直接返回
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy

  // 代理原对象
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // 添加一个 __v_isReactive 的属性，true
      if (key === ReactiveFlags.IS_REACTIVE) return true
      // 添加一个 __v_raw 的属性，返回没有被代理的原始对象
      if (key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)) return target
      // 获取应该返回的内容
      const res = Reflect.get(target, key, receiver)
      // 追踪依赖
      track(target, key)
      // 循环转化
      if (isObject(res)) return reactive(res)
      return res
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      oldValue = toRaw(oldValue)
      value = toRaw(value)
      const hadKey = hasOwn(target, key)
      const result = Reflect.set(target, key, value, receiver)
      // don't trigger if target is something up in the prototype chain of original
      if (target === toRaw(receiver) && (!hadKey || hasChanged(value, oldValue))) {
        // 根据target找到deps，触发effect
        trigger(target, key)
      }
      return result
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const oldValue = target[key]
      const result = Reflect.deleteProperty(target, key)
      if (result && hadKey) {
        // 根据target找到deps，触发effect
        trigger(target, key, undefined, oldValue)
      }
      return result
    },
  })

  // 把原始数据和相应对象关联，放入reactiveMap
  reactiveMap.set(target, proxy)

  return proxy
}
