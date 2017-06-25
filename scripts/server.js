var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var base64Img = require('base64-img');
var path = require('path');
const request = require('request-promise-native');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// parse application/json
app.use(bodyParser.text({ limit: '50mb'}))

// log requests
app.use(morgan('tiny'));



app.use(express.static(__dirname + '/../'));



// Photos and Image Routes / Controller
// Keep Photo Idx
let idx = 0;

// **************************************************************
// Get NGROK route: run 'ngrok http 3000'
// This won't be necessary when we deploy
let ngrokLink = 'http://7b42f60b.ngrok.io';
// **************************************************************

// Upload photo and make call to azure
// Called when receive photo frame
app.post('/api/upload', function(req, res) {
  base64Img.img(req.body, 'photos', idx++, function(err, filepath) {

    // if successfully saved photos then, make api call to azure
    if(!err) {
      request({
        method: 'POST',
        url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
        headers: { 'Ocp-Apim-Subscription-Key': 'd345949196d84d69a02cf3f73067aafc' },
        body: JSON.stringify({
          url: ngrokLink + '/photo/' + (idx - 1),
        })
      })
      .catch(err => console.log(err))
      .then(result => {
        result = JSON.parse(result);
        console.log('RESPONSE: ', result);
        res.send(JSON.stringify({result: result, photoId: (idx - 1)}));
      })
    } else {
      res.send(JSON.stringify({result: 'unable to save image'}));
    }
  });

})

// Serve Photo file from photo id
// Used by the api call to azure's url
app.get('/photo/:id', function(req, res) {
  res.sendFile(path.resolve('photos/' + req.params.id + '.png'));
})

app.get('/upload/reset', function(req, res){
  idx = 0;
  res.send('reset');
})


console.log('serving on http://localhost:3000');
app.listen(3000);
