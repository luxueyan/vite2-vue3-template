import enums, { EnumValue } from './enums'

// 使用通用的枚举类型做内容格式化
type formatType = 'Color' | 'Value'
export default function useFormatMethods(formatList: string[], type: formatType = 'Value') {
  const formatFunctionMap = {}
  formatList.forEach((v) => {
    if (type === 'Value') {
      formatFunctionMap[v + type] = (value: EnumValue) => enums[v].map.get(value)
    } else {
      formatFunctionMap[v + type] = (value: EnumValue) => enums[v].colorMap.get(value)
    }
  })
  return formatFunctionMap
}
