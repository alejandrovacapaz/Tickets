var express = require('express'),
  app = express(),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
  debug = require('debug')('express-sequelize'),
  http = require('http'),
  jwt = require("jsonwebtoken"),
  nodeExcel = require('excel-export'),
  models = require('./server/models');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Contapprol-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendfile('index.html' );
});

require('./routes')(app);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var port = normalizePort(process.env.PORT || '3003');
app.set('port', port);
var server = http.createServer(app);

models.sequelize.sync().then(function () {
  server.listen(port, function () {
    debug('Express server listening on port ' + server.address().port);
  });
  server.on('error', onError);
  server.on('listening', onListening);
});

server.listen(port, function () {
  debug('Express server listening on port ' + server.address().port);
});
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}