import enums, { EnumValue } from './sharedTool'

// 使用通用的枚举类型做内容格式化
type formatType = 'Color' | 'Value'
export default function useFormatMethods(formatList: string[], type: formatType = 'Value') {
  const formatFunctionMap: any = {}
  formatList.forEach((v) => {
    if (type === 'Value') {
      formatFunctionMap[v + type] = (value: EnumValue) => enums[v].map.get(value)
    } else {
      formatFunctionMap[v + type] = (value: EnumValue) => enums[v].colorMap.get(value)
    }
  })
  return formatFunctionMap
}
