const lineLabels = ['Seconds',
  'Anger',
  'Contempt',
  'Disgust',
  'Fear',
  'Happiness',
  // 'Neutral',
  'Sadness',
  'Surprise' ]
const lineOptions = {
  curveType: 'function',
  legend: { position: 'right' },
  chartArea: {width: '60%'},
  crosshair: { trigger: 'both', color: 'grey'},
  vAxis: {
   title: "Average ",
    // viewWindowMode:'explicit',
    viewWindow:{
      min:0,
    },
  },
  animation: {
    duration: 1000,
    easing: 'out',
  },
}
const barLabels = lineLabels.slice(1);
const barOptions =  {
  legend: 'none',
  chartArea: {width: '50%'},
  animation: {
    duration: 1000,
    easing: 'out',
  }
}
const gaugeOptions =  {
  chartArea: {width: '50%'},
  animation: {
    duration: 1000,
    easing: 'out',
  },
  redFrom: 90, redTo: 100,
  yellowFrom:75, yellowTo: 90,
  minorTicks: 5
}

let lineChart, lineData, barChart, barData, gaugeChart, gaugeData;

google.charts.load('current', {'packages':['corechart', 'gauge']});
google.charts.setOnLoadCallback(createCharts);

function createCharts() {
  lineChart = new google.visualization.LineChart(document.getElementById('time-series'));
  barChart = new google.visualization.BarChart(document.getElementById('bar-chart'));
  gaugeChart = new google.visualization.Gauge(document.getElementById('gauge-chart'));
  google.visualization.events.addListener(lineChart, 'select', lineSelect);
}

function drawCharts() {
  const lineFormatted = lineFormat(imageData);
  const barFormatted = barFormat(lineFormatted);
  const gaugeFormatted = gaugeFormat(lineFormatted);
  lineData = google.visualization.arrayToDataTable(lineFormatted);
  barData = google.visualization.arrayToDataTable(barFormatted);
  gaugeData = google.visualization.arrayToDataTable(gaugeFormatted);
  lineChart.draw(lineData, lineOptions);
  barChart.draw(barData, barOptions);
  gaugeChart.draw(gaugeData, gaugeOptions);
}

function lineSelect() {
  const selected = lineChart.getSelection()[0];
  if (selected && selected.row) {
    let idx = selected.row;
    let timeStamp = imageData[idx].time
    $('.framePictureCanvas img').attr('src', `photos/${idx}.png`)
    // display prev and next text snippets
    let snippet = [];
    for (let p in phrases) {
      if (phrases[p].time >= timeStamp) {
        snippet.push(phrases[p]);
        break;
      } else if (phrases[p].time > timeStamp - 20000) {
        snippet.push(phrases[p]);
      }
    }
    const divs = snippet.map(p =>
      `<div class="phrase">
        <div class="timestamp">
          <span>${millisToMinutesAndSeconds(p.time)}</span>
        </div>
        <div class="content">
          <span>${p.content}</span>
        </div>
      </div>`
    );
    $('#speechCanvas').html(divs);
    speechCanvas.scrollTop = speechCanvas.scrollHeight;

    const gaugeFormatted = gaugeFormat(imageData[idx - 1]);
    gaugeData = google.visualization.arrayToDataTable(gaugeFormatted);
    if (gaugeData) gaugeChart.draw(gaugeData, gaugeOptions);
  }
}

function lineFormat(imgData) {
  const data = [lineLabels];
  _.each(imgData, pic => {
    const faceScores = pic.emotions.map(face => face.scores);
    if (faceScores.length > 0) {
      const emotesTotal = faceScores.reduce((acc, face) => ({
        anger: face.anger + acc.anger,
        contempt: face.contempt + acc.contempt,
        disgust: face.disgust + acc.disgust,
        fear: face.fear + acc.fear,
        happiness: face.happiness + acc.happiness,
        // neutral: face.neutral + acc.neutral,
        sadness: face.sadness + acc.sadness,
        surprise: face.surprise + acc.surprise,
      }));
      emotesTotal.neutral !== undefined && delete emotesTotal.neutral;
      const emotesAvg = _.map(emotesTotal, emote => emote / pic.emotions.length);
      let time = millisToMinutesAndSeconds(pic.time)
      const result = [time, ...emotesAvg];
      data.push(result);
    }
  })
  return data;
}

function barFormat(lineData) {
  const frameCount = lineData.length - 1;
  const totals = lineData.slice(1)
                          .map(frame => frame.slice(1))
                          .reduce((acc, frame) => frame.map((emote, i) => emote + acc[i]))
  const averages = totals.map(emote => emote / frameCount);
  const formatted = averages.map((avg, i) => [barLabels[i], avg]);
  const sorted = formatted.sort((a, b) => b[1] - a[1])
  return [['y', 'x'], ...sorted];
}

// function gaugeFormat(frameData) {
//   console.log('FRAME DATA: ',frameData)
//   const faceScores = frameData.emotions.map(face => face.scores);
//   if (faceScores.length > 0) {
//     const emotesTotal = faceScores.reduce((acc, face) => ({
//       anger: face.anger + acc.anger,
//       contempt: face.contempt + acc.contempt,
//       disgust: face.disgust + acc.disgust,
//       fear: face.fear + acc.fear,
//       happiness: face.happiness + acc.happiness,
//       // neutral: face.neutral + acc.neutral,
//       sadness: face.sadness + acc.sadness,
//       surprise: face.surprise + acc.surprise,
//     }));
//     emotesTotal.neutral !== undefined && delete emotesTotal.neutral;
//     const formatted = _.map(emotesTotal, (value, i) => [barLabels[i], value * 100]);
//     return [['y', 'x'], ...formatted];
//   }
// }

function gaugeFormat(lineData) {
  const frameCount = lineData.length - 1;
  const totals = lineData.slice(1)
                          .map(frame => frame.slice(1))
                          .reduce((acc, frame) => frame.map((emote, i) => emote + acc[i]))
  const averages = totals.map(emote => emote / frameCount);
  const formatted = averages.map((avg, i) => [barLabels[i], avg]);
  return [['y', 'x'], ...formatted];
}
