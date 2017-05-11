var canvas = document.getElementById('tetris');
var context = canvas.getContext('2d');

context.scale(20,20);
var arena = createMatrix(21,28);
// run areanSweep in playerDrop
function arenaSweep(){
  var rowCount = 1;
  outer: for(var i = arena.length-1; i > 0; i--){
    for(var e = 0; e < arena[i].length; e++){
      if(arena[i][e] === 0){
        continue outer;
        // restarts outer for loop
      }
    }
    var row = arena.splice(i, 1)[0].fill(0);
    // splice at index of zero immediately takes first i (row)
    // then we fill it with zeroes (clear the row)
    // set to var 'row' => this represents empty row
    arena.unshift(row);
    // add empty row to top of arena matrix
    i++;
    // increment i (y), since we removed an index of i in above splice
    player.score += (rowCount * 10);
    var getColors = colors[colors.length * Math.random() | 0];
    document.getElementById('score').style.color = getColors;
    console.log(rowCount);
    // double score for each row cleared
    rowCount *= 2;
  }
};

function collide(arena, player){
  var [m, o] = [player.matrix, player.pos];
  for(var i = 0; i < m.length; i++){
    for(var e = 0; e < m[i].length; e++){
      // below checks if player matrix is not 0 at i,e (y,x) position.
      // & check if arena row exists at offset of i (y) & if column exists and is not 0.
      // if any of the following are not true, collision occurs => skip conditional & return false (below)
      if(m[i][e] !== 0 && (arena[i + o.i] && arena[i + o.i][e + o.e]) !== 0){
        return true;
      }
    }
  }
  return false;
};

// matrix holding pieces on board
function createMatrix(w, h){
  var matrix = [];
  while(h--){
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
};

function createPiece(type){
  // changed from just 1's and 0's, for each shape to have specific number & color
  if(type === 'T'){
    return [
      [0,0,0],
      [1,1,1],
      [0,1,0],
    ];
  }
  else if(type === 'O'){
    return [
      // doesn't really rotate
      [2,2],
      [2,2],
    ];
  }
  else if(type === 'L'){
    return [
      [0,3,0],
      [0,3,0],
      [0,3,3],
    ];
  }
  else if(type === 'J'){
    return [
      [0,4,0],
      [0,4,0],
      [4,4,0],
    ];
  }
  else if(type === 'I'){
    // use 4x4 matrix, because it makes it easier to anticipate rotation
    return [
      [0,5,0,0],
      [0,5,0,0],
      [0,5,0,0],
      [0,5,0,0],
    ];
  }
  else if(type === 'S'){
    return [
      [0,6,6],
      [6,6,0],
      [0,0,0],
    ];
  }
  else if(type === 'Z'){
    return [
      [7,7,0],
      [0,7,7],
      [0,0,0],
    ];
  }
};

// below draw & drawMatrix functions let us continually clear and re-draw the shape/piece in different positions

function drawMatrix(matrix, offset){
  if(matrix){
    matrix.forEach(function(row,i){
      row.forEach(function(value,e){
        if(value !==  0){
          context.fillStyle = colors[value];
          context.fillRect(e + offset.e, i + offset.i,1,1);
        }
      });
    });
  }
};




function draw(){
  // var bg = context.createLinearGradient(0, 0, 0, canvas.height);
  // bg.addColorStop(0, "#469eff");
  // bg.addColorStop(1, "#8e48ff");
  context.fillStyle = '#252525';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {e: 0, i:0});
  drawMatrix(player.matrix, player.pos );
};

function merge(arena, player){
  player.matrix.forEach(function(row, i){
    row.forEach(function(value, e){
      if (value !== 0) {
        arena[i + player.pos.i][e + player.pos.e] = value;
      }
    })
  });
};

// utilizes square matrix of each shape to swap values based on direction (+1/-1) input by player for an active piece on the board
function rotate(matrix, dir){
  for(var i = 0; i < matrix.length; i++){
    for(var e = 0; e < i; e++){
      // shortened swpap technique: var a = 'aaa', b = 'bbb'; [a,b] = [b,a];
      // now, a = 'bbb' & b = 'aaa';
      [
        matrix[e][i],
        matrix[i][e],
      ] = [
        matrix[i][e],
        matrix[e][i],
      ];
    }
  }
  if(dir > 0){
    matrix.forEach(function(row){
      row.reverse();
    });
  }
  else{
    matrix.reverse();
  }
};

// update function calls draw method
// added counters & time variables to change position of shape & move it down in 1 second intervals
// included merge & collide detection methods to player drop function
function playerDrop(){
  player.pos.i++;
  if(collide(arena, player)){
    player.pos.i--;
    merge(arena, player);
    // console.table(arena);
    playerReset();
    // player.pos.i = 0; // using above reset function instead
    arenaSweep();
    updateScore();
  }
  dropCounter =0;
};

// represents changes made to pieces on the board per player's input
// values passed to this method based on keycode input event (see keydown function below)
function playerMove(dir){
  player.pos.e += dir;
  if(collide(arena, player)){
    player.pos.e -= dir;
  }
};

// generate random pieces/shapes
function playerReset(){
  var pcs = 'TJLOSZI';
  // bitwise OR operator, to return 1 if even one of the values passed is 1
  player.matrix = createPiece(pcs[Math.random() * pcs.length | 0]);
  console.log(pcs[pcs.length * Math.random() | 0]);
  // start player piece at top row of canvas
  player.pos.i = 0;
  // and in middle of top row
  player.pos.e = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  // if we collide & reset immediately => meaning we reached upper limit of the board, game over clear board.
  if(collide(arena, player)){
    arena.forEach(function(row){
      // remove pieces from arena
      row.fill(0);
    });
    player.score = 0;
    updateScore();
  }
};


function playerRotate(dir){
  var pos = player.pos.e;
  var offset = 1;
  rotate(player.matrix, dir);
  // want to check collision more than once, since we don't know which way it'll move next or how many times it'll move => use while loop
  while(collide(arena, player)){
    // increment to see range before collision => use offset to detect if we have space for a rotation using offset (set above).
    // if we collide, move player by offset:
    // below moves piece one space to the right.
    player.pos.e += offset;
    // however, if we still collide, want to move to the left.
    offset = -(offset + (offset > 0 ? 1 : -1));
    // bail if it didn't work
    if(offset > player.matrix[0].length){
      // basically, above saying if we moved so much it doesn't work any more
      rotate(player.matrix, -dir);
      // reset player position
      player.pos.e = pos;
      return;
    }

  }
};

var dropCounter = 0;
var dropInterval = 1000;
var lastTime = 0;
var play = true;

function update(time = 0){
  if(!play){
    return;
  }
  var deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
};

function startGame(){
  play = true;
  update();
};

function stopGame(){
  play = false;
};

function updateScore(){
  document.getElementById('score').innerText = "SCORE "+player.score;
};

// attach event listener to keyboard inputs from user
document.addEventListener('keydown', function(e){
  if(e.keyCode === 37){
    // left arrow
    playerMove(-1);
  }
  else if(e.keyCode === 100){
    // numpad 4
    playerMove(-1);
  }
  else if(e.keyCode === 39){
    // right arrow
    playerMove(1);
  }
  else if(e.keyCode === 102){
    // numpad 6
    playerMove(1);
  }
  else if(e.keyCode === 40){
    // moves shape/piece down a level, reset drop counter since we don't want to move it down again until next interval.
    playerDrop();
    // player.pos.i++; (before consolidated into playerDrop)
    // dropCounter =0; (before consolidated into playerDrop)
  }
  else if(e.keyCode === 98){
    // numpad 2
    playerDrop();
  }
  // keyCode 81 => Q;
  else if(e.keyCode === 81){
    playerRotate(-1);
  }
  // keyCode 87 => W;
  else if(e.keyCode === 87){
    playerRotate(1);
  }
  else if(e.keyCode === 16){
    // 'shift'
    stopGame();
  }
  else if(e.keyCode === 13){
    // 'enter'
    startGame();
  }
});

var colors = [
  null,
  // old
  // '#ED2B1E',
  // '#334CCB',
  // '#C5D61A',
  // '#247824',
  // '#864EC9',
  // '#ED9E0C',
  // '#F4C0EB',
  // new
  '#CC2830',
  '#005AAF',
  '#EF7E28',
  '#955BD8',
  '#008C46',
  '#B4F24F',
  '#408ECE',
];



var player = {
  pos: {e: 0, i: 0},
  matrix: null,
  score: 0,
};

// update();
updateScore();
playerReset();
// to rotate shape matrix, must do two things:
// 1. transpose it => convert all row values into column values (rows into columns)
// 2. reverse each row (now column) to get rotated matrix
