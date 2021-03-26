// import * as enums from 'globby!/@/pages/**/enums.ts'
import { forEach } from 'lodash-es'

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

// export type EnumObject = EnumObjectBase & Partial<Record<string, string | number>>
// console.log(enums)
const enums = import.meta.globEager('../pages/**/enums.ts')
Object.keys(enums).forEach((e) => {
  forEach(enums[e], (v, k) => {
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
})

export default enumsMap
