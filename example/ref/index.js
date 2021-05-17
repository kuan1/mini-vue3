import { ref, effect } from '../../src/index.js'

const val = ref(1)

effect(() => {
  console.log('effect', val.value)
})

val.value = 2
val.value = 3
val.value = 4
