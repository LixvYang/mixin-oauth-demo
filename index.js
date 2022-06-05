// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = '7ac9341f-61c1-4b49-b466-298397fe1624'
const clientSecret = '1dcff9727e7bc1488d591656b8c10acbcae7d4d3eac095f13b25debe431fc17e'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);

  const tokenResponse = await axios({
    method: 'post',
    url: 'https://api.mixin.one/oauth/token',
    data: {
      "client_id": clientID,
      "client_secret": clientSecret,
      "code": requestToken,
    },
    headers: {
      accept: 'application/json'
    }
  }).catch(err => {
    console.log("请求错误", err)
  });

  const accessToken = tokenResponse.data.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://api.mixin.one/me`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.data.full_name;
  const avatar_url = result.data.avatar_url;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8080);
