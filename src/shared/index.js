export const isObject = (val) => val !== null && typeof val === 'object'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val, key) => hasOwnProperty.call(val, key)

export const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue)
