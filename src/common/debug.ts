import createDebug from 'debug'

export const error = createDebug('app:error')
export const warn = createDebug('app:warn')
export const info = createDebug('app:info')
export const debug = createDebug('app:debug')
