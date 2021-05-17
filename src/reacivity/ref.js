import { isObject, hasChanged } from '../shared/index.js'
import { track, trigger } from './effect.js'
import { reactive, toRaw } from './reactive.js'

const convert = (val) => (isObject(val) ? reactive(val) : val)

// 判断是否是ref对象
export const isRef = (r) => !!(r && r.__v_isRef === true)

// 转化为ref对象
export function ref(rawValue) {
  // 如果已经是ref对象，直接返回
  if (isRef(rawValue)) return rawValue

  return new RefImpl(rawValue)
}

class RefImpl {
  constructor(_rawValue) {
    this._rawValue = _rawValue
    this._value = convert(_rawValue)
  }

  get value() {
    // 手动追踪 this.value
    track(toRaw(this), 'value')
    return this._value
  }

  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = convert(newVal)
      // 手动触发更新函数
      trigger(toRaw(this), 'value', 'set')
    }
  }
}
