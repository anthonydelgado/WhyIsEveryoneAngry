const rawData = [
  ['Seconds',
  'anger',
  'contempt',
  'disgust',
  'fear',
  'happiness',
  'neutral',
  'sadness',
  'surprise' ],
  [ '4',
    0.062852719682524,
    0.00686425399019525,
    0.017502256904758616,
    0.05009051096902055,
    0.2840591599332,
    0.44803643209020905,
    0.034123374662639996,
    0.09647128347581178 ],
  [ '8',
    0.007252974219141,
    0.00672673840184,
    0.004954287308431206,
    0.00022665858931528567,
    0.6247736670728571,
    0.31854736921513377,
    0.015127227167416532,
    0.02239108654783614 ],
  [ '12',
    0.6458618562636365,
    0.005932734763413464,
    0.10446115550318182,
    0.002361058907730409,
    0.07835265624639799,
    0.125976772905992,
    0.024723212102501592,
    0.012330559080511361 ] ]


const chart = document.getElementById('time-series');

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  const data = google.visualization.arrayToDataTable(rawData);

  var options = {
    title: 'Audience Reaction',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('time-series'));

  chart.draw(data, options);
}
