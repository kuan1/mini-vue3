import { reactive } from '../reacivity/index.js'
import { createContext } from './context.js'
import { toDisplayString } from './directives/text.js'
import { nextTicket } from './scheduler.js'
import { Block } from './block.js'

export const createApp = (initialData) => {
  const ctx = createContext()

  if (initialData) {
    ctx.scope = reactive(initialData)
  }

  // 全局内部函数
  ctx.scope.$s = toDisplayString
  ctx.scope.$nextTick = nextTicket
  ctx.scope.$refs = Object.create(null)

  let rootBlocks = []

  return {
    mount(el) {
      rootBlocks = [new Block(el, ctx, true)]
      console.log(rootBlocks[0])
      return this
    },
    unmount() {
      rootBlocks.forEach((block) => block.teardown())
    },
  }
}
