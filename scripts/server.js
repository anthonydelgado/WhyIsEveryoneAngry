var express = require('express')
var app = express()

app.use(express.static(__dirname + '/../'));

console.log('serving on http://localhost:3000');

app.listen(3000);
