var fs = require('fs');
var path = require('path');

// Container for the module
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, filename, data, callback) {
  // Open the file for writing

  fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      // Convert data to String
      var stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if(!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            }
          })
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Count not create new file, it may already exist');
    }
  });
}

lib.read = function(dir, file, callback) {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
    callback(err, data);
  })
}

lib.update = function(dir, file, data, callback) {
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      var stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, function(err) {
        if (!err) {
           fs.writeFile(fileDescriptor, stringData, function(err) {
             if (!err) {
               fs.close(fileDescriptor, function(err) {
                 if (!err) {
                   callback(false);
                 } else {
                   callback('Error closing file');
                 }
               })
             } else {
               callback('Error writing into file');
             }
           });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Count not open file, it may not exist');
    }
  });
}

lib.delete = function(dir, file, callback) {
  // unlink
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting');
    }
  })
}

module.exports = lib;
