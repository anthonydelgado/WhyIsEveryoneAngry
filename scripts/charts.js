const _ = require('lodash');

const emo = require('../data/emoDummy').data;
const audio = require('../data/audioDummy').data;
// const chart = document.getElementById('time-series');
//
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);
//
// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//     ['Year', 'Sales', 'Expenses'],
//     ['2004',  1000,      400],
//     ['2005',  1170,      460],
//     ['2006',  660,       1120],
//     ['2007',  1030,      540]
//   ]);
//
//   var options = {
//     title: 'Company Performance',
//     curveType: 'function',
//     legend: { position: 'bottom' }
//   };
//
//   var chart = new google.visualization.LineChart(document.getElementById('time-series'));
//
//   chart.draw(data, options);
// }

function format(emoData, audioData) {
  const data = [];
  audioData.forEach(clip => {
    const time = clip.endTime - (clip.endTime % 4000);
    const pic = emoData.filter(img => img.time === time)[0];
    const faceScores = pic.faces.map(face => face.scores);
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
    const emotesAvg = _.map(emotesTotal, emote => emote / pic.faces.length);
    const result = [time, ...emotesAvg];
    data.push(result);
  })
  console.log(data);
}
format(emo, audio);

// [
//   { time: 4000,
//     faces: [ { faceRectangle: { height: 94, left: 186, top: 271, width: 94 },
//       scores:
//        { anger: 0.001660237,
//          contempt: 0.00002414822,
//          disgust: 0.000761763542,
//          fear: 0.00617167074,
//          happiness: 0.5975893,
//          neutral: 0.00383062335,
//          sadness: 0.000242167254,
//          surprise: 0.389720082 } },
//     { faceRectangle: { height: 69, left: 558, top: 204, width: 69 },
//       scores:
//        { anger: 0.09664705,
//          contempt: 0.03980859,
//          disgust: 0.143813729,
//          fear: 0.000175513866,
//          happiness: 0.0499863774,
//          neutral: 0.6519599,
//          sadness: 0.00275956374,
//          surprise: 0.0148492614 } },
//     { faceRectangle: { height: 66, left: 289, top: 124, width: 66 },
//       scores:
//        { anger: 0.2002835,
//          contempt: 9.091352e-7,
//          disgust: 0.00127147534,
//          fear: 0.14643918,
//          happiness: 0.330086678,
//          neutral: 0.000683838967,
//          sadness: 0.123959348,
//          surprise: 0.197275072 } },
//     { faceRectangle: { height: 59, left: 491, top: 157, width: 59 },
//       scores:
//        { anger: 0.00156308548,
//          contempt: 0.0008602855,
//          disgust: 0.000281069078,
//          fear: 0.000222798189,
//          happiness: 0.000300545158,
//          neutral: 0.9693297,
//          sadness: 0.0245852638,
//          surprise: 0.00285725319 } },
//     { faceRectangle: { height: 57, left: 416, top: 202, width: 57 },
//       scores:
//        { anger: 0.0006827238,
//          contempt: 0.0016879699,
//          disgust: 0.0008933538,
//          fear: 0.00007586247,
//          happiness: 0.8061914,
//          neutral: 0.178292125,
//          sadness: 0.0119319744,
//          surprise: 0.0002446004 } },
//     { faceRectangle: { height: 54, left: 236, top: 142, width: 54 },
//       scores:
//        { anger: 5.7083173e-7,
//          contempt: 4.23681925e-8,
//          disgust: 0.000007289448,
//          fear: 1.12049756e-8,
//          happiness: 0.9999883,
//          neutral: 0.00000123158509,
//          sadness: 0.0000022823624,
//          surprise: 2.60787118e-7 } },
//     { faceRectangle: { height: 49, left: 55, top: 84, width: 49 },
//       scores:
//        { anger: 0.3212683,
//          contempt: 0.000486488134,
//          disgust: 0.0199618936,
//          fear: 0.300912827,
//          happiness: 0.0170051176,
//          neutral: 0.04342057,
//          sadness: 0.03346867,
//          surprise: 0.263476133 } },
//     { faceRectangle: { height: 45, left: 260, top: 97, width: 45 },
//       scores:
//        { anger: 0.00000995932351,
//          contempt: 0.00000117024456,
//          disgust: 2.28795862e-8,
//          fear: 0.00000397988833,
//          happiness: 0.000006218374,
//          neutral: 0.9999377,
//          sadness: 0.00002261807,
//          surprise: 0.00001830731 } },
//     { faceRectangle: { height: 42, left: 462, top: 125, width: 42 },
//       scores:
//        { anger: 0.00307756639,
//          contempt: 0.006914092,
//          disgust: 0.00767016131,
//          fear: 0.0468711779,
//          happiness: 0.0111270212,
//          neutral: 0.726844132,
//          sadness: 0.101522423,
//          surprise: 0.0959734 } },
//     { faceRectangle: { height: 39, left: 149, top: 99, width: 39 },
//       scores:
//        { anger: 0.003334204,
//          contempt: 0.0188588444,
//          disgust: 0.00036181105,
//          fear: 0.0000320884319,
//          happiness: 0.0283106416,
//          neutral: 0.9060645,
//          sadness: 0.042739436,
//          surprise: 0.000298464671 } } ] },
