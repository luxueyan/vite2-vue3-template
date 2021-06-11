import { earcut } from 'earcur';

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
  SYSTEMS: Record<string, string>
}

