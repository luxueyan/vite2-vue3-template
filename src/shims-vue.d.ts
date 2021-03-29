import 'vue-router'
import { Router } from 'vue-router'

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.mjs' {
  export default interface {
    [key: string]: string
  }
}

interface Window {
  enumsList: string[]
}

declare module 'vue-router' {
  // import { RouteRecordRaw } from 'vue-router'
  export interface Router {
    openInTab(route: RouteRecordRaw): void
    smartBack(route: RouteRecordRaw): void
  }
}

declare module 'vuex' {
  export interface Store<S> {
    _router: Router
  }
}

// export declare interface LocalMeta {
//   authorities: string[]
// }
