const sampleRate = 48000;
const defaultType = "sine";
const defaultAmp = .5;
const defaultTriPeak = .5;

var amp = defaultAmp;
var triPeak = defaultTriPeak;

var context;
var notes = [];
var period;
var soundArray = [];

var acexists = false;

function initSound() {
    if(!acexists) {
        context = new AudioContext();
        initKeys();
        acexists = true;
    }
}

function initKeys() {
    var numNotes = 88;
    var refPitch = 440;
    var refIdx = 48;
    var twoToTheTwelfth = Math.pow(2,1/12);

    for(var i = 0; i < numNotes; i++) {
        notes[i] = refPitch* Math.pow(twoToTheTwelfth, i-refIdx);
    }
}

function appendNote(keyIdx, noteLength, type = defaultType) {
    if (keyIdx == -1) {
        makeSilence(noteLength);
        return;
    }

    freq = notes[keyIdx];

    switch(type) {
        case "sine": makeSineWave(freq, noteLength); break;
        case "square": makeSquareWave(freq, noteLength); break;
        case "triangle": makeTriangleWave(freq, noteLength); break;
        case "noise": makeNoise(noteLength); break;
    }
}

function appendSample(value, thruNote) {
    value = adsr(value, thruNote);
    soundArray.push(value);
}


//testfunction
function playSound() {
    initSound();
    
//b, d, e, f, e, d, b
    var a = 36
    var b = 38;
    var d = 41;
    var e = 43;
    var f = 44;

    let melody = [b, -1, d, -1, e, -1, f, -1, e, -1, d, -1, b, -1, -1, -1, -1, a, d, b ];

    let noteLen = 1/8;
    for(let i = 0; i < melody.length; i++) {
        appendNote(melody[i], noteLen)
    }
    

    playBuffer();
}

function adsr(value, thruNote)
{
	var attack = 0.1;
	var decay = 0.2;
	var sustain = 0.5;
	var release = 0.25;
	
	if(thruNote < attack)
	{
		var thruAttack = thruNote / attack;
		value *= thruAttack;
	}
	else if(thruNote < decay)
	{
		var thruDecay = (thruNote - attack) / (decay - attack);
		var susValue = sustain * value;
		
		value = (1 - thruDecay) * (value - susValue) + susValue;
	}
	else if(thruNote > (1 - release))
	{
		var thruRelease = (thruNote - (1 - release)) / release;
		var susValue = sustain * value;
		
		value = (1 - thruRelease) * susValue;
	}
	else
	{
		value *= sustain;
	}

	return value;
}

function makeSineWave(freq, noteLength) {
    period = sampleRate/freq;
    var sxn = sampleRate * noteLength;
    for(var i=0; i < sampleRate * noteLength; i++){
        var thruNote = i/sxn;
        appendSample(Math.sin(i / period * 2 * Math.PI )* amp, thruNote);
    }
}

function makeSquareWave(freq, noteLength) {
    period = sampleRate/freq;
    var sxn = sampleRate * noteLength;
    for(var i=0; i < sampleRate * noteLength; i++){
        var thruNote = i/sxn;
        appendSample((parseInt(i % period / (period/2)) * 2 - 1) * amp, thruNote);
    }
}

function makeTriangleWave(freq, noteLength) {
    period = sampleRate/freq;
    var tp2 = triPeak / 2;
    var itp2 = 1 - tp2;

    var sxn = sampleRate * noteLength;

    for(var i=0; i < sampleRate * noteLength; i++){
        var thruNote = i/sxn;
        var perc = (i%period) / period;
        var samp = 0;

        if(perc <tp2) {
            samp = perc / tp2;
        }
        else if (perc < itp2) {
            var perc2 = perc - tp2;
            var subPer = perc2 / (itp2 -tp2)
            samp = subPer * -2 + 1;
        }
        else {
            samp = (perc - itp2) / tp2 -1;
        }

        appendSample(samp*amp, thruNote);
    }
}

function makeNoise(noteLength) {
    var sxn = sampleRate * noteLength;
    for(var i=0; i < sampleRate * noteLength; i++)
    {
        var thruNote = i/sxn;
        appendSample((Math.random()*2 -1)*amp, thruNote);
    }
}

function makeSilence(noteLength) {
    var sxn = sampleRate * noteLength;
    for(var i=0; i < sampleRate * noteLength; i++) {
        var thruNote = i/sxn;
        appendSample(0, thruNote);
    }
}

function clearBuffer() {
    soundArray = []
}

function playNote(keyIdx, noteLength,keepBuffer = true, type = defaultType) {
    if(acexists){
        appendNote(keyIdx, noteLength, type)
        playBuffer()
        if(!keepBuffer) 
            clearBuffer()
    }
}


function playBuffer() {
    var arrayBuffer = context.createBuffer(2, soundArray.length, context.sampleRate);
    for (var channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
        var samples = arrayBuffer.getChannelData(channel);
        
        for (var i = 0; i < arrayBuffer.length; i++) {
            samples[i] = soundArray[i];
        }
    }

    var source = context.createBufferSource();
    source.buffer = arrayBuffer;
    source.connect(context.destination);
    source.start();
}

//document.querySelector("#playbtn").addEventListener('click', playSound)