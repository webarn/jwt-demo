const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtKoa = require('koa-jwt');

const index = require('./routes/index');
const users = require('./routes/users');
const secret = 'jwt demo';

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(async function(ctx, next) {
  jwtKoa({ secret }).unless({
    path: [/^\//]
  });
  // 验证;
  const token = ctx.header.cookie || '';
  let auth = token.split('=')[1];
  console.log(1);
  jwt.verify(auth, secret, (err, data) => {
    if (!err) {
      console.log(data);
    } else {
      console.log(err);
      ctx.redirect('/');
    }
  });
  await next();
  console.log(2);
  const setToken = jwt.sign({ userName: 'admin' }, secret, { expiresIn: '1m' });
  ctx.cookies.set('authorization', setToken);
});

app.use(json());
app.use(logger());
app.use(require('koa-static')(path.join(__dirname, 'public')));

app.use(
  views(path.join(__dirname, 'views'), {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  console.log(3);
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
