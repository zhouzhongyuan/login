var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = module.exports = express();
//routes
var login = require('./routes/login');
var logout = require('./routes/logout');
var restricted = require('./routes/restricted');
// config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    name: 'user.sid',
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}));
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) {
        res.locals.message = `<div class="msg error">${err}</div>`;
    }
    if (msg) {
        res.locals.message = `<div class="msg success">${msg}</div>`;
    }
    next();
});

app.get('/', function (req, res) {
    res.redirect('/login');
});
app.use('/login', login);
app.use('/logout', logout);
app.use('/restricted', restricted);
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}