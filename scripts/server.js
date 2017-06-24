var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var base64Img = require('base64-img');
var path = require('path');

var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
 
// parse application/json 
app.use(bodyParser.text({ limit: '50mb'}))

// log requests
app.use(morgan('tiny'));



app.use(express.static(__dirname + '/../'));


let idx = 0;

app.post('/api/upload', function(req, res) {
  //console.log(req.body);
  console.log('got upload');

  base64Img.img(req.body, 'photos', idx++, function(err, filepath) {});

})

app.get('/photo/:id', function(req, res) {
  res.sendFile(path.resolve('photos/' + req.params.id + '.png'));
})

console.log('serving on http://localhost:3000');
app.listen(3000);