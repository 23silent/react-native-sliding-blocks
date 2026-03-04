export const delay = (timeout = 500) =>
  new Promise(r => setTimeout(() => r(undefined), timeout))
