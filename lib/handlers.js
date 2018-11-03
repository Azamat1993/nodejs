// Dependencies

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
}

handlers._users = {
  post: function(data, callback) {
    
  },
  get: function(data, callback) {

  },
  put: function(data, callback) {

  },
  delete: function(data, callback) {

  }
};

// Sample handler
handlers.ping = function(data, callback) {
  callback(200);
}

handlers.notFound = function(data, callback) {
  callback(404, {});
}

// Export handlers
module.exports = handlers
