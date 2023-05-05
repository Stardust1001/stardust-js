
export const split = (path) => {
  return path.split(/(\.|\[\d+\])/)
    .filter(leaf => leaf && leaf !== '.')
    .map(leaf => {
      if (leaf[0] === '[') {
        return Number(leaf.slice(1, -1))
      }
      return leaf
    })
}

export const get = (dict, key, defaults) => {
  const path = split(key)
  let branch = dict
  for (let i = 0, len = path.length; i < len; i++) {
    const leaf = path[i]
    if (branch[leaf]) {
      branch = branch[leaf]
    } else {
      return defaults
    }
  }
  return branch
}

export const set = (dict, key, value) => {
  const path = split(key)
  let branch = dict
  for (let i = 0, len = path.length; i < len; i++) {
    const leaf = path[i]
    if (!branch[leaf]) {
      if (i < len - 1) {
        if (Number.isInteger(path[i + 1])) {
          branch[leaf] = []
        } else {
          branch[leaf] = {}
        }
        branch = branch[leaf]
      } else {
        branch[leaf] = value
      }
    } else {
      if (i < len - 1 && typeof branch[leaf] !== 'object') {
        throw new Error('属性已存在，且不是对象类型')
      }
      if (i < len - 1) {
        branch = branch[leaf]
      } else {
        branch[leaf] = value
      }
    }
  }
}

export const mapField = (arr, key, value) => {
  const dict = {}
  arr.forEach(ele => {
    dict[ele[key]] = ele[value]
  })
  return dict
}

export default {
  split,
  get,
  set,
  mapField
}
