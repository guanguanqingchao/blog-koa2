const router = require('koa-router')()

const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')

const {
    getList,
    getDetail,
    updateBlog,
    newBlog,
    deleteBlog
} = require('../controller/blog')

const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {

    const {
        author,
        keyword
    } = ctx.query

    const listRes = await getList(author, keyword)
    ctx.body = new SuccessModel(listRes)
})

router.get('/detail', async function (ctx, next) {
    const {
        id
    } = ctx.query
    const detailResult = await getDetail(id)
    ctx.body = new SuccessModel(detailResult)

});

router.post('/new', loginCheck, async (ctx, next) => {

    ctx.request.body.author = ctx.session.username

    const createResult = await newBlog(ctx.request.body)

    ctx.body = new SuccessModel(createResult)


})


router.post('/del', loginCheck, async (ctx, next) => {

    const {
        id
    } = ctx.request.body

    const author = ctx.session.username //防止其他人删除除自己之外的博客

    const delRes = await deleteBlog(id, author)

    if (delRes) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }


})


router.post('/update', loginCheck, async (ctx, next) => {

    const updateRes = await updateBlog(ctx.query.id, ctx.request.body)

    if (updateRes) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }

})

module.exports = router