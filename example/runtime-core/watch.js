import { reactive } from '../../src/reacivity/index.js'
import { watch } from '../../src/runtime-core/index.js'

const state = reactive({})

// 支持reactive
watch(state, () => {
  console.log('proxy', state)
})

state.a = 1

state.b = 2

state.b = 3

const state2 = reactive({})

// 支持函数
watch(
  () => state2,
  () => {
    console.log('proxy2', state2)
  }
)

state2.a = 1

state2.b = 2

state2.c = 3
