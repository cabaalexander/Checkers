$(document).ready(function() {
    function createBoard() {
        var result = [];
        for (var x = 0; x < 8; x++) {
            var row = [];
            for (var y = 0; y < 8; y++) {
                if (x % 2 === 0) {
                    row.push(y % 2 === 0 ? 0 : 1);
                }
                else {
                    row.push(y % 2 === 0 ? 1 : 0);
                }
            }
            result.push(row);
        }
        return result;
    }

    function Piece(y, x) {
        this.coords = {
            y: y,
            x: x
        };
    }

    function createPieces() {
        var pieces = {
            playerOne: [],
            cpu: []
        };
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                if ((x + y) % 2 === 0) {
                    var piece = new Piece(y, x);
                    if (y < 3){
                        piece.color = "Red";
                        pieces.playerOne.push(piece);
                    }
                    if (y > 4){
                        piece.color = "White";
                        pieces.cpu.push(piece);
                    }
                }
            }
        }
        return pieces;
    }
 
    function removeMoveIfPieceOnBoard(moves) {
        $(moves).each(function(movesIndex, move) { //if a move from moves is on the set of pieces, deletes it
            var moveString = JSON.stringify(move);
            Object.keys(pieces).forEach(function(player) { //loop through each player
                $(pieces[player]).each(function(indexPiece, piece) { //loop through each piece of the player
                    var pieceString = JSON.stringify(piece.coords);
                    if (moveString === pieceString) {
                        delete moves[movesIndex];
                        // moves.splice(movesIndex, 1);
                        return false;
                    }
                });
            });
        });
    }

    function move(piece) {
        var boardBeginning = 0;
        var boardLimit = 7;
        var step = 1;
        var moves = [];
        if (piece.color === "Red" && piece.coords.y < boardLimit) {
            if (piece.coords.x > boardBeginning) {
                moves.push({
                    y: piece.coords.y + step,
                    x: piece.coords.x - step
                });
            }
            if (piece.coords.x < boardLimit){
                moves.push({
                    y: piece.coords.y + step,
                    x: piece.coords.x + step
                });
            }
        }
        else if (piece.coords.y > boardBeginning) {
            if (piece.coords.x > boardBeginning) {
                moves.push({
                    y: piece.coords.y - step,
                    x: piece.coords.x - step
                });
            }
            if (piece.coords.x < boardLimit) {
                moves.push({
                    y: piece.coords.y - step,
                    x: piece.coords.x + step
                });
            }
        }
        removeMoveIfPieceOnBoard(moves);
        return moves;
    }

    function isNextPieceEnemy(piece, jump, leftOrRight) {
        var bool = undefined;
        if (piece.color === "Red") {
            var newY = jump.y - 1;
            var newX = (leftOrRight === "left") ? jump.x + 1 : jump.x - 1;
        }
        else {
            var newY = jump.y + 1;
            var newX = (leftOrRight === "left") ? jump.x + 1 : jump.x - 1;
        }
        var beforeJump = {
            y: newY,
            x: newX
        };
        var beforeJumpString = JSON.stringify(beforeJump);
        for (player in pieces) {
            $(pieces[player]).each(function(playerPieceIndex, playerPiece) {
                var playerPieceString = JSON.stringify(playerPiece.coords);
                if (playerPieceString === beforeJumpString && playerPiece.color != piece.color) {
                    bool = true;
                    return false;
                }
            });
            if (bool)
                break;
        }
        return bool;
    }

    function jump(piece) {
        var boardBeginning = 1;
        var boardLimit = 6;
        var step = 2;
        var jumps = [];
        if (piece.color === "Red" && piece.coords.y < boardLimit) {
            if (piece.coords.x > boardBeginning) {
                var jump = {
                    y: piece.coords.y + step,
                    x: piece.coords.x - step
                };
                if (isNextPieceEnemy(piece, jump, "left"))
                    jumps.push(jump);
            }
            if (piece.coords.x < boardLimit) {
                var jump = {
                    y: piece.coords.y + step,
                    x: piece.coords.x + step
                };
                if (isNextPieceEnemy(piece, jump, "right"))
                    jumps.push(jump);
            }
        }
        else if (piece.coords.y > boardBeginning) {
            if (piece.coords.x > boardBeginning) {
                var jump = {
                    y: piece.coords.y - step,
                    x: piece.coords.x - step
                };
                if (isNextPieceEnemy(piece, jump, "left"))
                    jumps.push(jump);
            }
            if (piece.coords.x < boardLimit) {
                var jump = {
                    y: piece.coords.y - step,
                    x: piece.coords.x + step
                }
                if (isNextPieceEnemy(piece, jump, "right"))
                    jumps.push(jump);
            }
        }
        removeMoveIfPieceOnBoard(jumps);
        return jumps;
    }

    function drawMoveOrJump(piece, movesOrJumps) {
        if (movesOrJumps[0] != null || movesOrJumps[1] != null) {
            $(movesOrJumps).each(function(index, move) {
                if (move == null)
                    return;
                var domMoveOrJump = document.createElement("div");
                $(domMoveOrJump)
                    .addClass("moveSquare")
                    .css({
                        left: 82 * move.x,
                        bottom: 82 * move.y
                    })
                    .click(function() {
                        $(".moveSquare").remove();

                        // alert(directions[index]);

                        // console.log("Piece");
                        // console.log(piece.coords);

                        // console.log("Move");
                        // console.log(move);

                        piece.coords.y = move.y;
                        piece.coords.x = move.x;

                        // console.log("Piece <=> Move");
                        // console.log(piece.coords);

                        updateBoard();
                    });
                $(".playBoard").append(domMoveOrJump);
            });
        }
    }

    function drawBoard() {
        var playBoard = document.createElement("div");
        $(playBoard).addClass("playBoard");
        var table = document.createElement("table");
        $(playBoard).append(table);
        for (var y = 0; y <= 7; y++) {
            var tr = document.createElement("tr");
            for (var x = 0; x <= 7; x++) {
                var td = document.createElement("td");
                if ((x + y) % 2 === 0) {
                    $(td).css("background", "#E66213");
                }
                else {
                    $(td).css("background", "#FBDAC6");
                }
                $(td)
                    .addClass("square")
                    .click(function() {
                        $(".moveSquare").remove();
                    });
                $(tr).append(td);
            }
            $(table).prepend(tr);
        }
        $("body").append(playBoard);
    }

    function drawPieces(pieces) {
        Object.keys(pieces).forEach(function(player) {
            $(pieces[player]).each(function(indexPiece, piece) {
                if (piece == null)
                    return;
                var domPiece = document.createElement("div");
                $(domPiece)
                    .addClass("piece")
                    .css({
                        left: 82 * piece.coords.x,
                        bottom: 82 * piece.coords.y,
                        background: this.color
                    })
                    .click(function(e) {
                        $(".moveSquare").remove();
                        var moves = move(piece);
                        var jumps = jump(piece);
                        // alert(JSON.stringify(indexPiece) + "\n" + JSON.stringify(piece.coords)); //debugging
                        // alert(JSON.stringify(moves)); //debugging
                        // alert(JSON.stringify(jumps)); //debugging
                        // console.log(e);
                        drawMoveOrJump(piece, moves);
                        drawMoveOrJump(piece, jumps);
                    });
                $(".playBoard").append(domPiece);
            })
        });
    }

    function updateBoard() {
        $(".piece").remove();
        drawPieces(pieces);
    }

    var pieces = createPieces();

    //Begin
    $(function() {
        var board = createBoard();
        for (var i = 0; i < 8; i++) {
            $("body").append(board[i] + "<br />");
        }

        $("body").append("<br /> <br />" + JSON.stringify(pieces.playerOne.length));
        $("body").append("<br /> <br />" + JSON.stringify(pieces.cpu.length));

        $("body").append("<br /> <br />" + JSON.stringify(pieces.playerOne));
        $("body").append("<br /> <br />" + JSON.stringify(pieces.cpu));

        $("body").append("<br /> <br />");

        drawBoard();
        drawPieces(pieces);
    });
});