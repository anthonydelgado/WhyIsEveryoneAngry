// On doument load resolve the SDK dependecy
function Initialize(onComplete) {
    require(["Speech.Browser.Sdk"], function(SDK) {
        onComplete(SDK);
    });
}

// Setup the recongizer
function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
        language, // Supported laguages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    var authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
    return SDK.CreateRecognizer(recognizerConfig, authentication);
}

// Start the recognition
function RecognizerStart(SDK, recognizer) {
    recognizer.Recognize((event) => {
        switch (event.Name) {
            case "RecognitionTriggeredEvent" :
                UpdateStatus("Initializing");
                break;
            case "ListeningStartedEvent" :
                UpdateStatus("Listening");
                break;
            case "RecognitionStartedEvent" :
                UpdateStatus("Listening_Recognizing");
                break;
            case "SpeechStartDetectedEvent" :
                UpdateStatus("Listening_DetectedSpeech_Recognizing");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechHypothesisEvent" :
                UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechEndDetectedEvent" :
                OnSpeechEndDetected();
                UpdateStatus("Processing_Adding_Final_Touches");
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case "SpeechSimplePhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "SpeechDetailedPhraseEvent" :
                UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case "RecognitionEndedEvent" :
                OnComplete();
                UpdateStatus("Idle");
                console.log(JSON.stringify(event)); // Debug information
                break;
        }
    })
    .On(() => {
        // The request succeeded. Nothing to do here.
    },
    (error) => {
        console.error(error);
    });
}

// Stop the Recognition.
function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
    // recognizer.AudioSource.Detach(audioNodeId)
}

// browser hooks

var startBtn, stopBtn, hypothesisDiv, statusDiv, key, languageOptions, formatOptions;
var SDK;
var recognizer;
var previousSubscriptionKey;
var interval;
var time = 0;
var phrases = [];

document.addEventListener("DOMContentLoaded", function () {
    createBtn = document.getElementById("createBtn");
    startBtn = document.getElementById("startBtn");
    stopBtn = document.getElementById("stopBtn");
    hypothesisDiv = document.getElementById("hypothesisDiv");
    statusDiv = document.getElementById("statusDiv");
    speechCanvas = document.getElementById('speechCanvas');
    key = document.getElementById("key");
    languageOptions = document.getElementById("languageOptions");
    formatOptions = document.getElementById("formatOptions");
    timer = $('#timer');

    languageOptions.addEventListener("change", function () {
        Setup();
    });

    formatOptions.addEventListener("change", function () {
        Setup();
    });

    startBtn.addEventListener("click", function () {
        if (!recognizer || previousSubscriptionKey != key.value) {
            previousSubscriptionKey = key.value;
            Setup();
        }

        phrases = [];
        $('.speechCanvas').get(0).innerHTML = "";
        RecognizerStart(SDK, recognizer);
        //time = Date.now();
        startBtn.disabled = true;
        stopBtn.disabled = false;

        interval = setInterval(updateTimer, 500);
    });

    stopBtn.addEventListener("click", function () {
        RecognizerStop(SDK, recognizer);
        startBtn.disabled = false;
        stopBtn.disabled = true;

        clearInterval(interval);
    });

    Initialize(function (speechSdk) {
        SDK = speechSdk;
        startBtn.disabled = false;
    });
});

function updateTimer() {
  time = Date.now() - window.startTime;
  // console.log(time)
  timer.html(`Ellapsed Time: ${millisToMinutesAndSeconds(time)}`);
}

function Setup() {
    recognizer = RecognizerSetup(SDK, SDK.RecognitionMode.Dictation, languageOptions.value, SDK.SpeechResultFormat[formatOptions.value], key.value);
}

function UpdateStatus(status) {
    statusDiv.innerHTML = status;
}

function UpdateRecognizedHypothesis(text) {
    hypothesisDiv.innerHTML = text;
}

function OnSpeechEndDetected() {
    stopBtn.disabled = true;
}

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function UpdateRecognizedPhrase(json) {
    json = JSON.parse(json);

    if (json.DisplayText !== undefined) {
      phrases.push({
        // startTime: json.Offset / 10000,
        // endTime: (json.Offset + json.Duration) / 10000,
        time: time,
        content: json.DisplayText
      });

      const divs = phrases.map(p =>
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
    }
    return;
}

function OnComplete() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
}
