export const toDisplayString = (value) =>
  value == null ? '' : isObject(value) ? JSON.stringify(value, null, 2) : String(value)
