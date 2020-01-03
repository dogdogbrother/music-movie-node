const Koa = require('koa')
const mongoose = require('mongoose')
const error = require("koa-json-error")

const routing = require('./routes')

const app = new Koa()

const { connectionStr } = require('./config')

mongoose.connect(connectionStr, { useUnifiedTopology: true,  useNewUrlParser: true }, () => {
  console.log('链接成功');
})
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (e, {stack, ...rest})=> process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

routing(app)

app.listen(3006, () => {console.log('3006端口已经开启')})

