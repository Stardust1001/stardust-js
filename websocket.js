
export const gzip = (pako, data) => {
  return pako.gzip(JSON.stringify(data), { to: 'string' })
}

export const ungzip = (pako, data) => {
  return JSON.parse(pako.ungzip(new Uint8Array(data), { to: 'string' }))
}

const split = (pako, data, maxBytes) => {
  const gzipped = gzip(pako, data)
  if (gzipped.length < maxBytes) {
    return [gzipped]
  } else {
    const total = Math.ceil(gzipped.length / maxBytes)
    const id = Date.now().toString(16)
    return Array.from({ length: total }).map((_, i) => {
      return {
        id,
        total,
        no: i + 1,
        data: gzipped.slice(i * maxBytes, (i + 1) * maxBytes)
      }
    })
  }
}

const slices = {}

const isBrowser = () => !!globalThis.document

const merge = (pako, data) => {
  slices[data.id] = slices[data.id] || []
  slices[data.id].push(data)
  if (slices[data.id].length === data.total) {
    const numBytes = slices[data.id].reduce((sum, p) => {
      return sum + (isBrowser() ? p.data.byteLength : p.data.length)
    }, 0)
    const all = new Uint8Array(numBytes)
    let index = 0
    slices[data.id].forEach(p => {
      const array = isBrowser() ? new Uint8Array(p.data) : p.data
      all.set(array, index)
      index += isBrowser() ? p.data.byteLength : p.data.length
    })
    delete slices[data.id]
    return ungzip(pako, all)
  }
}

export const gzipClient = (pako, client, options) => {
  options = {
    maxBytes: 1e6,
    ...options
  }
  const on = client.on
  client.on = (command, func) => {
    on.apply(client, [command, async data => {
      if (['disconnect'].includes(command)) {
        func(data)
      } else if (data instanceof Buffer) {
        func(ungzip(pako, data))
      } else {
        const merged = merge(pako, data)
        merged && func(merged)
      }
    }])
  }

  const emit = client.emit
  client.emit = (command, message) => {
    const slices = split(pako, message, maxBytes)
    slices.forEach(slice => {
      emit.apply(client, [command, slice])
    })
  }

  return client
}

export default {
  gzip,
  ungzip,
  gzipClient
}
