const noteLengthInput = document.querySelector("#noteLengthInput")
const waveSelect = document.querySelector("#waveSelect")
const triPeakDiv = document.querySelector("#triPeakDiv")
const triPeakInput = document.querySelector("#triPeakInput")
const ampInput = document.querySelector("#ampInput")
const settingsForm = document.querySelector("#settingsForm")
const octPlus = document.querySelector("#octPlus")
const octMinus = document.querySelector("#octMinus")

function updateSettings(){
    if(noteLengthInput.value == "") noteLengthInput.value =defaultNoteLength
    else noteLength = parseFloat(eval(noteLengthInput.value))
    waveType = waveSelect.options[waveSelect.selectedIndex].value
    if(waveType == "triangle") {
        triPeakDiv.style.display = "inline"
        if(triPeak >= 0.9) {
            triPeak = 0
            triPeakInput.value = 0
        }
    }
    else {
        triPeakDiv.style.display = "none"
        console.log("hi")
    }

    if(triPeakInput.value == "")triPeakInput.value = defaultTriPeak
    else triPeak = triPeakInput.value;
    if(ampInput.value == "") ampInput.value = defaultAmp
    else amp = ampInput.value

}

function raiseOct() {
    if(octaveMod + 12 < 76) {
        octaveMod += 12
    }
    console.log(octaveMod)
}

function lowerOct() {
    if(octaveMod - 12 >= 26) {
        octaveMod -= 12
    }
    console.log(octaveMod)
}
console.log(octaveMod)
octPlus.addEventListener('click', raiseOct)
octMinus.addEventListener('click', lowerOct)


settingsForm.addEventListener('change', updateSettings)

