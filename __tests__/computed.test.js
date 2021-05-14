import { computed, effect, reactive } from '../src'

describe('computed', () => {
  it('应该返回跟新后的结果', () => {
    const value = reactive({})
    const cValue = computed(() => value.foo)
    expect(cValue.value).toBe(undefined)
    value.foo = 1
    expect(cValue.value).toBe(1)
  })

  it('应该触发effect', () => {
    const value = reactive({ foo: 0 })
    const cValue = computed(() => value.foo)
    let dummy
    effect(() => {
      dummy = cValue.value
    })
    expect(dummy).toBe(0)
    value.foo = 1
    expect(dummy).toBe(1)
  })

  it('computed链式工作', () => {
    const value = reactive({ foo: 0 })
    const c1 = computed(() => value.foo)
    const c2 = computed(() => c1.value + 1)
    expect(c1.value).toBe(0)
    expect(c2.value).toBe(1)
    value.foo++
    expect(c1.value).toBe(1)
    expect(c2.value).toBe(2)
  })
})
