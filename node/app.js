var createError = require('http-errors');
var express = require('express');
const cors =require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const JWT = require('./MiddleWares/jwt');
var indexRouter = require('./routes/index');
const UserRouter = require('./routes/admin/UserRouter');
const NewsRouter = require('./routes/admin/NewsRouter');
const ProductRouter = require('./routes/admin/ProductRouter') 
const WebNewsRouter = require('./routes/web/NewsRouter');
const WebProductRouter = require('./routes/web/ProductRouter');
const ThreeDRouter = require('./routes/admin/ThreeDRouter');
const WebThreeDRouter = require('./routes/web/ThreeDRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  // 允许所有域名访问
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );  // 允许的请求头
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // 允许的HTTP方法
  next();
});



app.use('/', indexRouter);
app.use('/users',UserRouter)
app.use(WebNewsRouter)
app.use(WebProductRouter)
app.use(WebThreeDRouter)

/*
adminapi===后台
webapi===前台
*/
app.use((req,res,next)=>{
  //token有效，next()
  //token过期返回401
  if(req.url === "/adminapi/user/login"){
    next()
    return;
  }
  const token = req.headers["authorization"].split(" ")[1]
  if(token){
    var payload = JWT.verify(token)
    if(payload){
      const newToken = JWT.generate({
        _id:payload._id,
        username:payload.username
      },"1d")   
      res.header('Authorization',newToken)
      next()
    }else{
      res.status(401).send({errCode:"-1",errInfo:"token过期"})
    }
  }

})
app.use(UserRouter);
app.use(NewsRouter)
app.use(ProductRouter)
app.use(ThreeDRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
