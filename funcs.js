
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

export const encodeQuery = data => {
  const arr = Array.isArray(data) ? data : Object.entries(data)
  const query = new URLSearchParams()
  arr.forEach(([k, v]) => {
    query.append(k, v == null ? '' : v)
  })
  return query.toString()
}

export const decodeQuery = search => {
  if (search.startsWith('http')) {
    search = new URL(search).search
  }
  const query = new URLSearchParams(search)
  return [...query].reduce((dict, [k, v]) => ({ ...dict, [k]: v }), {})
}

export default {
  sleep,
  deepCopy,
  encodeQuery,
  decodeQuery
}
