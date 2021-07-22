let queued = false

const queue = []
const p = Promise.resolve()

export const nextTicket = (fn) => p.then(fn)

export const queueJob = (job) => {
  if (!queue.includes(job)) queue.push(job)
  if (!queued) {
    queue = true
    nextTicket(flushJobs)
  }
}

const flushJobs = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]()
  }
  queue.length = 0
  queued = false
}
