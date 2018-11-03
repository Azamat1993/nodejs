/**
*
*
*/

// Deps
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var _data = require('./lib/data');
var handlers = require('./lib/handlers');

var server = http.createServer(function(req, res) {
  // get the URL and parse it

  var parsedUrl = url.parse(req.url, true);

  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  var queryStringObject = parsedUrl.query;

  var method = req.method;
  var headers = req.headers;

  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  // get payload
  req.on('data', function(data) {
    buffer += decoder.write(data);
  })

  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler this request should go to

    var chosedHandler = typeof(handlers[trimmedPath]) !== 'undefined' ? handlers[trimmedPath] : handlers.notFound;

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
    };

    // Route the request to the handler
    chosedHandler(data, function(statusCode, payload) {
      // Use the status statusCode
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      payload = typeof(payload) === 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('Returning ', statusCode, payloadString);
    });
  });
});

server.listen(config.port, function(){
  console.log('the server is listening on port 3000');
});

// Define a request router
var router = {
  'sample': handlers.sample,
  'users': handlers.users
}
