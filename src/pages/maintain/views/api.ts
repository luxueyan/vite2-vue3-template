export default [
  {
    name: 'user',
    url: '/api/v1/user',
    methods: ['get', 'post'],
    transformResponse(resStr: string) {
      let res
      try {
        res = JSON.parse(resStr)
        // debugger
        if (res.status !== 200) return res
        // console.log(res.data)
        const newData = {
          user: res.data.user,
          userId: res.data.userId,
          userName: res.data.user_name,
          token: res.data.token,
          role: res.data.role,
        }
        res.data = newData
      } catch (e) {
        return { code: 1000, message: '接口返回结构错误！' }
      }

      return res
    },
    proxy: 'local',
  },
]
