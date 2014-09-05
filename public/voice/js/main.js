var recognition;
var interimResult = '';
var textArea = $('#speech-page-content');
var textAreaID = 'speech-page-content';
$(document).ready(function() {
	initRecognition();
	initButtons();
});

function initRecognition(){
	try {
		recognition = new webkitSpeechRecognition();
	} catch(e) {
		recognition = Object;
	}
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.onresult = function (event) {
		console.log("onresult")
		var pos = textArea.getCursorPosition() - interimResult.length;
		textArea.val(textArea.val().replace(interimResult, ''));
		interimResult = '';
		textArea.setCursorPosition(pos);
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				insertAtCaret(textAreaID, event.results[i][0].transcript);
			} else {
				isFinished = false;
				insertAtCaret(textAreaID, event.results[i][0].transcript + '\u200B');
				interimResult += event.results[i][0].transcript + '\u200B';
			}
		}
	};
	recognition.onend = function() {
		console.log("onend")
	};
}

function initButtons(){
	$('.start').click(function(){
		startRecognition();
	});

	$('.end').click(function(){
		console.log("stop")
		recognition.stop();
	});
}

function startRecognition () {
	console.log("start")
	textArea.focus();
	recognition.start();
};


navigator.getUserMedia = navigator.webkitGetUserMedia 



var audioCtx = new (window.webkitAudioContext)();
var voiceSelect = document.getElementById("voice");
var source;
var stream;
var analyser = audioCtx.createAnalyser();
var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();
var drawVisual;
var buflen = 2048;
var buf = new Uint8Array( buflen );
//main block for doing the audio recording

if (navigator.getUserMedia) {
 console.log('getUserMedia supported.');
 navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
       audio: true
     },

      // Success callback
      function(stream) {
       source = audioCtx.createMediaStreamSource(stream);
       source.connect(analyser);
       analyser.connect(distortion);
       distortion.connect(biquadFilter);
       biquadFilter.connect(convolver);
       convolver.connect(gainNode);
       gainNode.connect(audioCtx.destination);
      // updatePitch();
       visualize();
     
     },

      // Error callback
      function(err) {
       console.log('The following gUM error occured: ' + err);
     }
     );
} else {
 console.log('getUserMedia not supported on your browser!');
}

function visualize() {
  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);
  function draw() {
  	updatePitch();
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    for(var i = 0; i < bufferLength; i++) {
      // console.log(dataArray[i]);
    }
  };

  draw();
}





function autoCorrelate( buf, sampleRate ) {
	var MIN_SAMPLES = 4;	// corresponds to an 11kHz signal
	var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
	var SIZE = 1000;
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;

	if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
		return -1;  // Not enough data

	for (var i=0;i<SIZE;i++) {
		var val = (buf[i] - 128)/128;
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01)
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<SIZE; i++) {
			correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
		}
		correlation = 1 - (correlation/SIZE);
		if ((correlation>0.9) && (correlation > lastCorrelation))
			foundGoodCorrelation = true;
		else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			return sampleRate/best_offset;
		}
		lastCorrelation = correlation;
		if (correlation > best_correlation) {
			best_correlation = correlation;
			best_offset = offset;
		}
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}

// function updatePitch( time ) {
function updatePitch() {
console.log("up");
	var cycles = new Array;
	analyser.getByteTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioCtx.sampleRate );
	console.log("-------------"+ac)
	// if (ac == -1) {
 // 		detectorElem.className = "vague";
	//  	pitchElem.innerText = "--";
	// 	noteElem.innerText = "-";
	// 	detuneElem.className = "";
	// 	detuneAmount.innerText = "--";
 // 	} else {
	//  	detectorElem.className = "confident";
	//  	pitch = ac;
	//  	pitchElem.innerText = Math.floor( pitch ) ;
	//  	var note =  noteFromPitch( pitch );
	// 	noteElem.innerHTML = noteStrings[note%12];
	// 	var detune = centsOffFromPitch( pitch, note );
	// 	if (detune == 0 ) {
	// 		detuneElem.className = "";
	// 		detuneAmount.innerHTML = "--";
	// 	} else {
	// 		if (detune < 0)
	// 			detuneElem.className = "flat";
	// 		else
	// 			detuneElem.className = "sharp";
	// 		detuneAmount.innerHTML = Math.abs( detune );
	// 	}
	// }
}
