import { defineComponent, computed, withDirectives, ref, vShow, VNode, watchEffect, watch } from 'vue'
import { useStore } from 'vuex'
import Api from '@/common/api'
import createDebug from 'debug'
import { RouterLink, onBeforeRouteLeave } from 'vue-router'
import { Button } from 'ant-design-vue'
// import { useI18n } from 'vue-i18n'
// import DtIcon from '@/components/DtIcon'

// import { User } from './model/user'
const debug = createDebug('pages:auth')

export default defineComponent((props, ctx) => {
  debug(props, ctx)
  const store = useStore()
  const count = ref(0)
  // const { t } = useI18n()

  const _fetchData = () => {
    const { data, isValidating } = Api.auth?.get()
    return { data, isValidating }
  }
  const { data, isValidating } = _fetchData()
  // debug(data, data.value?.userId)

  watchEffect(() => debug(count.value)) // 不指定，自动收集使用的响应式对象作为依赖

  // watch(
  //   data,
  //   () => debug('watch'), // 指定依赖对象
  // )

  onBeforeRouteLeave(() => {
    debug('onBeforeRouteLeave')
    return true // true is ok
  })

  onBeforeRouteLeave((to, from, next) => {
    debug('onBeforeRouteLeave2')
    next() // call next is ok
  })

  const auth = computed(() => store.state.auth.auth)
  const userName = () => {
    if (data.value) {
      return <div>userName: {data.value.userId}</div>
    }
    return <div> user is loading </div>
  }

  // console.log(auth.value)
  return () => (
    <div>
      <RouterLink to={{ name: 'demo' }}>{() => 'to demo'}</RouterLink>
      {userName()}
      {/* 使用指令来控制显示和隐藏，目前还不支持v-if这样的语法糖 */}
      {withDirectives((<div>use directive: loading</div>) as VNode, [[vShow, !data.value && isValidating.value]])}
      {/* <div v-if={!data.value && isValidating.value}>loading</div> */}
      auth page{auth.value}
      <Button type="primary" onClick={() => count.value++}>
        {() => count.value}
      </Button>
      {/* <p>{t('global.404')}</p> */}
      {/* <DtIcon name="warning2"></DtIcon> */}
      {/* <DtIcon name="warning"></DtIcon> */}
    </div>
  )
})
