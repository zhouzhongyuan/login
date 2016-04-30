var express = require('express');
var router = express.Router();
router.get('/', restrict, function(req, res){
    res.send('登录成功才能打开这个页面 <a href="/logout">退出登录</a>');
});
function restrict(req, res, next) {
    var s = JSON.stringify(req.session);
    console.log(`get restrict ${s}`);
    if (req.session.user) {
        next();
    } else {
        req.session.error = '没有权限打开此页面';
        res.redirect('/login');
    }
}
module.exports = router;