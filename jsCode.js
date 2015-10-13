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
 
    function removeIfInBoard(moves, pieces) {
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

    function move(piece, pieces) {
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
        removeIfInBoard(moves, pieces);
        return moves;
    }

    //THIS METHOD IS TO REFACTOR THE 'jump' METHOD
    function vefiryJumpToTheLeft(piece, jump, jumps, leftOrRight) {
        if (piece.color === "Red") {
            //y: -1
            var newY = jump.y - 1;
            var newX = (leftOrRight === "left") ? jump.x + 1 : jump.x - 1;
        }
        else {
            //y: +1
            var newY = jump.y + 1;
            var newX = (leftOrRight === "left") ? jump.x + 1 : jump.x - 1;
        }
        var beforeJump = {
            y: newY,
            x: newX
        };
        var beforeJumpString = JSON.stringify(beforeJump);
        for (player in pieces) {
            $(pieces[player]).each(function(pieceIndex, pieceLoop) {
                var pieceLoopString = JSON.stringify(pieceLoop.coords);
                if (pieceLoopString === beforeJumpString && pieceLoop.color != piece.color) {
                    jumps.push(jump);
                }
            });
        }
    }

    function jump(piece, pieces) { //move and jump can be refactored as one
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
                var beforeJump = {
                    y: jump.y - 1,
                    x: jump.x + 1 //just this line changes
                };
                var beforeJumpString = JSON.stringify(beforeJump);
                for (player in pieces) {
                    $(pieces[player]).each(function(pieceIndex, pieceLoop) {
                        var pieceLoopString = JSON.stringify(pieceLoop.coords);
                        if (pieceLoopString === beforeJumpString && pieceLoop.color != piece.color) {
                            jumps.push(jump);
                        }
                    });
                }
            }
            if (piece.coords.x < boardLimit) {
                var jump = {
                    y: piece.coords.y + step,
                    x: piece.coords.x + step
                };
                var beforeJump = {
                    y: jump.y - 1,
                    x: jump.x - 1 //just this lines changes
                };
                var beforeJumpString = JSON.stringify(beforeJump);
                for (player in pieces) {
                    $(pieces[player]).each(function(pieceIndex, pieceLoop) {
                        var pieceLoopString = JSON.stringify(pieceLoop.coords);
                        if (pieceLoopString === beforeJumpString && pieceLoop.color != piece.color) {
                            jumps.push(jump);
                        }
                    });
                }
            }
        }
        else if (piece.coords.y > boardBeginning) {
            if (piece.coords.x > boardBeginning) {
                var jump = {
                    y: piece.coords.y - step,
                    x: piece.coords.x - step
                };
                var beforeJump = {
                    y: jump.y + 1,
                    x: jump.x + 1 //this line only changes from the white one
                };
                var beforeJumpString = JSON.stringify(beforeJump);
                for (player in pieces) {
                    $(pieces[player]).each(function(pieceIndex, pieceLoop) {
                        var pieceLoopString = JSON.stringify(pieceLoop.coords);
                        if (pieceLoopString === beforeJumpString && pieceLoop.color != piece.color) {
                            jumps.push(jump);
                        }
                    });
                }
            }
            if (piece.coords.x < boardLimit) {
                var jump = {
                    y: piece.coords.y - step,
                    x: piece.coords.x + step
                }
                var beforeJump = {
                    y: jump.y + 1,
                    x: jump.x - 1 //this line only changes from the white one
                };
                var beforeJumpString = JSON.stringify(beforeJump);
                for (player in pieces) {
                    $(pieces[player]).each(function(pieceIndex, pieceLoop) {
                        var pieceLoopString = JSON.stringify(pieceLoop.coords);
                        if (pieceLoopString === beforeJumpString && pieceLoop.color != piece.color) {
                            jumps.push(jump);
                        }
                    });
                }
            }
        }
        // alert(JSON.stringify(jumps));
        removeIfInBoard(jumps, pieces);
        // alert(JSON.stringify(jumps));
        return jumps;
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
                    .click(function() {
                        $(".moveSquare").remove();
                        var moves = move(piece, pieces);
                        var jumps = jump(piece, pieces);
                        // alert(JSON.stringify(indexPiece) + "\n" + JSON.stringify(piece.coords)); //debugging
                        // alert(JSON.stringify(moves)); //debugging
                        // alert(JSON.stringify(jumps)); //debugging
                        drawMoveOrJump(moves);
                        drawMoveOrJump(jumps);
                    });
                $(".playBoard").append(domPiece);
            })
        });
    }

    function drawMoveOrJump(moves) {
        if (moves[0] != null || moves[1] != null) {  //WAtch this, this returns some times one value others two...
            $(moves).each(function(index, move) {
                if (move == null)
                    return;
                var domMove = document.createElement("div");
                $(domMove)
                    .addClass("moveSquare")
                    .css({
                        left: 82 * $(this)[0].x,
                        bottom: 82 * $(this)[0].y
                    });
                $(".playBoard").append(domMove);
            });
        }
    }

    var pieces = createPieces();

    //append to 'body'
    $(function() {
        var board = createBoard();
        for (var i = 0; i < 8; i++) {
            $("body").append(board[i] + "<br />");
        }

        $("body").append("<br /> <br />" + JSON.stringify(pieces.playerOne.length));
        $("body").append("<br /> <br />" + JSON.stringify(pieces.cpu.length));

        $("body").append("<br /> <br />" + JSON.stringify(pieces.playerOne));
        $("body").append("<br /> <br />" + JSON.stringify(pieces.cpu));

        // $("body").append("<br /> <br />" + JSON.stringify(move(pieces.playerOne[0])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.playerOne[1])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.playerOne[2])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.playerOne[3])));

        // $("body").append("<br /> <br />" + JSON.stringify(move(pieces.cpu[0])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.cpu[1])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.cpu[2])));
        // $("body").append(" <====> " + JSON.stringify(move(pieces.cpu[3])));

        $("body").append("<br /> <br />");

        drawBoard();

        pieces.playerOne[8].coords = {y: 5, x: 3};
        // pieces.cpu[1].coords = {y: 4, x: 2};
        pieces.cpu[0].coords = {y: 4, x: 2};
        pieces.cpu[1].coords = {y: 3, x: 3};
        pieces.playerOne[10].coords = {y: 3, x: 1};
        // pieces.playerOne[10].color = "Blue";
        pieces.playerOne[11].coords = {y: 3, x: 5};
        pieces.cpu[2].coords = {y: 4, x: 6};

        // pieces.cpu[3].coords = {y: 4, x: 6};

        // alert(JSON.stringify(pieces.playerOne) + "\n\n" + JSON.stringify(pieces.cpu))
        drawPieces(pieces);
        // alert(JSON.stringify(pieces.playerOne[8].coords));

        // $("body").append("<br /> <br />");
        // var divElement = document.createElement("div");
        // $(divElement).addClass("redPiece");
        // $(divElement).css({
        //     bottom: 80 * pieces.cpu[1].coords.y,
        //     left: 80 * pieces.cpu[1].coords.x
        // });
        // $(".playBoard").append(divElement);
    });
});