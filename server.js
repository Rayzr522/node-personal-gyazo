var express = require('express');
var app = express();
var Busboy = require('busboy');
var fs = require('fs');
var ip = require('ip');

app.get('/:file', function(req, res) {
  fs.readFile('tmp/' + req.params.file, function(err, data) {
    if (err) return res.send('error');
    res.type('png');
    res.send(data);
  });
});

app.post('/', function(req, res) {
  var name = '';
  var bufs = [];
  var bufsSize = 0;
  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    name = filename;
    console.log('File [' + filename + '] receive');
    file.on('data', function(data) {
      bufs.push(data);
      bufsSize += data.length;
    });
    file.on('end', function() {
      console.log('File [' + filename + '] finished');
    });
  });
  busboy.on('finish', function() {
    fs.writeFile('tmp/' + name, Buffer.concat(bufs,bufsSize), function(err) {
      if (err) console.log('Error ' + err);
      res.send('http://'+ip.address()+':3000/'+name);
    });
  });
  req.pipe(busboy);
});

app.listen(3000);
