var session = require('koa-session');
var koa = require('koa');
var app = koa();

app.keys = ['1'];
app.use(session(app));

app.use(function *(){
  // ignore favicon
  if (this.path === '/favicon.ico') return;

  var n = this.session.views || 0;
  this.session.views = ++n;
  this.body = n + ' views';
})

app.listen(3000);
console.log('listening on port 3000');