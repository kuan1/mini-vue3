export const isObject = (val) => val !== null && typeof val === 'object'

export const isArray = Array.prototype.isArray

export const isFunction = (val) => typeof val === 'function'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val, key) => hasOwnProperty.call(val, key)

export const isSymbol = (val) => typeof val === 'symbol'

export const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map((key) => Symbol[key])
    .filter(isSymbol)
)

export const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue)
