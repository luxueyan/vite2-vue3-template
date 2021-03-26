import qs from 'qs'
import axios, { Method, AxiosRequestConfig, AxiosResponse } from 'axios'
import { urlMatcher } from '@/common/utils'
// import { isObject } from 'lodash'
import Enums from '@/common/enums'
import store from '@/store'
import createDebug from 'debug'
import { merge } from 'lodash-es'
// import apis from 'globby!@/pages/**/api.ts'
import useSWRV, { IConfig } from 'swrv'

type AxiosRequestConfigExtend = AxiosRequestConfig & {
  noAlert?: boolean // 不弹出错误提示
  skipAuth?: boolean // 不走权限校验，403不会跳到登录页
  loadingMaskTarget?: string // ajax请求的遮罩层
  pathParams?: Record<string, string | number> // url动态参数
}

const debug = createDebug('common:api')
const { RetCode } = Enums
// console.log(RetCode)
const i18n = { t: (msg: string) => {} } // eslint-disable-line
// const store = useStore()
const Toast = {
  loading(any: { message: string; forbidClick: boolean; loadingType: string }) {
    debug(any)
  },
}
const loadingInstances: Record<string, any> = {}

function msgBoxErr(message: string, code: string | number) {
  alert(message + code)
  // Notify({
  //   message: message,
  //   type: 'warning',
  // })
}

function getContentType(headers: { [x: string]: string | string[] }) {
  if (headers['Content-Type'] && ~headers['Content-Type'].indexOf('x-www-form-urlencoded')) {
    return 'urlencoded'
  } else if (headers['Content-Type'] && ~headers['Content-Type'].indexOf('application/json')) {
    return 'json'
  }
  return ''
}
function closeLoading(url: string) {
  const loadingInstance = loadingInstances[url]
  if (loadingInstance) {
    loadingInstance.clear()
    delete loadingInstances[url]
  }
}

// 后端处理不了登录时候密码错误的提示英文信息
function diposeInvalidGrant(error = ''): string {
  /*eslint-disable*/
  return ~error.indexOf('invalid_grant') ? '用户名或密码错误' : ~error.indexOf('invalid_token') ? '权限验证失败' : error
  /*eslint-enable*/
}

function getLoadingUrl(config: AxiosRequestConfig) {
  if (!config.paramsSerializer) return ''
  return (
    config.url +
    (config.data
      ? getContentType(config.headers) === 'json'
        ? config.paramsSerializer(JSON.parse(config.data))
        : config.data
      : '') +
    config.paramsSerializer(config.params)
  )
}

export const http = axios.create({
  baseURL: <string>import.meta.env.VITE_API_BASE,
  timeout: 90000,
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
  transformRequest: [
    (data, headers) => {
      const contentType = getContentType(headers)
      if (data && contentType === 'urlencoded') {
        return qs.stringify(data)
      } else if (data && contentType === 'json') {
        return JSON.stringify(data)
      }
      return data
    },
  ],
})
http.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
http.interceptors.request.use((config: AxiosRequestConfigExtend) => {
  // store.state.token是认证系统， window.token多页面其他系统
  if (store.state.token && !config.headers.common.Authorization) {
    // config.headers.common['Authorization'] = 'Bearer ' + store.state.token
    config.headers.common.Authorization = store.state.token
  }
  // config.url = urlMatcher(config.url, config.pathParams)

  if (config.loadingMaskTarget) {
    const loadingUrl =
      (config?.baseURL || '') +
      (config?.url || '') +
      (getContentType(config.headers) === 'json' ? config.paramsSerializer!(config.data) : config.data) +
      config.paramsSerializer!(config.params)
    closeLoading(loadingUrl)

    loadingInstances[loadingUrl] = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    })
  }
  return config
})
http.interceptors.response.use(
  (res) => {
    closeLoading(getLoadingUrl(res.config))
    // console.log(res.config)
    const data = res.data
    const config: AxiosRequestConfigExtend = res.config
    // data.result ||= data.Result
    // console.log(RetCode.ERR, data)
    // debugger
    if (!data.code || data.code === RetCode.OK) {
      return res
    } else if (config.noAlert) {
      return Promise.reject(res)
    } else {
      msgBoxErr(data.msg || '请求失败！', data.code)
    }

    return Promise.reject(res)
  },
  (err) => {
    debug(err, JSON.parse(JSON.stringify(err)))
    err.config && closeLoading(getLoadingUrl(err.config))
    if (err.response) {
      const status = err.response.status
      // if (isObject(err.response.data)) { // 暂时先注释，不知道为什么不报错就是影响加载
      //   err.response.data.msg = err.response.data.msg || err.response.data.Msg
      // }
      if (err.response.config.noAlert) return Promise.reject(err)
      // const router = store._router
      // if (status === 401 || status === 419 || status === 403) {
      if (status === 401 || status === 419) {
        if (err.response.config.skipAuth) {
          store.dispatch('logout', { silent: true })
          return Promise.reject(err)
        } else {
          store.dispatch('logout', { silent: false })
          msgBoxErr(diposeInvalidGrant(err.response.data.msg) || '权限错误', 400)
          return Promise.reject(err)
        }
      } else if (status === 400 || status === 400) {
        msgBoxErr(diposeInvalidGrant(err.response.data.msg) || '请求失败', 400)
        return Promise.reject(err)
      } else if (status === 478) {
        msgBoxErr(diposeInvalidGrant(err.response.data.msg) || '请求失败', 400)
        return Promise.reject(err)
      }
      msgBoxErr('服务器忙', status)
      return Promise.reject(err)
    }
    if (!err.config.noAlert) {
      msgBoxErr(err.message.indexOf('timeout') > -1 ? '请求超时' : '服务器忙', 'SERVER')
    }
    return Promise.reject(err)
  },
)

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

const apiMap: ApiInstance = {}
const apiPaths: string[] = []
const apis = import.meta.globEager('../pages/**/api.ts')
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
              (url: string) => http[m](url, data, merge(configObj, config)).then((res: { data: { data: any } }) => res.data.data),
              swrConfig,
            )
        /* eslint-enable indent */
      }
    })
  })
})

export default apiMap
