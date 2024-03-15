export const deconcurrent = fetcher => {
  let promise = null
  const func = async (...props) => {
    const data = await fetcher(...props)
    promise = null
    return data
  }
  return (...props) => promise ||= func(...props)
}

export const schedule = async (psGen, total = 0, limit = 20) => {
  if (!total) return []

  let doing = 0
  let current = 0
  const results = {}

  return new Promise(resolve => {
    const isDone = () => {
      let ok = false
      if (typeof total === 'number') {
        ok = current >= total - 1
      } else if (typeof total === 'function') {
        ok = total(current)
      } else {
        throw 'unknown type of total'
      }
      if (ok && !doing) {
        resolve(Object.values(results))
      }
      return ok
    }

    const fork = () => {
      const ps = psGen(current)
      const id = current
      ++doing
      ps.then(result => {
        results[id] = result
        doing --
        if (!isDone()) {
          ++current
          fork()
        }
      })
    }
    for (let i = 0; i < limit; i++) {
      current = i
      fork()
      if (isDone()) break
    }
  })
}

export default {
  deconcurrent,
  schedule
}
