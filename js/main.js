
$(function(){
  var grid, snake, food, bumpWall, start, gameOver, newHead, speed_now, score, level, total_rows, total_cols, timer;
  init();
  $('body').on('keydown', function(event){
    pressKey(event);
    if (!start) {
      timeout(speed_now);
      start = true;
      $('.instructions').hide();
    }
    if (gameOver) {
      clearTimeout(timer)
      init();
    }
  });

  function init(){
    grid = [];
    snake = {
              position: [[10,12], [10, 11], [10,10]],
              direction: 39
            };
    food = {
              position: [0,0],
              new: function() {
                      var row, col;
                      row = Math.floor(Math.random() * grid.length);
                      col = Math.floor(Math.random() * grid.length);
                      this.position = [row, col];
                      $('.row_' + row + ' .col_' + col).addClass("food");
                    }
            };
    bumpWall  = false;
    start = false;
    gameOver = false;
    newHead = [19,19];
    speed_now = 200;
    score = 0;
    level = 1;
    total_rows = 20;
    total_cols = 30;
    initGrid(total_rows, total_cols);
    makeGrid();
    updateGrid();
    $('.score').text(score);
    $('.level').text(level);
    $('.gameover').hide();
    $('.pixel').removeClass("food overlap");
    food.new();
    }

  function initGrid(m, n) {
    for(var i =0; i < m; i++) {
     var row = [];
      for(var j =0; j < n; j++) {
      row[j] = " ";
      }
      grid[i] = row;
    }
  }

  function makeGrid() {
    $('.box').html("");
    for(var i =0; i < grid.length; i++) {
      $('.box').append($('<div class="rows row_' + i + '"></div>'));
      for(var j =0; j < grid[i].length; j++) {
        $('.row_' + i).last().append($('<div class="pixel col_' +  j +'">' +  grid[i][j] + '</div>'));
      }
    }
  }

  function updateGrid(bump) {
    var color = (bump) ? ("overlap") :  ("active");
    $('.pixel').removeClass("active");
    for(var i = 0; i < snake.position.length; i++){
      $('.row_' + snake.position[i][0] + ' .col_' + snake.position[i][1]).addClass(color);
   }
  }


    function pressKey(event){
      var newDir = event.which,
          oldDir = snake.direction;
      if (newDir - oldDir != 2 &&  newDir - oldDir != -2) {
        snake.direction = event.which;
      }
    }


    function turn() {
      var headRow = snake.position[0][0],
          headCol = snake.position[0][1];
      switch (snake.direction) {
      case 37: //left
        newHead = [headRow, headCol - 1];
        break;
      case 38: //up
        newHead = [headRow - 1, headCol];
        break;
      case 39: //right
        newHead = [headRow, headCol + 1];
        break;
      case 40: //down
        newHead = [headRow + 1, headCol];
        break;
      }
       checkGameOver();
       var eatFood = newHead[0] == food.position[0] && newHead[1] == food.position[1];
       if (!gameOver) {
        snake.position.unshift(newHead);
        if (eatFood) {
          grow();
        } else {
          snake.position.pop();
        }
        updateGrid();
      }
    }

    function checkGameOver() {
      for (var i =0; i < snake.position.length -1; i++) {
        if (newHead[0] == snake.position[i][0] && newHead[1] == snake.position[i][1]) {
          $('.row_' + newHead[0] + ' .col_' + newHead[1]).addClass("overlap");
          snake.position.pop();
          gameOver = true;
        }
      }
      if (newHead[0] < 0 || newHead[1] < 0 || newHead[0] >= total_rows || newHead[1] >= total_cols) {
          updateGrid(true);
          gameOver = true;
      }
    }

    function speedUp(){
      if (score % 5 == 0) {
        speed_now *= 0.8;
        level += 1;
        $('.level').text(level);
      }
    }

    function timeout(speed) {
      timer = setTimeout(function () {
    //    console.log(newHead, gameOver())
        if (!gameOver) {
          turn();
          timeout(speed_now);
        } else {
          updateGrid();
          $('.gameover').toggle();
        }
      }, speed);
    }

    function grow() {
      $('.row_' + food.position[0] + ' .col_' + food.position[1]).removeClass("food");
      score += 1;
      speedUp();
      $('.score').text(score);
      food.new();
    }

});
