const Koa = require('koa')
const mongoose = require('mongoose')
const error = require("koa-json-error")
const parameter = require('koa-parameter')
const koaBody = require('koa-body')
const path = require('path')
const koaStatic = require('koa-static')

const routing = require('./routes')

const app = new Koa()

const { connectionStr } = require('./config')

mongoose.set('useFindAndModify', false)
mongoose.connect(connectionStr, { useUnifiedTopology: true,  useNewUrlParser: true }, () => {
  console.log('链接成功');
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, '../public')))

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname,'../public'),
    keepExtensions: true
  }
}))
app.use(parameter(app))
app.use(error({
  postFormat: (e, {stack, ...rest})=> process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

routing(app)


app.listen(3006, () => {console.log('3006端口已经开启')})

