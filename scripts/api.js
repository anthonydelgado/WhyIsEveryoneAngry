const request = require('request-promise-native');

request({
  method: 'POST',
  url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
  headers: { 'Ocp-Apim-Subscription-Key': 'd345949196d84d69a02cf3f73067aafc' },
  body: JSON.stringify({
    url: 'https://cmureadme.files.wordpress.com/2015/09/an-angry-mob.png',
  })
})
.then(res => console.log('RESPONSE: ', JSON.parse(res)))
.catch(err => console.log(err))
