import Config from '../Config';

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}


// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}


const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
let source;
let stream;

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

let spectrogram = [];
let maxVolumeFound = 0;

if (navigator.mediaDevices.getUserMedia) {
   const constraints = {audio: true}
   navigator.mediaDevices.getUserMedia(constraints)
      .then(
        function(stream) {
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          
          analyser.fftSize = Config.fftSize;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          function draw() {
            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            const humanCommonVoiceFrequency = 2.5; // magic number
            // const humanCommonVoiceFrequency = 1; // magic number
            const humanBufferLength = bufferLength / humanCommonVoiceFrequency;

            spectrogram = [];
            for (let i = 0; i < humanBufferLength; i++) {
              spectrogram.push(dataArray[i]);
            }
          }

          draw();
      })
      .catch( function(err) { console.error('The following gUM error occured: ' + err);})
} else {
   console.error('getUserMedia not supported on your browser!');
}

function getSpectrogram() {
  return spectrogram;
}

function getVolume() {
  const sumVolume = spectrogram.reduce((result, value) => result + value);
  const volume = sumVolume / spectrogram.length;

  maxVolumeFound = Math.max(maxVolumeFound, volume);
  const normalizedVolume = Math.max(0, Math.min(1, volume / maxVolumeFound));

  return normalizedVolume;
}

export default {
  getSpectrogram,
  getVolume,
}
