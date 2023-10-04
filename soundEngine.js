class SoundEngine {
    #sampleRate = 48000
    #defaultAmp = .5
    #amp = defaultAmp
    #context
    #notes = []
    #soundArray = []
    #waves = []

    acexists = false

    attack = 0.1
	decay = 0.2
	sustain = 0.5
	release = 0.25

    constructor() {
        this.initSound()
    }
    
    initSound() {
        if(!acexists) {
            context = new AudioContext();
            initKeys();
            acexists = true;
        }
    }

    initKeys() {
        var numNotes = 88;
        var refPitch = 440;
        var refIdx = 48;
        var twoToTheTwelfth = Math.pow(2,1/12);
    
        for(var i = 0; i < numNotes; i++) {
            notes[i] = refPitch* Math.pow(twoToTheTwelfth, i-refIdx);
        }
    }

    addWave(wave) {
        waves.push(wave)
    }

    appendNote(keyIdx, noteLength) {
        if (keyIdx == -1) {
            makeSilence(noteLength);
            return;
        }
        freq = notes[keyIdx];
        var sxn = sampleRate * noteLength
        
        for(let i = 0; i < sxn; i++) {
            let useSamp = 0
            let amp = 1 / Math.sqrt(waves.length)
            for(let w in waves) {
                useSamp += w.getSample(freq, i)
            }
            useSamp *= amp
            this.appendSample(useSamp, i/sxn)
        }
        
    }

    appendSample(value, thruNote) {
        value = adsr(value, thruNote);
        soundArray.push(value);
    }

    adsr(value, thruNote)
    {
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

    makeSilence(noteLength) {
        var sxn = sampleRate * noteLength;
        for(var i=0; i < sampleRate * noteLength; i++) {
            var thruNote = i/sxn;
            appendSample(0, thruNote);
        }
    }


    clearBuffer() {
        soundArray = []
    }

    playNote(keyIdx, noteLength,keepBuffer = true, type = defaultType) {
        if(acexists){
            appendNote(keyIdx, noteLength, type = defaultType)
            playBuffer()
            if(!keepBuffer) 
                clearBuffer()
        }
    }

    playBuffer() {
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

}