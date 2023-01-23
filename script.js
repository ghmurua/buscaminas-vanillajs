const game = document.querySelector('.game')
const infoFlags = document.querySelector('.infoFlags')
const infoTime = document.querySelector('.infoTime')
const container = document.querySelector('.container')

let sheetSize = 64
let mines = 10
let board = []
let w = 8
let noMine = 0
let flags = mines
let time = 0
let interval = 0
let timesRunning = false

function startTime() {
    interval = setInterval(()=>{
        time++
        showInfo()
    },1000)
    timesRunning = true
}

function stopTime() {
    clearInterval(interval)
    timesRunning = false
}

function reset() {
    board = []
    noMine = 0
    flags = mines
    time = 0
    stopTime()
    showInfo()
    // casilleros vacios
    let length = sheetSize-mines
    for ( let i=0; i<length; i++ ) {
        board.push(0)
    }
    
    // se agregan las minas
    for ( let i=0; i<mines; i++ ) {
        let index = Math.ceil(Math.random()*sheetSize)
        board.splice(index,0,9)
    }
    
    // se obtiene el numero de minas adyacentes
    for ( let i=0; i<sheetSize; i++ ) {
        let count = 0
        let wall = ''
        if ( i%w == 0 ) wall = 'L'
        if ( (i+1)%w == 0 ) wall = 'R'
        if ( board[i] != 9 ) {
            if ( board[i-(w-1)] == 9 && wall != 'R' ) count++
            if ( board[i-w] == 9 ) count++
            if ( board[i-(w+1)] == 9 && wall != 'L' ) count++
            if ( board[i-1] == 9 && wall != 'L' ) count++     // -w+1  -w   w-1
            if ( board[i+1] == 9 && wall != 'R' ) count++     // -1     i    +1
            if ( board[i+(w-1)] == 9 && wall != 'L' ) count++ // +w-1  +w   w+1
            if ( board[i+w] == 9 ) count++
            if ( board[i+(w+1)] == 9 && wall != 'R' ) count++
            if ( count == 0 ) board[i] = 0
            else board[i] = count
        }
    }

    if ( container.classList.contains('win') || container.classList.contains('lose') ) {
        container.setAttribute('class','container')
    }
}

function checkIsClear(i) {
    let box = document.querySelector(`.id${i}`)
    if ( box.classList.contains('available') ) {
        clic(i,0)
    }
}

function clearingClose(i) {
    let bottom = i+w < sheetSize
    let top = i-w >= 0
    let left = i%w != 0
    let right = (i+1)%w != 0
    if ( left ) checkIsClear(i-1)
    if ( right ) checkIsClear(i+1)
    if ( top ) checkIsClear(i-w)
    if ( bottom ) checkIsClear(i+w)
    if ( top && left ) checkIsClear(i-(w+1))
    if ( top && right ) checkIsClear(i-(w-1))
    if ( bottom && left ) checkIsClear(i+(w-1))
    if ( bottom && right ) checkIsClear(i+(w+1))
}

function clic(i,mouseBtn) {
    if ( timesRunning == false ) {
        startTime()
    }
    // mouseBtn 0:left 2:right
    let box = document.querySelector(`.id${i}`)
    if ( mouseBtn == 0 && box.classList.contains('available') ) {
        box.classList.toggle('available')
        if ( board[i] == 0 ) {
            box.classList.toggle('clear')
            clearingClose(i)
            noMine++
        } else if ( board[i] == 9 ) {
            box.classList.toggle('boom')
            document.querySelector('.btn-newGame').innerHTML = ':('
            showBombs(false)
            container.classList.add('lose')
        } else {
            box.classList.toggle('bound')
            box.classList.toggle(`b${board[i]}`)
            box.innerHTML = board[i]
            noMine++
        }
    } else if ( mouseBtn == 2 ) {
        if ( box.classList.contains('available') && flags > 0 ) {
            box.classList.toggle('flag')
            box.classList.toggle('available')
            flags--
        } else if ( box.classList.contains('flag') ){
            box.classList.toggle('flag')
            box.classList.toggle('available')
            flags++
        }
    }

    // win
    if ( noMine == sheetSize - mines ) {
        document.querySelector('.btn-newGame').innerHTML = ':O'
        container.classList.add('win')
        showBombs(true)
    }
    showInfo()
}

function showInfo() {
    if ( flags < 10 ) infoFlags.innerHTML = '00'+flags
    else if ( flags < 100 ) infoFlags.innerHTML = '0'+flags
    else infoFlags.innerHTML = flags
    if ( time < 10 ) infoTime.innerHTML = '00'+time
    else if ( time < 100 ) infoTime.innerHTML = '0'+time
    else infoTime.innerHTML = time
}

// mostrar bombs y flags erradas
function showBombs(win) {
    for ( let i=0; i<sheetSize; i++ ) {
        let box = document.querySelector(`.id${i}`)
        if ( box.classList.contains('flag') && board[i] != 9 ) {
            box.classList.toggle('failFlag')
        } else if ( board[i] == 9 && !box.classList.contains('flag') ) {
            if ( win == true ) {
                // si se gana se muestran las bombas restantes como flag
                box.classList.toggle('flag')
                flags = 0
            } else if ( win == false ) {
                box.classList.toggle('bomb')
            }
        }

        // elimino el clic visual available:active
        if ( box.classList.contains('available') ) {
            box.classList.toggle('available')
            box.classList.toggle('noClic')
        }
    }
    stopTime()
    document.querySelector('.game').removeEventListener('mouseup',clicHandler,true)
}

// mostrar todos los valores
function show() {
    for ( let i=0; i<sheetSize; i++ ) {
        if ( board[i] == 9 ) clic(i,2)
        else clic(i,0)
    }    
}    

function clicHandler(event) {
    if (event.target.localName==='button') {
        let id = parseInt(event.target.classList[0].slice(2))
        clic(id,event.button)
    }
}

function newGame() {
    reset()
    document.querySelector('.btn-newGame').innerHTML = ':)'
    game.innerHTML = ''
    for ( let i=0; i<sheetSize; i++ ) {
        let box = document.createElement('BUTTON')
        box.setAttribute('class',`id${i} available`)
        game.appendChild(box)
    }

    document.querySelector('.game').addEventListener('mouseup',clicHandler,true)
}

function newLevel(level) {
    if ( level == 1 ) {
        sheetSize = 64
        w = 8
        mines = 10
        game.setAttribute('class','game w8')
    } else if ( level == 2 ) {
        sheetSize = 256
        w = 16
        mines = 40
        game.setAttribute('class','game w16')
    } else if ( level == 3 ) {
        sheetSize = 512
        w = 32
        mines = 99
        game.setAttribute('class','game w32')
    }
    newGame()
}

newGame()