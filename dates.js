
export class $Date extends Date {
  static parse (text, fmat) {
    return new $Date(parse(text, fmat))
  }

  add (number, unit) {
    const ms = ({
      week: 864e5 * 7,
      day: 864e5,
      hour: 36e5,
      minute: 6e4,
      second: 1e3
    })
    if (unit in ms) {
      return new $Date(this.getTime() + number * ms[unit])
    }
    let [year, month, day, hour, minute, second] = format(this, 'YYYY:MM:DD:HH:mm:ss').split(':').map(Number)
    switch (unit) {
      case 'year': { year ++; break }
      case 'month': { month += number; break }
    }
    return new $Date(year, month - 1, day, hour, minute, second)
  }

  minus (number, unit) {
    return this.add(-number, unit)
  }

  diff (date) {
    return this.getTime() - new Date(date).getTime()
  }

  to (fmat, time = true) {
    return format(this, fmat, time)
  }

  toDateTime () {
    return format(this, '', true)
  }

  toDate () {
    return format(this, '', false)
  }

  toTime () {
    return format(this, 'HH:mm:ss')
  }
}

export const now = () => new $Date()

const _double = (number) => {
  return number >= 10 ? number : ('0' + number)
}

const _replacers = {
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

export const format = (date, fmat, time = true) => {
  if (!fmat) {
    fmat = time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
  }
  if (typeof date === 'string' && date.indexOf('T') < 0) {
    date = date.replace(/-/g, '/')
  }
  date = new Date(date || '')
  if (isNaN(date)) {
    return ''
  }
  Object.keys(_replacers).forEach(name => {
    if (fmat.indexOf(name) >= 0) {
      fmat = fmat.replace(name, _replacers[name](date))
    }
  })
  return fmat
}

export const parse = (text, fmat = 'YYYY-MM-DD HH:mm:ss') => {
  const items = 'YYYY,MM,DD,HH,mm,ss'.split(',')
  let dateText = 'YYYY-MM-DD HH:mm:ss'
  for (let key of items) {
    const left = fmat.indexOf(key)
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
  $Date,
  now,
  format,
  parse,
  convertIsoDates
}
