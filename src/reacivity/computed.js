import { effect, track, trigger } from './effect.js'
import { toRaw } from './reactive.js'

// 仅写支持Function
export function computed(getter) {
  return new ComputedRefImpl(getter)
}

class ComputedRefImpl {
  constructor(getter) {
    this._value = null
    this._dirty = true
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          // 手动触发computed.value对应的effect函数
          trigger(toRaw(this), 'value', 'set')
        }
      },
    })
  }
  get value() {
    const self = toRaw(this)
    if (self._dirty) {
      self._value = this.effect()
      this._dirty = false
    }
    // 收集 value effect
    track(self, 'value')
    return self._value
  }
  set value(newValue) {
    console.warn(`set value fail, computed value is readonly`, newValue)
  }
}
