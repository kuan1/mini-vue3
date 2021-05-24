import { reactive } from '../../src/reacivity/index.js'
import { watch } from '../../src/runtime-core/index.js'

const state = reactive({})

watch(state, () => {
  console.log('proxy', state)
})

state.a = 1

state.b = 2

state.b = 3

const state2 = reactive({})

watch(
  () => state2,
  () => {
    console.log('proxy2', state2)
  }
)

state.a = 1

state.b = 2

state.c = 3
