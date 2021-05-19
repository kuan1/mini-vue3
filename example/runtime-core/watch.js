import { reactive } from '../../src/index.js'
import { watch } from '../../src/runtime-core/index.js'

const state = reactive({})

watch(state, () => {
  console.log(state)
})

state.a = 1
