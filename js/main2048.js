var added = new Array();
var board = new Array();
var count = 0;
var score = 0;
var addscore = 0;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
    prepareForMobile();
    newgame();
});

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
        $('#title2048').addClass('title2048');
        $('.mobileButton').remove();
        $('body').css('minWidth' , '500px');
    } else {
        $('#pp').remove();
        $('.button').remove();
        $('#gif').css('width', 0.5 * gridContainerWidth);
        $('#gif').css('bottom', -0.20 * documentWidth);

        $('.addscore').addClass('maddscore');
        $('.addscore').css('top', '50%');

        $('.result span').css('top', '25%');
    }


    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.08 * cellSideLength);

}

function newgame() {
    $('#win').hide();
    $('#lose').hide();

    init();
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j + '');
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        added[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = new Array();
            added[i][j] = new Array();
            board[i][j] = 0;
            added[i][j] = false;
        }
    }
    score = 0;
    updateBoardView();
}

function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            added[i][j] = false;
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('border-radius', 0.08 * cellSideLength);
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
    updateScore(score);
    if (addscore != 0) addScore(addscore);

}

function generateOneNumber() {
    if (nospace(board))
        return false;

    //随机一个位置
    // var randx = parseInt(Math.floor(Math.random() * 4));
    // var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
        if (board[randx][randy] == 0)
            break;
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //生成
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 32:
            event.preventDefault();
            newgame();
            break;
        case 37:
            event.preventDefault();
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);

            }
            break;
        case 38:
            event.preventDefault();
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        case 39:
            event.preventDefault();
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        case 40:
            event.preventDefault();
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
            break;
        default:
            // console.log(event.keyCode);
            break;
    }
});

document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;

});

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
},{passive:false});
document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
//触发移动
    if (Math.abs(deltax) < 0.10 * documentWidth && Math.abs(deltay) < 0.15 * documentWidth)
        return;

    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            if (moveRight()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        } else {
            if (moveLeft()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);

            }
        }
    } else {
        if (deltay > 0) {
            if (moveDown()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }
        } else {
            if (moveUp()) {
                setTimeout('generateOneNumber()', 210);
                setTimeout('isgameover()', 300);
            }

        }
    }
});

function isgameover() {
    if (is2048()) {
        setTimeout('gamewin();', 1000);

    }
    if (nospace(board) && nomove(board))
        setTimeout('gamelose();', 1000);
}

function is2048() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 2048)
                return true;
        }
    }
    return false;
}

function gamewin() {
    $('#win').show();
}

function gamelose() {
    $('#lose').show();
}

function moveLeft() {
    if (!canMoveLeft(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !added[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        added[i][k] = true;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        addscore += board[i][k];
                        continue;
                    }
                }

            }
        }

    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !added[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        added[i][k] = true;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        addscore += board[i][k];
                        continue;
                    }
                }

            }
        }

    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board))
        return false;
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !added[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        added[k][j] = true;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        addscore += board[k][j];
                        continue;
                    }
                }

            }
        }

    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !added[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        added[k][j] = true;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        addscore += board[k][j];
                        continue;
                    }
                }

            }
        }

    }
    setTimeout('updateBoardView()', 200);
    return true;
}