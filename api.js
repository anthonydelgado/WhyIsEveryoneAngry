const request = require('request-promise-native');

request({
  method: 'POST',
  url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
  headers: { 'Ocp-Apim-Subscription-Key': 'd345949196d84d69a02cf3f73067aafc' },
  body: JSON.stringify({
    url: 'http://1boidr1j8wt01itylm7cszo5r8.wpengine.netdna-cdn.com/wp-content/themes/ColoradoIndependent/timthumb.php?src=http://coloradoindependent.com/wp-content/uploads/crowd-shot.jpg&w=647&zc=3',
  })
})
.then(res => console.log('RESPONSE: ', res))
.catch(err => console.log(err))
