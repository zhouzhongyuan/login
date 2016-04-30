var express = require('express');
var router = express.Router();
const session = require('express-session');
// 数据库,以密文存储 name(user) hash（pwd）
// 不应该放在内存里面，应该放在数据库中
var users = {
    admin: {name: '管理员',pwd:'admin'}
};
//get
router.get('/', function (req, res) {
    res.render('login', {title: '登录', message: res.locals.message});
});
//post
router.post('/', function (req, res) {
    authenticate(req.body.user, req.body.pwd, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = `<p>登录成功：${user.name}</p><p><a href="/logout">退出登录</a></p><p>打开<a href="/restricted">/restricted</a></p>`;
                res.redirect('back');
            });
        } else {
            req.session.error = `<p>登录失败，失败原因：${err.message}</p><p>(测试账号&密码 "admin" and "admin")</p>`;
            res.redirect('/login');
        }
    });
});
function authenticate(name, pass, fn) {
    //console.log('authenticating %s:%s', name, pass);
    //查询数据库中是否有此user
    var user = users[name];
    if (!user) return fn(new Error('用户名错误，没有此用户'));
    if(pass === user.pwd){
        return fn(null, user);
    }else{
        fn(new Error('密码错误'));
    }
}
module.exports = router;