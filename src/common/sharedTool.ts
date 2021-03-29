import { urlMatcher } from '@/common/utils'
import { AxiosInstance, AxiosResponse, Method } from 'axios'
import { forEach, keys, merge } from 'lodash-es'
import useSWRV, { IConfig } from 'swrv'
import { App } from 'vue'
import { AxiosRequestConfigExtend } from './api'

const enumsMap: Record<string, EnumObject> = {}
export type EnumValue = string | number

export interface EnumList {
  value: EnumValue
  name: string
  color?: string
}

export interface EnumObjectBase {
  list: EnumList[]
  map: Map<EnumValue, string>
  colorMap: Map<EnumValue, string>
}

export interface EnumObject extends EnumObjectBase {
  [key: string]: EnumValue | Map<EnumValue, string> | EnumList[]
}

export default enumsMap

// export type EnumObject = EnumObjectBase & Partial<Record<string, string | number>>
// console.log(enums)
// const enums = import.meta.globEager('../pages/**/enums.ts')
// Object.keys(enums).forEach((e) => {
//   forEach(enums[e], (v, k) => {
//     // console.log(v, k)
//     if (enumsMap[k]) throw new Error(`${k}的enum名称重复`)
//     const enumObj: EnumObject = {
//       list: [],
//       map: new Map<EnumValue, string>(),
//       colorMap: new Map<EnumValue, string>(),
//     }
//     forEach(v, (v1, k1) => {
//       enumObj.list.push({
//         value: v1[0],
//         name: v1[1],
//         color: v1[2],
//       })
//       enumObj.map.set(v1[0], v1[1])
//       enumObj.colorMap.set(v1[0], v1[2])
//       enumObj[k1] = v1[0]
//     })
//     enumsMap[k] = enumObj
//   })
// })

// export default enumsMap

// 添加Enums到Vue
export function appendEnums(app: App, list = [], name = '', keyName = '', valueName = '') {
  const enums: Record<string, any> = {}
  const enumValues: Record<string, any[]> = (enums[name] = {})
  list.forEach((v, i) => {
    enumValues[name + '_' + i] = [v[keyName], v[valueName]]
  })
  setupEnums(app, enums, true)
}

// 装载枚举类型添加过滤器和列表
export function setupEnums(app: App, enums: Record<string, any>, silent = false) {
  if (!window.enumsList) window.enumsList = []
  const enumsList: string[] = window.enumsList
  keys(enums).every((k) => {
    if (app.config.globalProperties[k]) {
      if (!silent) throw new Error(`${k}的enum名称重复`)
      else return false
    }
    if (enumsList.find((v) => v === JSON.stringify(enums[k]))) {
      if (!silent) throw new Error(`${JSON.stringify(enums[k])}:${k}的enum列表重复`)
      else return false
    }
    enumsList.push(JSON.stringify(enums[k]))
    const enumObj = {
      list: [],
      map: new Map(),
      colorMap: new Map(),
    }
    forEach(enums[k], (v, k) => {
      // console.log(v, k)
      if (enumsMap[k]) throw new Error(`${k}的enum名称重复`)
      const enumObj: EnumObject = {
        list: [],
        map: new Map<EnumValue, string>(),
        colorMap: new Map<EnumValue, string>(),
      }
      forEach(v, (v1, k1) => {
        enumObj.list.push({
          value: v1[0],
          name: v1[1],
          color: v1[2],
        })
        enumObj.map.set(v1[0], v1[1])
        enumObj.colorMap.set(v1[0], v1[2])
        enumObj[k1] = v1[0]
      })
      enumsMap[k] = enumObj
    })

    app.config.globalProperties[k] = enumObj
    app.config.globalProperties[k + 'List'] = enumObj.list
    app.config.globalProperties[k + 'Map'] = enumObj.map
    app.config.globalProperties[k + 'ColorMap'] = enumObj.colorMap
    app.config.globalProperties[k + 'Format'] = (value: EnumValue, mapName: keyof EnumObject = 'map') => {
      const target = (enumObj as any)[mapName].get(value)
      return target ?? value
    }
    return true
  })
}

// 构造接口数据
export interface ApiConfig {
  name: string
  url: string
  methods: Method[]
  proxy?: string
  transformResponse?(res: string): AxiosResponse
}

export type ApiInstance = {
  [k in string]?:
    | Record<Method, (data: Record<string | number, any>, config: AxiosRequestConfigExtend) => any>
    | Record<string, any>
}

// 装载接口
export function setupApi(http: AxiosInstance, apis: Record<string, any>) {
  const apiMap: ApiInstance = {}
  const apiPaths: string[] = []
  //   const apis = import.meta.globEager('../pages/**/api.ts')
  // console.log(apis)
  Object.keys(apis).forEach((k) => {
    apis[k].default.forEach((v: ApiConfig) => {
      if (apiMap[v.name]) throw new Error(`${v.name}的API名称重复`)
      if (apiPaths.find((ap) => ap === v.url)) {
        throw new Error(`${v.url}接口路径重复`)
      }
      apiMap[v.name] = {}
      apiPaths.push(v.url)
      if (!Array.isArray(v.methods)) {
        throw new Error(`${v.name}的methods不是数组`)
      }
      v.methods.forEach((m: Method) => {
        apiMap[v.name]![m] = (
          data: any,
          config: AxiosRequestConfigExtend,
          swrConfig: IConfig = { revalidateOnFocus: false, revalidateDebounce: 1000 },
        ) => {
          const configObj: AxiosRequestConfigExtend = {}
          if (v.proxy) configObj.params = { _proxy: v.proxy }
          if (v.transformResponse) configObj.transformResponse = [v.transformResponse]

          /* eslint-disable indent */
          return m === 'get' || m === 'delete'
            ? useSWRV(
                urlMatcher(v.url, config?.pathParams),
                (url: string) => http[m](url, merge({ params: data }, configObj, config)).then((res) => res.data.data),
                swrConfig,
              )
            : useSWRV(
                urlMatcher(v.url, config?.pathParams),
                (url: string) =>
                  http[m](url, data, merge(configObj, config)).then((res: { data: { data: any } }) => res.data.data),
                swrConfig,
              )
          /* eslint-enable indent */
        }
      })
    })
  })
  return apiMap
}
