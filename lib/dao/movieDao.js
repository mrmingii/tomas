var fs = require('fs');

var data = {}, init = false;

// cb: function()
function readFile(cb) {
  if (init) return cb();
  fs.readFile('movie-data', function(err, content) {
    // console.log(err, content);
    data = (err || !content) ? {} : JSON.parse(content);
    // console.log(data);
    init = true;
    cb();
  });
}

// cb: function(err)
function writeFile(cb) {
  fs.writeFile('movie-data', JSON.stringify(data), function(err) {
    cb(err);
  });
}

module.exports = {
  // cb: function(err)
  add: function(movie, cb) {
    readFile(function() {
      if (!movie.hash) {
        cb(new Error('[movieDao add] invalid hash'));
      } else if (!data[movie.hash]) {
        data[movie.hash] = movie;
        writeFile(cb);
      } else {
        cb(new Error('[MovieDao add] movie existed.'));
      }
    });
  },

  // cb: function(err)
  update: function(movie, cb) {
    readFile(function() {
      if(!data[movie.hash]) return cb(new Error('[MovieDao update] movie doesn\'t exist.'));
      data[movie.hash] = movie;
      writeFile(cb);
    });
  },

  // cb: function(err)
  delete: function(hash, cb) {
    readFile(function() {
      if (!data[hash]) return cb(new Error('[MovieDao delete] movie doesn\'t exist.'));
      delete data[hash];
      writeFile(cb);
    })
  },

  // cb: function(err, arr)
  list: function(cb) {
    readFile(function() {
      var arr = [];
      for (var key in data) {
        if (data[key].hash) arr.push(data[key]);
      }
      cb(null, arr);
    });
  },

  // cb: function(err, movie)
  get: function(hash, cb) {
    readFile(function() {
      if (data[hash]) {
        cb(null, data[hash]);
      } else {
        cb(new Error('[MovieDao get] movie doesn\'t exist.'), null);
      }
    });
  }
}