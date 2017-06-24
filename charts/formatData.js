const _ = require('lodash');

const emo = require('../data/emoDummy').data;
const audio = require('../data/audioDummy').data;

function format(emoData, audioData) {
  const data = [];
  audioData.forEach(clip => {
    let time = clip.endTime - (clip.endTime % 4000);
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
    time = msToTime(time)
    const result = [time, ...emotesAvg];
    data.push(result);
  })
  console.log(data);
}
format(emo, audio);

function msToTime(timeStamp) {
  const ms = timeStamp % 1000;
  timeStamp = (timeStamp - ms) / 1000;
  const secs = timeStamp % 60;
  timeStamp = (timeStamp - secs) / 60;
  const mins = timeStamp % 60;
  const hrs = (timeStamp - mins) / 60;

  return (hrs ? hrs + ':' : '') + (mins ? mins + ':' : '') + secs;
}
