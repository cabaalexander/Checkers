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

    function movePiece(piece) {
        var coords = piece.coords;
        var color = piece.color;
        var result = [];

        if (color === "Red") {
            if (coords.y < 7) {
                if (coords.x > 0) {
                    result.push({y: coords.y + 1, x: coords.x - 1});
                }
                if (coords.x < 7){
                    result.push({y: coords.y + 1, x: coords.x + 1});
                }
            }
        }
        else {
            if (coords.y > 0){
                if (coords.x > 0) {
                    result.push({y: coords.y - 1, x: coords.x - 1});
                }
                if (coords.x < 7){
                    result.push({y: coords.y - 1, x: coords.x + 1});
                }
            }
        }

        return result;
    }

    function drawBoard() {
        var playBoard = document.createElement("div");
        $(playBoard).addClass("playBoard");
        var table = document.createElement("table");
        $(playBoard).append(table);
        for (var y = 0; y < 7; y++) {
            var tr = document.createElement("tr");
            for (var x = 0; x < 7; x++) {
                var td = document.createElement("td");
                if ((x + y) % 2 === 0) {
                    $(td).addClass("brownSquare");
                }
                else {
                    $(td).addClass("whiteSquare");
                }
                $(tr).append(td);
            }
            $(table).prepend(tr);
        }
        $("body").append(playBoard);
    }

    function drawPieces(pieces) {
        $(pieces).each(function(index, piece) {
            var domPiece = document.createElement("div");
            if (piece.color === "Red") {
                $(domPiece).addClass("redPiece");
            }
            else {
                $(domPiece).addClass("whitePiece");
            }
            $(domPiece).css({
                left: 80,
                bottom: 80
            });
            $("playBoard").append(domPiece);
        })
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

        $("body").append("<br /> <br />" + JSON.stringify(movePiece(pieces.playerOne[0])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.playerOne[1])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.playerOne[2])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.playerOne[3])));

        $("body").append("<br /> <br />" + JSON.stringify(movePiece(pieces.cpu[0])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.cpu[1])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.cpu[2])));
        $("body").append(" <====> " + JSON.stringify(movePiece(pieces.cpu[3])));

        $("body").append("<br /> <br />");

        drawBoard();drawPieces(pieces);
    });
});