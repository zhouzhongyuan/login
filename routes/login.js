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
    const user = req.body.user;
    const pwd = req.body.pwd;
    authenticate(user,pwd)
        .then(function(user){
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = `<p>登录成功：${user.name}</p><p><a href="/logout">退出登录</a></p><p>打开<a href="/restricted">/restricted</a></p>`;
                res.redirect('back');
            });
        },function(err){
            req.session.error = `<p>登录失败，失败原因：${err.message}</p><p>(测试账号&密码 "admin" and "admin")</p>`;
            res.redirect('/login');
        })
        .catch(console.log.bind(console)); ;
});
function authenticate(name,pass){
    return new Promise(function(resolve,reject){
        var user = users[name];
        if (!user){
            reject(new Error('用户名错误，没有此用户'));
        }
        if(pass === user.pwd){
            resolve(user);
        }else{
            reject(new Error('密码错误'));
        }
    });
}
module.exports = router;