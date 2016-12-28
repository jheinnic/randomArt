// install source-map support so we get mapped stack traces.
require('source-map-support').install();

var loopback = require('loopback');
var path = require('path');
var bodyParser = require('body-parser');

var app = module.exports = loopback();

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
require.context('./views', false, /\.ejs$/);

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.token());

app.start = function() {
  // start the web server
  var server =  app.listen(function() {
    app.emit('started', server);
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });

  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
console.log('Executing boot instructions...');

// instructions are provided by an explicit webpack resolve alias (see gulpfile.js).
var ins = require('boot-instructions.json');

// install the external dynamic configuration.
ins.config = require('./config.json');
ins.dataSources = require('./datasources.json');

var execute = require('loopback-boot/lib/executor');
execute(app, ins, function (err) {
    if (err) throw err;
 
    // NOTE/TODO: the require.main === module check fails here under webpack
    // so we're not doing it.
    // if (require.main === module)
      app.start();
});

console.log('Done.');
