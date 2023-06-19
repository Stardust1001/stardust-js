
const has = Object.prototype.hasOwnProperty

function Events () { }
Events.prototype = Object.create(null)

function EE (fn, context, once) {
  this.fn = fn
  this.context = context
  this.once = once || false
}

function addListener (emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function')
  }

  const listener = new EE(fn, context || emitter, once)

  if (!emitter._events[event]) {
    emitter._events[event] = listener
    emitter._eventsCount ++
  } else if (!emitter._events[event].fn) {
    emitter._events[event].push(listener)
  } else {
    emitter._events[event] = [emitter._events[event], listener]
  }

  return emitter
}

function clearEvent (emitter, event) {
  if (--emitter._eventsCount === 0) {
    emitter._events = new Events()
  } else {
    delete emitter._events[event]
  }
}

function EventEmitter () {
  this._events = new Events()
  this._eventsCount = 0
}

EventEmitter.prototype.eventNames = function () {
  if (this._eventsCount === 0) {
    return []
  }
  const names = []
  const events = this._events
  for (let name in events) {
    if (has.call(events, name)) {
      names.push(name)
    }
  }
  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events))
  }
  return names
}

EventEmitter.prototype.listeners = function (event) {
  const handlers = this._events[event]
  if (!handlers) {
    return []
  }
  if (handlers.fn) {
    return [handlers.fn]
  }
  return handlers.map(h => h.fn)
}

EventEmitter.prototype.listenerCount = function (event) {
  const listeners = this._events[event]
  if (!listeners) return 0
  if (listeners.fn) return 1
  return listeners.length
}

EventEmitter.prototype.emit = function (event, ...props) {
  if (!this._events[event]) return false
  const listeners = this._events[event]
  if (listeners.fn) {
    if (listeners.once) {
      this.removeListener(event, listeners.fn, undefined, true)
    }
    listeners.fn.apply(listeners.context, props)
  } else {
    const len = listeners.length
    for (let i = 0; i < len; i++) {
      listeners[i].fn.apply(listeners[i].context, props)
    }
  }
  return true
}

EventEmitter.prototype.asyncEmit = async function (event, ...props) {
  if (!this._events[event]) return false
  const listeners = this._events[event]
  if (listeners.fn) {
    if (listeners.once) {
      this.removeListener(event, listeners.fn, undefined, true)
    }
    await listeners.fn.apply(listeners.context, props)
  } else {
    const len = listeners.length
    for (let i = 0; i < len; i++) {
      await listeners[i].fn.apply(listeners[i].context, props)
    }
  }
  return true
}

EventEmitter.prototype.on = function (event, fn, context) {
  return addListener(this, event, fn, context, false)
}

EventEmitter.prototype.once = function (event, fn, context) {
  return addListener(this, event, fn, context, true)
}

EventEmitter.prototype.removeListener = function (event, fn, context, once) {
  if (!this._events[event]) return this
  if (!fn) {
    clearEvent(this, event)
    return this
  }
  const listeners = this._events[event]
  if (listeners.fn) {
    if (
      listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      clearEvent(this, event)
    }
  } else {
    const events = listeners.filter(l => {
      return l.fn !== fn
        || (once && !l.once)
        || (context && l.context !== context)
    })
    if (events.length) {
      this._events[event] = events.length === 1 ? events[0] : events
    } else {
      clearEvent(this, event)
    }
  }
  return this
}

EventEmitter.prototype.removeAllListeners = function (event) {
  if (event) {
    if (this._events[event]) {
      clearEvent(this, event)
    }
  } else {
    this._events = new Events()
    this._eventsCount = 0
  }
  return this
}

EventEmitter.prototype.off = EventEmitter.prototype.removeListener
EventEmitter.prototype.addListener = EventEmitter.prototype.on

EventEmitter.EventEmitter = EventEmitter

const emitter = new EventEmitter()

export {
  EventEmitter
}

export default {
  emit: emitter.emit.bind(emitter),
  asyncEmit: emitter.asyncEmit.bind(emitter),
  once: emitter.once.bind(emitter),
  on: emitter.on.bind(emitter),
  EventEmitter
}
