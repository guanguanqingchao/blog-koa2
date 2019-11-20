const router = require('koa-router')()

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
  const {
    username,
    password
  } = ctx.request.body

  const loginRes = await login(username, password)

  if (loginRes.username) {
    //将用户信息存贮到session中
    req.session.username = val.username;
    req.session.realname = val.realname;

    ctx.body = new SuccessModel()
    return

  } else {
    ctx.body = new ErrorModel('账号密码错误')
  }

})





module.exports = router