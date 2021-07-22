import { effect as rawEffect, reactive } from '../reacivity/index.js'

import { inOnce } from './walk.js'
import { queueJob } from './scheduler.js'

export const createContext = (parent) => {
  const ctx = {
    ...parent,
    scope: parent ? parent.scope : reactive({}),
    dirs: parent ? parent.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (fn) => {
      if (inOnce) {
        queueJob(fn)
        return fn
      }
      const e = rawEffect(fn, {
        scheduler: () => queueJob(e),
      })
      ctx.effect.push(e)
      return e
    },
  }
  return ctx
}
