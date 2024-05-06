$(document).ready(function() {
  // Function to add a piece to the board
  function addPiece(pieceName, row, col) {
    let imgPath = pieceName + '.png';
    $('#board .square[data-row="' + row + '"][data-col="' + col + '"]').append(`<img src="${imgPath}" alt="${pieceName}">`);
  }

  // Create the chessboard squares
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let color = (i + j) % 2 === 0 ? 'light' : 'dark';
      $('#board').append(`<div class="square ${color}" data-row="${i}" data-col="${j}"></div>`);
    }
  }

  // Data Model (2D Array)
  let boardState = [
    ['rookblack', 'knightblack', 'bishopblack', 'queenblack', 'kingblack', 'bishopblack', 'knightblack', 'rookblack'],
    ['blackpawn', 'blackpawn', 'blackpawn', 'blackpawn', 'blackpawn', 'blackpawn', 'blackpawn', 'blackpawn'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['whitepawn', 'whitepawn', 'whitepawn', 'whitepawn', 'whitepawn', 'whitepawn', 'whitepawn', 'whitepawn'],
    ['rookwhite', 'knightwhite', 'bishopwhite', 'queenwhite', 'kingwhite', 'bishopwhite', 'knightwhite', 'rookwhite']
  ];

  // Add the pieces based on the data model
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        addPiece(boardState[i][j], i, j);
      }
    }
  }

  // Variables to track selected piece and movement
  let selectedPiece = null;
  let selectedSquare = null;
function isValidMoveForPawn(startRow, startCol, endRow, endCol) {
  console.log("Checking pawn move from", startRow, startCol, "to", endRow, endCol);

  let piece = boardState[startRow][startCol];
  console.log("Piece:", piece);

 let pieceColor = piece.slice(0, -4); // Extract "black" or "white"
  console.log("Piece color:", pieceColor);

 let direction = pieceColor.includes('black') ? 1 : -1; // Direction of movement
  console.log("Direction:", direction);

  // Basic pawn movement (one step forward)
  if (endCol === startCol && endRow === startRow + direction && !boardState[endRow][endCol]) {
    console.log("Valid one-step forward move");
    return true;
  }

  // Starting pawn movement (two steps forward)
  if ((startRow === 1 && pieceColor === 'black') || (startRow === 6 && pieceColor === 'white')) {
    if (endCol === startCol && endRow === startRow + direction * 2 && !boardState[endRow][endCol] && !boardState[startRow + direction][endCol]) {
      console.log("Valid two-step forward move");
      return true;
    } else {
      console.log("Invalid two-step forward move");
    }
  }

  // Pawn captures (diagonal)
  if (Math.abs(endCol - startCol) === 1 && endRow === startRow + direction && boardState[endRow][endCol] && boardState[endRow][endCol].includes(pieceColor === 'black' ? 'white' : 'black')) {
    console.log("Valid diagonal capture");
    return true;
  } else {
    console.log("Invalid diagonal capture");
  }

  console.log("Invalid pawn move");
  return false;
}  // Function to check valid moves for a rook
  function isValidMoveForRook(startRow, startCol, endRow, endCol) {
    if (startRow === endRow) {
      // Horizontal movement
      const step = startCol < endCol ? 1 : -1;
      for (let c = startCol + step; c !== endCol; c += step) {
        if (boardState[startRow][c]) {
          return false; // Obstacle found
        }
      }
    } else if (startCol === endCol) {
      // Vertical movement
      const step = startRow < endRow ? 1 : -1;
      for (let r = startRow + step; r !== endRow; r += step) {
        if (boardState[r][startCol]) {
          return false; // Obstacle found
        }
      }
    } else {
      return false; // Not horizontal or vertical movement
    }

    // Check if the destination square is empty or occupied by an opponent's piece
    const targetPiece = boardState[endRow][endCol];
    if (!targetPiece || (targetPiece.includes('black') !== boardState[startRow][startCol].includes('black'))) {
      return true;
    }
    return false;
  }

  // Function to check valid moves for a knight
  function isValidMoveForKnight(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);

    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      const targetPiece = boardState[endRow][endCol];
      if (!targetPiece || (targetPiece.includes('black') !== boardState[startRow][startCol].includes('black'))) {
        return true;
      }
    }

    return false;
  }

  // Function to check valid moves for a bishop
 function isValidMoveForBishop(startRow, startCol, endRow, endCol) {
  // Check if the move is diagonal (same number of squares moved horizontally and vertically)
  if (Math.abs(startRow - endRow) === Math.abs(startCol - endCol)) {
    // Determine the direction of movement (up/down, left/right)
    const rowDirection = Math.sign(endRow - startRow);
    const colDirection = Math.sign(endCol - startCol);

    // Check for obstacles along the diagonal path
    let currentRow = startRow + rowDirection;
    let currentCol = startCol + colDirection;
    while (currentRow !== endRow && currentCol !== endCol) {
      if (boardState[currentRow][currentCol]) {
        return false; // Obstacle found
      }
      currentRow += rowDirection;
      currentCol += colDirection;
    }

    // Check if the destination square is empty or occupied by an opponent's piece
    const targetPiece = boardState[endRow][endCol];
    if (!targetPiece || (targetPiece.includes('black') !== boardState[startRow][startCol].includes('black'))) {
      return true; // Valid move
    }
  }

  return false; // Not a valid diagonal move
}
  // Function to check valid moves for a queen
  function isValidMoveForQueen(startRow, startCol, endRow, endCol) {
    return isValidMoveForRook(startRow, startCol, endRow, endCol) || isValidMoveForBishop(startRow, startCol, endRow, endCol);
  }

  // Function to check valid moves for a king (placeholder)
 function isValidMoveForKing(startRow, startCol, endRow, endCol) {
  // King moves one square in any direction
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);
  if (rowDiff <= 1 && colDiff <= 1) {
    // Simulate the move on a temporary board state
    let tempBoardState = boardState.map(row => row.slice()); // Create a copy of the board state
    tempBoardState[endRow][endCol] = tempBoardState[startRow][startCol];
    tempBoardState[startRow][startCol] = null;

    // Check if the king is in check on the temporary board
    let kingColor = tempBoardState[endRow][endCol].substring(0, 5);
    if (isCheck(kingColor, tempBoardState)) {
      return false; // Move would put king in check
    }

    // Check if the destination square is empty or occupied by an opponent's piece
    const targetPiece = boardState[endRow][endCol];
    if (!targetPiece || (targetPiece.includes('black') !== boardState[startRow][startCol].includes('black'))) {
      return true;
    }
  }
  return false;
}

// Function to check if a king of the specified color is in check
function isCheck(color, board) {
  // Find the king's position
  let kingRow, kingCol;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `king${color}`) {
        kingRow = r;
        kingCol = c;
        break;
      }
    }
  }

  // Check if any opponent piece can attack the king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.includes(color === 'black' ? 'white' : 'black')) {
        if (isValidMoveForPiece(piece, r, c, kingRow, kingCol, board)) {
          return true; // King is in check
        }
      }
    }
  }

  return false; // King is not in check
}

// Helper function to call the appropriate validation function based on piece type
function isValidMoveForPiece(pieceType, startRow, startCol, endRow, endCol, board = boardState) {
  switch (pieceType) {
    case 'blackpawn':
    case 'whitepawn':
      return isValidMoveForPawn(startRow, startCol, endRow, endCol);
    case 'rookblack':
    case 'rookwhite':
      return isValidMoveForRook(startRow, startCol, endRow, endCol);
    case 'knightblack':
    case 'knightwhite':
      return isValidMoveForKnight(startRow, startCol, endRow, endCol);
    case 'bishopblack':
    case 'bishopwhite':
      return isValidMoveForBishop(startRow, startCol, endRow, endCol);
    case 'queenblack':
    case 'queenwhite':
      return isValidMoveForQueen(startRow, startCol, endRow, endCol);
    case 'kingblack':
    case 'kingwhite':
      return isValidMoveForKing(startRow, startCol, endRow, endCol);
    default:
      return false; // Invalid piece type
  }
}
  function highlightPossibleMoves(pieceType, startRow, startCol) {
    // Clear previous highlights
    $('.square').removeClass('possible-move');

    // Iterate over the board and check valid moves for each square
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMoveForPiece(pieceType, startRow, startCol, r, c)) {
          // Highlight the square as a possible move
          $(`.square[data-row="${r}"][data-col="${c}"]`).addClass('possible-move');
        }
      }
    }
  }
let currentPlayer = 'white';
$('.square').click(function() {
  let square = $(this);
  let row = square.data('row');
  let col = square.data('col');

  // If a piece is already selected, attempt to move it
  if (selectedPiece) {
    let pieceType = selectedPiece.attr('alt');
    let startRow = selectedSquare.data('row');
    let startCol = selectedSquare.data('col');

    // Call the appropriate validation function based on piece type
    let isValidMove = false;
    switch (pieceType) {
      case 'blackpawn':
      case 'whitepawn':
        isValidMove = isValidMoveForPawn(startRow, startCol, row, col);
        break;
      case 'rookblack':
      case 'rookwhite':
        isValidMove = isValidMoveForRook(startRow, startCol, row, col);
        break;
      case 'knightblack':
      case 'knightwhite':
        isValidMove = isValidMoveForKnight(startRow, startCol, row, col);
        break;
      case 'bishopblack':
      case 'bishopwhite':
        isValidMove = isValidMoveForBishop(startRow, startCol, row, col);
        break;
      case 'queenblack':
      case 'queenwhite':
        isValidMove = isValidMoveForQueen(startRow, startCol, row, col);
        break;
      case 'kingblack':
      case 'kingwhite':
        isValidMove = isValidMoveForKing(startRow, startCol, row, col);
        break;
    }

    if (isValidMove) {
        let targetPiece = square.find('img');
        if (targetPiece.length > 0) {
          // Remove the existing piece image
          targetPiece.remove();
        }
      // Move is valid, update the board
      selectedPiece.detach().appendTo(square);

      // Update the board state data model
      boardState[row][col] = boardState[startRow][startCol];
      boardState[startRow][startCol] = null;
      currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
      $('.square').removeClass('possible-move');

      // ... (add logic for turn-based system, check detection, etc.) ...
    } else {
      // ... (invalid move feedback) ...
    }

    // Remove highlighting from the previously selected square
    selectedSquare.removeClass('selected');

    // Reset selected piece and square
    selectedPiece = null;
    selectedSquare = null;
  } else {
    // Check if the clicked square contains a piece
    let piece = square.find('img');
   if (piece.length > 0 && piece.attr('alt').includes(currentPlayer)) {
      // Remove highlighting from any previously selected square
      if (selectedSquare) {
        selectedSquare.removeClass('selected');
      }

      // Select the new piece and highlight the square
      selectedPiece = piece;
      selectedSquare = square;
      square.addClass('selected');

      // Highlight possible moves for the selected piece
      let pieceType = piece.attr('alt');
      highlightPossibleMoves(pieceType, row, col);
    }
  }
});
});
