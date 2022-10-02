const game = document.querySelector('.game')

let sheetSize = 64
let mines = 10
let board = []

function reset() {
    board = []
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
        let w = Math.sqrt(sheetSize)    // w = medida de cada lado
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

function clic(i,mouseBtn) {
    // mouseBtn 0:left 2:right
    let box = document.querySelector(`.id${i}`)
    if ( mouseBtn == 0 && box.classList.contains('available') ) {
        box.classList.toggle('available')
        if ( box.classList.contains('flag') ) box.classList.toggle('flag')
        if ( board[i] == 0 ) {
            box.classList.toggle('clear')
            box.innerHTML = ' '
        } else if ( board[i] == 9 ) {
            box.classList.toggle('bomb')
            box.innerHTML = '*'
        } else {
            box.classList.toggle('bound')
            box.innerHTML = board[i]
        }
    } else if ( mouseBtn == 2 && box.classList.contains('available')) {
        box.classList.toggle('flag')
    }
}

// poner en pantalla box con valor expuesto
function showBox(i) {
    game.innerHTML += `${
    (board[i] == 9)
        ? `<button id="${i}" class="bomb">*</button>`
        : `<button onclick="clic(${i})">${board[i]}</button>`
    }`
}

// poner en pantalla box con valor oculto
function placeBox(i) {
    game.innerHTML += `
    <button 
        class="id${i} available" 
        oncontextmenu="event.preventDefault()">
    </button>`
}

// mostrar todos los valores
function show() {
    game.innerHTML = ''
    for ( let i=0; i<sheetSize; i++ ) {
        showBox(i)
    }
}

function newGame() {
    reset()
    game.innerHTML = ''
    for ( let i=0; i<sheetSize; i++ ) {
        placeBox(i)
    }

    // listeners id y que mousebutton
    for ( let i=0; i<board.length; i++ ) {
        document.querySelector(`.id${i}`).addEventListener('mousedown',(e)=>{
            clic(i,e.button)
        })
    }
}
