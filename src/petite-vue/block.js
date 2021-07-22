import { stop } from '../reacivity/index.js'
import { createContext } from './context.js'

export class Block {
  constructor(template, parentCtx, isRoot = false) {
    this.isFragment = template instanceof HTMLTemplateElement

    if (isRoot) {
      this.template = template
    } else if (this.isFragment) {
      this.template = template.content.cloneNode(true)
    } else {
      this.template = template.cloneNode(true)
    }

    if (isRoot) {
      this.ctx = parentCtx
    } else {
      this.parentCtx = parentCtx
      parentCtx.blocks.push(this)
      this.ctx = createContext(parentCtx)
    }
    // walk todo
  }

  teardown() {
    this.ctx.blocks.forEach((child) => {
      child.teardown()
    })
    this.ctx.effects.forEach(stop)
    this.ctx.cleanups.forEach((fn) => fn())
  }
}
