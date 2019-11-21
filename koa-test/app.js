const Koa = require('koa');
const KoaLike = require('./koa2-like')
// const app =  new Koa();
const app = new KoaLike();

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx['X-Response-Time'];
    console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx['X-Response-Time'] = `${ms}ms`
});

// response

app.use(async ctx => {
    // ctx.body = 'Hello World';
    ctx.res.end('hello koa2-like')
});

app.listen(3000);