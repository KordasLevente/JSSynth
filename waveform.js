class Waveform {
    static waveids = 0
    waveid
    #sampleRate = 48000
    defaultType = "sine";
    defaultWaveAmp = .5;
    defaultTriPeak = .5;
    defaultPulseAmt = 1
    #type
    #waveAmp
    #triPeak
    #pulseAmt

    constructor(type = defaultType, waveAmp = defaultWaveAmp, triPeak = defaultTriPeak) {
        this.type = type
        this.waveAmp = waveAmp
        this.triPeak = triPeak
        this.waveid = waveids
        waveids++
    }

    setType(type=this.defaultType) {
        this.type = type
    }

    setAmp(newAmp=this.defaultWaveAmp) {
        this.waveAmp = newAmp
    }

    setTriPeak(newTP=this.defaultTriPeak) {
        this.triPeak = newTP
    }

    setPulseAmt(newPulseAmt = this.defaultPulseAmt){
        this.pulseAmt = newPulseAmt
    }

    getSample(freq, samplingPoint) {
        let samp = 0
        let period = sampleRate/freq
        let pulsePd = period * this.pulseAmt
        switch(type) {
            case "sine": samp = Math.sin(((samplingPoint % period) / pulsePd) * 2 * Math.PI ); break;
            case "square": samp = (parseInt(samplingPoint % period / (pulsePd/2)) * 2 - 1); break;
            case "triangle":
                let tp2 = triPeak / 2;
                let itp2 = 1 - tp2;
                let perc = (samplingPoint%period) / pulsePd;
                
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
                break;
            case "noise": samp = Math.random()*2 -1; break;
        }

        return samp * waveAmp
    }   
}