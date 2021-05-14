import { reactive, effect } from '../src'

describe('effect', () => {
  it('测试effect函数包装，会被执行一次', () => {
    const fn = jest.fn(() => {})
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('测试响应式对象属性拦截', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))
    expect(dummy).toBe(0)
    counter.num = 7
    expect(dummy).toBe(7)
  })

  it('测试响应式对象多个属性拦截', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 * counter.num2))

    expect(dummy).toBe(0)

    counter.num1 = counter.num2 = 3
    expect(dummy).toBe(9)
  })

  it('测试多个effects', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => (dummy1 = counter.num))
    effect(() => (dummy2 = counter.num))
    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num++
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
  })

  it('测试嵌套属性', () => {
    let dummy
    const counter = reactive({ nested: { num: 1 } })
    effect(() => (dummy = counter.nested.num))
    expect(dummy).toBe(1)
    counter.nested.num = 8
    expect(dummy).toBe(8)
  })

  it('测试响应对象has', () => {
    let dummy
    const state = reactive({ prop: 'value' })
    effect(() => (dummy = 'prop' in state))
    expect(dummy).toBe(true)
    delete state.prop
    expect(dummy).toBe(false)
    state.prop = 12
    expect(dummy).toBe(true)
  })
})
