import { LocalState } from '@/store/index'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import createDebug from 'debug'
import qs from 'qs'
import { Store } from 'vuex'

export type AxiosRequestConfigExtend = AxiosRequestConfig & {
  noAlert?: boolean // 不弹出错误提示
  skipAuth?: boolean // 不走权限校验，403不会跳到登录页
  loadingMaskTarget?: string // ajax请求的遮罩层
  pathParams?: Record<string, string | number> // url动态参数
}

const debug = createDebug('common:api')
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

export default function createHttp({ store }: { store: Store<LocalState> }) {
  const http: AxiosInstance = axios.create({
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
      if (!data.code || data.code === 0) {
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
  return http
}
