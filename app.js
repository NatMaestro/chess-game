const gameboard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")

const width = 8
let playerGo = 'white'
playerDisplay.textContent = 'white'

const startPieces = [
    rook, knight, bishop,queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop,queen, king, bishop, knight, rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)

        const row = Math.floor( (63 - i) / 8) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0? "beige" : "brown")
        } else {
            square.classList.add(i % 2 === 0? "brown" : "beige")
        }

        if ( i <= 15 ) {
            square.firstChild.firstChild.classList.add('black')
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white')

        }
        gameboard.append(square)
    })
}

createBoard()


const allSquares = document.querySelectorAll(" .square")

allSquares.forEach(square =>{
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)


})


let startPositionId
let draggedElement

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    // changePlayer()
    console.log(e.target);
    console.log(draggedElement);
    // console.log("playerGO: ", playerGo);
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const WrongGo = draggedElement.firstChild.classList.contains(!playerGo)
    console.log("correctGo: ", correctGo);
    
    
    // const valid = checkIfValid()
    if (correctGo){
        const taken = e.target.classList.contains('piece')
        console.log("taken: ",taken);
        changePlayer()
        const opponentGO = playerGo === 'white'? 'black' : 'white'
        console.log('opponentGo: ', opponentGO);
        const takenByOpponent = e.target.firstChild?.classList.contains(playerGo)
        console.log("takenByOpponent: ", takenByOpponent);
        if (takenByOpponent){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            console.log("playerGO: ", playerGo);
            console.log("Opponent is", opponentGO);
            return
        } else {
            infoDisplay.textContent = "You cannot move here!"
            setTimeout(() => infoDisplay.textContent= "", 2000)
            return
        }
    } else {
        infoDisplay.textContent = "Not your turn!"
        setTimeout(() => infoDisplay.textContent= "", 2000)
        return
    }

    // if (taken && !takenByOpponent){
    //     infoDisplay.textContent = "you cannot go here!"
    //     setTimeout(() => infoDisplay.textContent= "", 2000)
    //     return
    // }

    // if (valid){
    //     e.target.append(draggedElement)
    //     changePlayer()
    //     return
    // }

}


// function checkIfValid(target) {
//     console.log(target);
// }

function changePlayer() {
    if (playerGo === "white") {
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = "black"
    } else {
        revertIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    }
}

function reverseIds() {
      const allSquares = document.querySelectorAll(".square")
      allSquares.forEach((square, i) => square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}