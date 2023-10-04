const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
ctx.font = "30px Arial"
const playbtn = document.querySelector("#playbtn")

const blackKeys = [2,4,-1,7,9,11]
const whiteKeys = [1,3,5,6,8,10,12,13]
const keybinds = ["y", "s", "x", "d", "c", "v", "g", "b", "h", "n", "j", "m", ","];
//const keybinds = ["KeyZ", "KeyS", "KeyX", "KeyD", "KeyC", "KeyV", "KeyG", "KeyB", "KeyH", "KeyN", "KeyJ", "KeyM"];

const defaultNoteLength = 1/8


var octaveMod = 38
var noteLength = defaultNoteLength
var waveType = defaultType
var holdNotes = false;

var heldNotes = []



function drawKeys() {
    //white keys
    for (let i = 0; i < 8; i++) {
        drawWhitekey(i, heldNotes.includes(whiteKeys[i]))
    }

    //black keys
    for (let i = 0; i < 6; i++) {
        if(i!=2)
        drawBlackkey(i, heldNotes.includes(blackKeys[i]))
    }
}

function drawWhitekey(position, isPressed) {
    if (isPressed) {
        ctx.fillStyle = "#FF0"
        ctx.fillRect(position*100,0,100,400)
    }
    else {
        ctx.fillStyle = "#FFF"
        ctx.fillRect(position*100,0,100,400)
    }
    ctx.fillStyle = "#000"
    ctx.strokeRect(position * 100,0,100,400)

    let letter = keybinds[whiteKeys[position]-1]
    ctx.fillText(letter, position*100+40, 350)
}

function drawBlackkey(position, isPressed) {
    if(isPressed) {
        ctx.fillStyle = "#FF0"
    }
    else
    {
        ctx.fillStyle = "#000"
    }
    ctx.fillRect(position*100 + 75,0,50,250)
    ctx.strokeRect(position*100 + 75,0,50,250)

    ctx.fillStyle = "#FFF"
    let letter = keybinds[blackKeys[position]-1]
    ctx.fillText(letter, (position*100)+95, 230)
}




function initPiano() {
    initSound()
    drawKeys()
    playbtn.disabled = true

    window.addEventListener("keydown", (key) => {
        let keyIdx = keybinds.indexOf(key.key) +1
        if(keyIdx > 0 && !heldNotes.includes(keyIdx)){
            heldNotes.push(keyIdx)
            playNote(keyIdx + octaveMod, noteLength, holdNotes, waveType)
            drawKeys()
            
        }
    })

    window.addEventListener("keyup", (key) => {
        let keyIdx = keybinds.indexOf(key.key) +1
        if(heldNotes.includes(keyIdx)){
            heldNotes.splice(heldNotes.indexOf(keyIdx), 1)
            drawKeys()
    
        }
    })

    //playbtn.removeEventListener('click', initPiano)
    playbtn.remove()
    canvas.style.display = "block"
}

 

playbtn.addEventListener('click', initPiano)


// let intervalId = setInterval(() => {
//     drawKeys()
// }, 100)

