import { reactive, effect } from '../src/index.js'

const state = reactive({ a: { a: 1 }, b: 1, c: 1 })

const ef = effect(() => {
  state.a.a
  state.b
  state.c
  console.log('effect: ', state.__v_raw)
  document.querySelector('pre').innerHTML = JSON.stringify(state, null, 2)
})

console.log('deps', ef.deps)

document.querySelector('button').onclick = function () {
  state.a.a += 1
  state.b += 1
  state.c += 1
}
