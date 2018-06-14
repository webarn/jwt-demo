const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (ctx, next) => {
  // const token = jwt.sign({ userName: 'admin' }, secret, { expiresIn: '1m' });
  // ctx.cookies.set('authorization', token);
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    link: '/image'
  });
});

router.get('/image', async (ctx, next) => {
  let p = path.join(__dirname, '../public/images/img.jpg');
  const res = await readerImg(p);
  ctx.type = 'image/jpeg';
  ctx.body = res;
});

// 创建buff
function readerImg(filePath) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (!err) {
        res(data);
      } else {
        rej(err);
      }
    });
  });
}

module.exports = router;
