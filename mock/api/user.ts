export default {
  // 支持值为 Object 和 Array
  'GET /auth': async (ctx) => {
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 1000)
    // })
    ctx.jsonOk({
      userId: 1,
      userName: 'admin',
    })
  },
}
