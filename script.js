const game = document.querySelector('.game')
const infoFlags = document.querySelector('.infoFlags')
// const infoMines = document.querySelector('.infoMines')

let sheetSize = 64
let mines = 10
let board = []
let w = 0
let noMine = 0
let flags = mines

function reset() {
    board = []
    noMine = 0
    flags = mines
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
    // mouseBtn 0:left 2:right
    let box = document.querySelector(`.id${i}`)
    if ( mouseBtn == 0 && box.classList.contains('available') ) {
        box.classList.toggle('available')
        if ( board[i] == 0 ) {
            box.classList.toggle('clear')
            clearingClose(i)
            noMine++
        } else if ( board[i] == 9 ) {
            box.innerHTML = 'x'
            box.classList.toggle('boom')
            document.querySelector('.btn-newGame').innerHTML = ':('
            showBombs(false)
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
        showBombs(true)
    }
    showInfo()
}

function showInfo() {
    infoFlags.innerHTML = flags
    // infoMines.innerHTML = noMine+'/'+(board.length-mines)
}

// poner en pantalla box con valor oculto
function placeBox(i) {
    game.innerHTML += `
    <button 
        class="id${i} available" 
        oncontextmenu="event.preventDefault()">
    </button>`
}

// mostrar bombs y flags erradas X
function showBombs(win) {
    for ( let i=0; i<sheetSize; i++ ) {
        let box = document.querySelector(`.id${i}`)
        if ( box.classList.contains('flag') && board[i] != 9 ) {
            box.innerHTML = 'x'
        } else if ( board[i] == 9 && !box.classList.contains('flag') ) {
            if ( win == true ) {
                // si se gana se muestran las bombas restantes como flag
                box.classList.toggle('flag')
                flags = 0
            } else if ( win == false ) {
                box.classList.toggle('bomb')
                box.innerHTML = 'x'
            }
        }

        document.querySelector(`.id${i}`).removeEventListener('mouseup',clicHandler,true)

        // elimino el clic visual available:active
        if ( box.classList.contains('available') ) {
            box.classList.toggle('available')
            box.classList.toggle('noClic')
        }
    }
}

// mostrar todos los valores
function show() {
    for ( let i=0; i<sheetSize; i++ ) {
        if ( board[i] == 9 ) clic(i,2)
        else clic(i,0)
    }    
}    

function clicHandler(event) {
    // pasando el id no puedo remover el listener
    // entonces obtengo el id del event
    let id = parseInt(event.path[0].classList[0].slice(2))
    // event.path deprecated?
    // let id = parseInt(event.composedPath[0].classList[0].slice(2))
    clic(id,event.button)
}

function newGame() {
    reset()
    document.querySelector('.btn-newGame').innerHTML = ':)'
    game.innerHTML = ''
    for ( let i=0; i<sheetSize; i++ ) {
        placeBox(i)
    }

    // listeners id y que mousebutton
    for ( let i=0; i<sheetSize; i++ ) {
        document.querySelector(`.id${i}`).addEventListener('mouseup',clicHandler,true)
    }
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