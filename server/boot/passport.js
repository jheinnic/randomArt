module.exports = function(server) {
  var router = server.loopback.Router();
  router.get('/auth/success', function (req, res, next) {
    res.redirect('https://www.myproject.com/passport/' + req.accessToken.id + '/' +  req.accessToken.userId);
  });
  server.use(router);
};
