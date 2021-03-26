import { defineComponent, ref } from 'vue'
import styles from './demo.module.css'
// import imgs from 'globby!/@/assets/image/**/*.@(jpg|png)'
import './demo.css'
import { customProperties } from '@/assets/css/_var.mjs'
import createDebug from 'debug'
// import enums from '/@/common/enums'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
// import Api from '/@/common/api'
// import router from '/@/router'
// import {Component} from 'vue'
// console.log(Component)
const debug = createDebug('pages:demo')

// console.log(Api, 'Api')
debug('css和js共享：', styles, customProperties)

// debug(imgs)
// console.log(v, V)
// console.log(defineComponent, ref);
// const count2 = ref(0)
const Btn = defineComponent(() => {
  const count = ref(0)
  const increment = () => {
    count.value++
  }
  return () => <div onClick={increment}>BTN：{count.value}</div>
})

const count = ref(1)
const increment = () => {
  count.value++
  // console.log(count.value);
}
function Parent() {
  return (
    <div onClick={increment} class={styles.demo + ' demo'}>
      父组件传值：
      <Child class={['child']} jsx={<span class="child-blue">jxs as props</span>}>
        {() => count.value}
      </Child>
    </div>
  )
}

function Child(props: { class: any[]; jsx: any }, context: { slots: { default: () => any } }) {
  debug('%O', props, context)
  return (
    <span class={props.class[0]}>
      {props.jsx}
      {context.slots.default()}
    </span>
  )
}

export default defineComponent((props, context) => {
  debug('%o', props, context)
  const count = ref(0)
  const increment = () => {
    count.value++
  }

  const route = useRoute()
  const router = useRouter()
  debug('%o', route, router)

  return () => (
    <section>
      <RouterLink to={{ name: 'auth' }}>{() => 'to auth'}</RouterLink>
      <h3>我的 demo</h3>
      <Parent></Parent>
      <Btn></Btn>
      <button onClick={increment}>
        按钮<span>{count.value}</span>
      </button>
      <div>
        icons:
        <i class="icon-1">1</i>
        <i class="icon-3">3</i>
        <i class="icon-4">4</i>
      </div>
      <HelloWorld msg={'hello msg'}></HelloWorld>
    </section>
  )
})
