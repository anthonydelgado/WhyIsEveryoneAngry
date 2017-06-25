const chartLabels = ['Seconds',
  'anger',
  'contempt',
  'disgust',
  'fear',
  'happiness',
  'neutral',
  'sadness',
  'surprise' ]
const chartOptions = {
  title: 'Audience Reaction',
  curveType: 'function',
  legend: { position: 'right' }
};
let lineChart;

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(createChart);

function createChart() {
  lineChart = new google.visualization.LineChart(document.getElementById('time-series'));
}

function drawChart() {
  const data = google.visualization.arrayToDataTable(format(imageData));
  lineChart.draw(data, chartOptions);
}

function format(emoData) {
  const data = [chartLabels];
  console.log('INPUT: ', emoData);
  _.each(emoData, pic => {
    console.log('pic: ', pic)
    const faceScores = pic.emotions.map(face => face.scores);
    if (faceScores.length > 0) {
      const emotesTotal = faceScores.reduce((acc, face) => ({
        anger: face.anger + acc.anger,
        contempt: face.contempt + acc.contempt,
        disgust: face.disgust + acc.disgust,
        fear: face.fear + acc.fear,
        happiness: face.happiness + acc.happiness,
        neutral: face.neutral + acc.neutral,
        sadness: face.sadness + acc.sadness,
        surprise: face.surprise + acc.surprise,
      }));
      const emotesAvg = _.map(emotesTotal, emote => emote / pic.emotions.length);
      let time = msToTime(pic.time)
      const result = [time, ...emotesAvg];
      data.push(result);
    }
  })
  console.log('OUTPUT: ', data)
  return data;
}


function msToTime(timeStamp) {
  const ms = timeStamp % 1000;
  timeStamp = (timeStamp - ms) / 1000;
  const secs = timeStamp % 60;
  timeStamp = (timeStamp - secs) / 60;
  const mins = timeStamp % 60;
  const hrs = (timeStamp - mins) / 60;

  return (hrs ? hrs + ':' : '') + (mins ? mins + ':' : '') + secs;
}
