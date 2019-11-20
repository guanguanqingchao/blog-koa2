const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const redisStore = require('koa-redis');
const session = require('koa-generic-session');

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')

const fs = require('fs')
const path = require('path')
const morgan = require('koa-morgan')

const {
  REDIS_CONF
} = require('./conf/db')
// error handler
onerror(app)

// middlewares
// 处理post格式
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(logger()) //美化控制台打印格式

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

//日志
const env = process.env.NODE_ENV || 'dev'
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log', 'access.log'), {
  flags: 'a'
})

app.use(morgan('combined', {
  stream: accessLogStream
}))


//session
app.keys = ['Wj_guan2 * cat'];
app.use(session({
  store: redisStore({
    // Options specified here
    // <https://github.com/luin/ioredis#sentinel>
    // sentinels: [{
    //     host: 'localhost',
    //     port: 26379
    //   },
    //   {
    //     host: 'localhost',
    //     port: 26380
    //   }
    //   // ...
    // ],
    // all: '127.0.0.1:6379',
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
    name: 'mymaster'
  }),
  //配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //one day in ms,
    overwrite: true,
    signed: true
  }

}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes 
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app