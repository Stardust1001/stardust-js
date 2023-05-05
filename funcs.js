
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const deepCopy = (obj) => {
  if (
    obj === null ||
    obj instanceof Date ||
    typeof obj !== 'object'
  ) {
    return obj
  }
  const cn = Array.isArray(obj) ? [] : { }
  Object.keys(obj).forEach(key => {
    cn[key] = deepCopy(obj[key])
  })
  return cn
}

export default {
  sleep,
  deepCopy
}
