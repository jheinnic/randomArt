module.exports = function(server) {
  // Create an instance of PassportConfigurator with the server instance
  var PassportConfigurator =
    require('loopback-component-passport').PassportConfigurator;
  var passportConfigurator = new PassportConfigurator(server);
  
  // Enable http session
  server.use(
    loopback.session({ secret: 'keyboard cat' }));
  
  // Load the provider configurations
  var config = {};
  try {
    config = require('../providers.json');
  } catch(err) {
    console.error('Please configure your passport strategy in `providers.json`.');
    console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
    process.exit(1);
  }

  // Initialize passport
  passportConfigurator.init();
  
  // Set up related models
  passportConfigurator.setupModels({
    userModel: server.models.user,
    userIdentityModel: server.models.userIdentity,
    userCredentialModel: server.models.userCredential
  });
  // Configure passport strategies for third party auth providers
  for(var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }

/*
  var router = server.loopback.Router();
  router.get('/auth/success', function (req, res, next) {
    res.redirect('https://www.myproject.com/passport/' + req.accessToken.id + '/' +  req.accessToken.userId);
  });
  server.use(router);
*/
};
