import { reactive } from '../src/index.js'

describe('reactive', () => {
  it('Object', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.__v_raw).toBe(original)
    // get
    expect(observed.foo).toBe(1)
    // has
    expect('foo' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['foo'])
  })

  it('loop reactive', () => {
    const state = reactive({ foo: { a: 1 } })
    expect(state.__v_isReactive).toBe(true)
  })
})
