const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const cors = require('koa2-cors');

const router = new Router();
const app = new Koa();

const faker = require('faker');

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  }),
);

const store = {
  lastIndex: null,
  messages: [],
};

setInterval(() => {
  store.messages.push({
    id: faker.datatype.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.sentence(),
    received: faker.date.past(),
  });
}, 10000);

router.get('/messages/unread', async (ctx) => {
  if (!store.lastIndex) {
    ctx.response.body = store.messages;
    store.lastIndex = store.messages.length - 1;
  } else {
    const response = store.messages.slice(store.lastIndex + 1);
    ctx.response.body = response;
    store.lastIndex = store.messages.length - 1;
  }
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 8030;
const server = http.createServer(app.callback());
server.listen(port, (err) => {
  if (err) {
    console.log('Error occured:', err);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});
