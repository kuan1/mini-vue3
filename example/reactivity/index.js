import { reactive, effect } from '../../src/index.js'

const state = reactive({ a: { a: 1 }, b: 1, c: 1 })

const ef = effect(() => {
  state.a.a
  Object.keys(state)
  console.log('effect: ', state)
})

console.log('deps', ef.deps)

document.querySelector('button').onclick = function () {
  state.a.a += 1
  state.b += 1
  state.c += 1
}

state.d = 1

delete state.d
