import { cloneDeep, each, isNull, isPlainObject } from 'lodash-es'

// url占位符替换
export function urlMatcher(url: string | undefined, params: Record<string, unknown> = {}): string {
  if (!url) return ''
  return url.replace(/\/:([^/]+)/g, (match, g1) => {
    return params[g1] ? '/' + params[g1] : ''
  })
}

// 清理无用参数
export function pruneParams(
  params: Record<string, unknown>,
  visible: Record<string, unknown>,
): Record<string, unknown> {
  const newParams = cloneDeep(params)
  each(newParams, (v, i) => {
    if (
      newParams[i] === '' ||
      isNull(newParams[i]) ||
      newParams[i] === '_all_' ||
      (isPlainObject(visible) && visible[i] === false)
    ) {
      delete newParams[i]
    }
  })
  return newParams
}

// 随机数
export function randomCode(): string {
  return (+new Date()).toString(32) + '-' + Math.random().toString(32).slice(2)
}

// 获取路径名称
export function getFileName(path: string): string {
  const fileMatch = path.match(/.*\/([^/]+)(\.\w+)$/)
  return fileMatch ? fileMatch[1] : path
}
