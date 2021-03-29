<template>
  <div class=""></div>
</template>

<script>
export default {
  name: 'DtWebSocket',
  components: {},
  props: {
    url: { type: String, default: '' }, // 协议链接
    delay: { type: Number, default: 3000 }, // 单位 ms， 心跳检测间隔
    maxCount: { type: Number, default: 3 }, // 检测 maxCount 次无响应，则重连
    // 心跳检测发送的消息
    heartMsg: {
      type: [Object, String],
      default: () => {
        return { action: 'heartCheck' }
      },
    },
    autoReconnect: { type: Boolean, default: true }, // 发生错误自动重连
  },
  data() {
    return {
      ws: '',
      message: [],
      heartCount: 0,
    }
  },

  computed: {
  },
  
  watch: {
    url(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.connect()
      }
    },
  },
  mounted() {
    this.connect()
  },

  methods: {
    connect() {
      if (!this.url) return
      this.ws = new WebSocket(this.url)
      this.ws.onopen = evt => {
        this.lived()
        this.$emit('onOpen', evt)
      }

      this.ws.onmessage = ({ data }) => {
        this.lived()
        if (typeof data === 'string') data = JSON.parse(data)
        this.$emit('onMessage', data)
      }

      this.ws.onclose = evt => {
        this.$emit('onClose', evt)
      }
      this.ws.onerror = evt => {
        this.$emit('onError', evt)
        // if (this.autoReconnect) this.connect()
      }
      this.heartCheck()
    },

    send(msg) {
      if (this.ws.readyState !== WebSocket.OPEN) return
      if (typeof msg === 'object' && msg !== null) msg = JSON.stringify(msg)
      this.ws.send(msg)
    },

    // 心跳检测
    heartCheck() {
      setTimeout(() => {
        if (this.heartCount > this.maxCount) {
          this.connect()
          return
        }
        this.send(this.heartMsg)
        this.heartCount++
        this.heartCheck()
      }, this.delay)
    },

    lived() {
      this.heartCount = 0
    },

    close() {
      this.ws.close()
    },
  },
}
</script>
