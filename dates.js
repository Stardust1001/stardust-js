
const _double = (number) => {
  return number >= 10 ? number : ('0' + number)
}

const replacers = {
  YYYY (date) {
    return date.getFullYear()
  },
  MM (date) {
    return _double(date.getMonth() + 1)
  },
  DD (date) {
    return _double(date.getDate())
  },
  HH (date) {
    return _double(date.getHours())
  },
  mm (date) {
    return _double(date.getMinutes())
  },
  ss (date) {
    return _double(date.getSeconds())
  }
}

export const format = (date, text, time = true) => {
  if (!text) {
    text = time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
  }
  if (typeof date === 'string' && date.indexOf('T') < 0) {
    date = date.replace(/-/g, '/')
  }
  date = new Date(date || '')
  if (isNaN(date)) {
    return ''
  }
  Object.keys(replacers).forEach(name => {
    if (text.indexOf(name) >= 0) {
      text = text.replace(name, replacers[name](date))
    }
  })
  return text
}

export const parse = (text, text = 'YYYY-MM-DD HH:mm:ss') => {
  const items = 'YYYY,MM,DD,HH,mm,ss'.split(',')
  let dateText = 'YYYY-MM-DD HH:mm:ss'
  for (let key of items) {
    const left = text.indexOf(key)
    if (left >= 0) {
      const right = left + key.length
      dateText = dateText.replace(key, text.slice(left, right))
    } else {
      dateText = dateText.replace(key, '00')
    }
  }
  return new Date(dateText)
}

export const convertIsoDates = (text) => {
  return text.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, e => format(e))
}

export default {
  format,
  parse,
  convertIsoDates
}
