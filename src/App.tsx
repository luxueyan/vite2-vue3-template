import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const App = defineComponent(() => {
  return () => (
    <div>
      <RouterView />
    </div>
  )
})

export default App
