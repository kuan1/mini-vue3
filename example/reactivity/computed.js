import { reactive, computed } from '../../src/index.js'

const state = reactive({ a: 1 })

const r = computed(() => state.a)

console.log(r.value)

state.a = 2

console.log(r.value)

state.a = 3

console.log(r.value)
