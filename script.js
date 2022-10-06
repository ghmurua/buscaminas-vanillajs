const game = document.querySelector('.game')
const infoFlags = document.querySelector('.infoFlags')
const infoMines = document.querySelector('.infoMines')

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
    for ( let i=0; i<sheetSize-mines; i++ ) {
        board.push(0)
    }

    // se agregan las minas
    for ( let i=0; i<mines; i++ ) {
        let index = Math.ceil(Math.random()*board.length)
        board.splice(index,0,9)
    }

    // se obtiene el numero de minas adyacentes
    for ( let i=0; i<board.length; i++ ) {
        w = Math.sqrt(sheetSize)    // w = medida de cada lado
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
    if ( i%w != 0 ) checkIsClear(i-1)           // left
    if ( (i+1)%w != 0 ) checkIsClear(i+1)       // right
    if ( i+w < sheetSize ) checkIsClear(i+w)    // top
    if ( i-w >= 0 ) checkIsClear(i-w)           // bottom
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
            document.querySelector('.btn-newGame').innerHTML = ':('
            showBombs()
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
    }
    showInfo()
}

function showInfo() {
    infoFlags.innerHTML = flags
    infoMines.innerHTML = noMine+'/'+(board.length-mines)
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
function showBombs() {
    for ( let i=0; i<sheetSize; i++ ) {
        let box = document.querySelector(`.id${i}`)
        if ( box.classList.contains('flag') && board[i] != 9 ) {
            box.innerHTML = 'x'
        } else if ( board[i] == 9 && !box.classList.contains('flag') ) {
            box.classList.toggle('bomb')
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

function newGame() {
    reset()
    document.querySelector('.btn-newGame').innerHTML = ':)'
    game.innerHTML = ''
    for ( let i=0; i<sheetSize; i++ ) {
        placeBox(i)
    }

    // listeners id y que mousebutton
    for ( let i=0; i<board.length; i++ ) {
        document.querySelector(`.id${i}`).addEventListener('mouseup',(e)=>{
            clic(i,e.button)
        })
    }
}

newGame()