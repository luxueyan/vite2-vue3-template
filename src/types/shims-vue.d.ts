import { Router } from 'vue-router'

declare module 'vue-router' {
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

interface CustomEventInit<T = any> extends EventInit {
  detail?: T;
}
