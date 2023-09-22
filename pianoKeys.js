const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const playbtn = document.querySelector("#playbtn")

const blackKeys = [2,4,-1,7,9,11]
const whiteKeys = [1,3,5,6,8,10,12]

const keybinds = ["KeyZ", "KeyS", "KeyX", "KeyD", "KeyC", "KeyV", "KeyG", "KeyB", "KeyH", "KeyN", "KeyJ", "KeyM"];

var octaveMod = 38

var heldKeys = []
var heldNotes = []



function drawKeys() {
    //white keys
    for (let i = 0; i < 7; i++) {
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
}




function initPiano() {
    drawKeys()
    initSound()
    playbtn.disabled = true

    window.addEventListener("keydown", (key) => {
        let keyIdx = keybinds.indexOf(key.code) +1
        if(keyIdx != -1 && !heldNotes.includes(keyIdx)){
            heldNotes.push(keyIdx)
            appendNote(keyIdx + octaveMod, 1/8)
            playBuffer()
            drawKeys()
    
        }
    })

    window.addEventListener("keyup", (key) => {
        let keyIdx = keybinds.indexOf(key.code) +1
        if(heldNotes.includes(keyIdx)){
            heldNotes.splice(heldNotes.indexOf(keyIdx), 1)
            drawKeys()
    
        }
    })

    playbtn.removeEventListener('click', initPiano)
}

 

playbtn.addEventListener('click', initPiano)


// let intervalId = setInterval(() => {
//     drawKeys()
// }, 100)

