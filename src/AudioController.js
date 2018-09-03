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
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

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


var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var volume = 0;

if (navigator.mediaDevices.getUserMedia) {
   console.log('getUserMedia supported.');
   var constraints = {audio: true}
   navigator.mediaDevices.getUserMedia (constraints)
      .then(
        function(stream) {
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          
          analyser.fftSize = 256;
          var bufferLength = analyser.frequencyBinCount;
          var dataArray = new Uint8Array(bufferLength);

          function draw() {
            requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            var averageVolume = 0;
            var humanBufferLength = bufferLength / 2.5; // magic number
            for (var i = 0; i < humanBufferLength; i++) {
              averageVolume += dataArray[i];
            }
            averageVolume /= humanBufferLength;

            var normalizedVolume = Math.max(0, Math.min(1, averageVolume / bufferLength));
            volume = normalizedVolume;
          }

          draw();
      })
      .catch( function(err) { console.log('The following gUM error occured: ' + err);})
} else {
   console.log('getUserMedia not supported on your browser!');
}

function getVolume() {
  return volume;
}

export default {
  getVolume,
}
