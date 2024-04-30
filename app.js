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
            square.firstChild.firstChild.classList.add('white')
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('black')

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
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    // console.log("taken: ",taken);
    const opponentGO = playerGo === 'white'? 'black' : 'white'
    // console.log('opponentGo: ', opponentGO);
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGO)
    // console.log(takenByOpponent);
    if (correctGo){
        if (takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()

            return
        }
        if (taken && !takenByOpponent){
            infoDisplay.textContent = "you cannot go here!"
            setTimeout(() => infoDisplay.textContent= "", 2000)
            return
        }

        if (valid){
            e.target.append(draggedElement)
            changePlayer()
            return
        }
    }

}


function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;

    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
            // Check if the move is valid for a pawn
            if (starterRow.includes(startId) && (startId + width * 2 === targetId || startId + width === targetId)) {
                return true; // Pawn can move one or two squares forward from the starting row
            } else if ((startId + width - 1 === targetId || startId + width + 1 === targetId) && 
                       document.querySelector(`[square-id="${targetId}"]`).firstChild) {
                return true; // Pawn can capture diagonally only if there's an opponent's piece
            } else if (startId + width === targetId && !document.querySelector(`[square-id="${targetId}"]`).firstChild) {
                return true; // Pawn can move one square forward only if the target square is empty
            }
            break;
        // Add cases for other piece types as needed
        case 'knight':
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width - 2 === targetId ||
                startId - width + 2 === targetId 

            ) {
                return true
            }
            break;
        case 'bishop':
            // Check if the move is valid for a bishop
            const diff = targetId - startId;
            const absDiff = Math.abs(diff);
            const isDiagonal = absDiff % (width - 1) === 0 || absDiff % (width + 1) === 0;
            console.log(isDiagonal);
            const isClearPath = checkClearPath(startId, targetId);
            if (isDiagonal && isClearPath) {
                return true; // Bishop can move diagonally if the path is clear
            }
            break;
        
        case 'rook':
            const startRow = Math.floor(startId / width);
            const startCol = startId % width;
            const targetRow = Math.floor(targetId / width);
            const targetCol = targetId % width;
        
            // Check if the move is along a row or a column
            if (startRow === targetRow || startCol === targetCol) {
                // Determine the direction of movement
                const rowDirection = Math.sign(targetRow - startRow);
                const colDirection = Math.sign(targetCol - startCol);
        
                let currentRow = startRow + rowDirection;
                let currentCol = startCol + colDirection;
        
                // Iterate through squares in the path
                while (currentRow !== targetRow || currentCol !== targetCol) {
                    const currentId = currentRow * width + currentCol;
                    const currentSquare = document.querySelector(`[square-id="${currentId}"]`);
                    
                    // Check for obstacles
                    if (currentSquare.firstChild) {
                        return false; // Path is blocked by a piece
                    }
                    
                    // Move to the next square
                    currentRow += rowDirection;
                    currentCol += colDirection;
                }
                
                // If the loop completes without finding obstacles, return true
                return true;
            }
            break;
        case 'queen':
            // Check if the move is valid for a queen
            const rowDiff = Math.floor(startId / width) - Math.floor(targetId / width);
            const colDiff = startId % width - targetId % width;
        
            // Check if the move is horizontal, vertical, or diagonal
            const isHorizontal = rowDiff === 0 && colDiff !== 0;
            const isVertical = rowDiff !== 0 && colDiff === 0;
            const isDiagonalTrue = Math.abs(rowDiff) === Math.abs(colDiff);
        
            // Check if the path is clear for horizontal, vertical, or diagonal movement
            const isClearPathTrue =
                isHorizontal
                    ? checkClearPath(startId, targetId, 'horizontal')
                    : isVertical
                    ? checkClearPath(startId, targetId, 'vertical')
                    : checkClearPath(startId, targetId, 'diagonal');
        
            if ((isHorizontal || isVertical || isDiagonalTrue) && isClearPathTrue) {
                return true; // Valid move for the queen
            }
            break;
        
        case 'king':
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width - 1 === targetId ||
                startId + width + 1 === targetId ||
                startId - width - 1 === targetId ||
                startId - width + 1 === targetId
            ) {
                return true
            }
        
            

        default:
            return false; // Default case: invalid move for unknown piece type
    }
    return false; // Default case: invalid move
}


function checkClearPath(startId, targetId) {
    const startRow = Math.floor(startId / width);
    const startCol = startId % width;
    const targetRow = Math.floor(targetId / width);
    const targetCol = targetId % width;

    const rowDirection = Math.sign(targetRow - startRow);
    const colDirection = Math.sign(targetCol - startCol);

    let currentRow = startRow + rowDirection;
    let currentCol = startCol + colDirection;

    while (currentRow !== targetRow || currentCol !== targetCol) {
        const currentId = currentRow * width + currentCol;
        const currentSquare = document.querySelector(`[square-id="${currentId}"]`);
        if (currentSquare.firstChild) {
            return false; // Path is blocked by a piece
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }
    return true;
}



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


// Function to check if a player's king is in check
function isInCheck(playerGo) {
    // Find the position of the player's king
    const kingSquare = document.querySelector(`.square .${playerGo}-king`);
    const kingId = parseInt(kingSquare.parentNode.getAttribute('square-id'));

    // Check if any opponent's piece can capture the king
    const opponentColor = (playerGo === 'white') ? 'black' : 'white';
    const opponentPieces = document.querySelectorAll(`.square .${opponentColor}`);
    for (const piece of opponentPieces) {
        if (checkIfValidMove(piece.parentNode.getAttribute('square-id'), kingId)) {
            infoDisplay.textContent = " You are in Check!"
            setTimeout(() => infoDisplay.textContent= "", 2000)
            return true; // King is in check
        }
    }
    return false; // King is not in check
}