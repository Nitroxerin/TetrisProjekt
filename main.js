const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');


var restartBtn = document.getElementById("restart-button");
var playBtn = document.getElementById("play-button");
var pauseBtn = document.getElementById("pause-button");

isPaused = false;
isGameOver = false;
isNormalMove = true;

speed = 600;

var gameValues = {
    score: 0,
    lines: 0,
    level: 0
  }

var scoreValues =
{
 last: 0,
 best: 0,
 worst: 0   
}



document.addEventListener('keydown', (event) =>{
    event.preventDefault();

    if (event.key == "p"){
        //  Eingabe "p": führe pause() aus
        pause();
        return;

    }else if (isPaused){
        // Wenn bereits Pause ist: return (Ignoriere die Eingabe)
        console.log("es ist Pause");
        return;

    }else if (isGameOver){
        //  Wenn bereits Game Over ist: return (Ignoriere die Eingabe)
        console.log("Game Over");
        return;

    }else if (MOVES[event.key]){
        // Führe die Eingegebene Anweisung anhand MOVES aus
        let p = MOVES[event.key](board.piece);

        // Shapenumber zurücksetzen, falls über 3
        if (p.shapenumber > 3 ) {
            p.shapenumber = 0;
        }
        p.shape = SHAPES[p.tetroNumber][p.shapenumber];


        //  Hard Drop
        if (event.key == " "){
            isNormalMove = false;
            //  Lasse den Block solange fallen, bis der nächste Move !valid(p) ist
            while (board.valid(p)){
                board.piece.move(p);
                p = MOVES[event.key](board.piece);
                // Score erhöhen für Hard Drop
                updateGameValues("score", gameValues.score += POINTS.HARD_DROP);
            }
            //  Audio Hard Drop abspielen
            hardDropAudio.currentTime = 0;
            hardDropAudio.play();
            //  Block freezen und drop ausführen
            board.freeze();
            board.drop();

        //  Andere Eingaben
        }else if (board.valid(p)){
            
            board.piece.move(p);
            board.piece.rotate(p);

            if (event.key == "ArrowDown") {
                // Score erhöhen für Soft Drop
                updateGameValues("score", gameValues.score += POINTS.SOFT_DROP);
            }
    
        }else if(event.key == "ArrowDown") {
            //  Wenn der move != valid, aber "ArrowDown" = Eingabe :
            //  board.drop(); -> damit der Block gefreezed wird und der nächste Block erscheint
            console.log("test");
            board.drop();
        }
    }
        // lösche und zeichne das Board einmal
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        board.draw();
})

function initNext() {
    // Calculate size of canvas from constants.
    ctxNext.canvas.width = 4 * BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

let board = new Board(ctx, ctxNext);


/*  
        Audio hinzufügen:
*/

//  Tetris Musik
var gameAudio = new Audio ('https://ia800504.us.archive.org/33/items/TetrisThemeMusic/Tetris.mp3'); //Musikdatei von einem Server eingebunden
gameAudio.loop=true; // Audio wird in Schleife abgespielt.
gameAudio.volume = 0.1;

//  Pausen Sound
var pauseAudio = new Audio ('Sounds/Pause.mp3');
pauseAudio.volume = 0.3;

//  Hard Drop Sound
var hardDropAudio = new Audio ('Sounds/HardDrop.mp3');
hardDropAudio.volume = 0.3;

//  Game Over Sound
var gameOverAudio = new Audio ('Sounds/GameOver.mp3'); 
gameOverAudio.volume = 0.3;

// Block Down Sound
var blockDownAudio = new Audio ('Sounds/BlockDown.mp3');
blockDownAudio.volume = 0.3




initNext();


function play() {
    board.reset();
    board.draw();
    timer = setInterval(spielfluss, speed)
    gameAudio.play();
    playBtn.disabled = true;
}

function pause() {
    if (isPaused) {
        isPaused = false;
        gameAudio.play();
    }else if (!isPaused){
        isPaused = true;
        pauseAudio.play();
        gameAudio.pause();
    }
}

function restart(){
    board = new Board(ctx, ctxNext);
    board.reset();
    board.draw();
    if(typeof timer !== 'undefined') clearInterval(timer);
    isGameOver = false;
    isPaused = false;
    isNormalMove = true;
    speed = 500;
    gameAudio.playbackRate=1.00;
    gameAudio.currentTime = 0;
    gameAudio.play();
    timer = setInterval(spielfluss, speed)
    updateScoreBoard();
    resetGame();
}

function spielfluss(){
    if(!isPaused){
        if(!board.drop()){
            gameOver();      
            return;
        }
        levelUp();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        board.draw();
    }
}


function updateGameValues(key, value) {
    let element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
}

function resetGame() {
    gameValues.score = 0;
    gameValues.lines = 0;
    gameValues.level = 1;
    speed = 600
    updateGameValues("score", 0)
    updateGameValues("lines", 0)
    updateGameValues("level", 1)
}

function gameOver() {

    

    updateScoreBoard()
      
    updateGameValues("last", gameValues.score); //bei GameOver letzten Punktestand ans Scoreboard übergeben. 
    clearInterval(timer);
    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 1.8, 4);
    isGameOver = true;
    gameAudio.pause();
    gameOverAudio.play();
}

function updateScoreBoard() {
    if(gameValues.score>scoreValues.best) // wenn aktueller Score größer als der beste Wert ist, wird der aktuelle Score wert bei Gameover übernommen
        {
        scoreValues.best=gameValues.score
        updateGameValues("best", gameValues.score);
        }
        if(gameValues.score<scoreValues.worst)// wenn aktueller Score kleiner als der schlechteste Wert ist, wird der aktuelle Score wert bei Gameover übernommen
        {
        scoreValues.worst=gameValues.score
        updateGameValues("worst", gameValues.score);
        }
        if (scoreValues.worst==0) // beim ersten Durchlauf ist die Variable 0 deshalb wird das hier einmal Übernommen.
        {
        scoreValues.worst=gameValues.score
        updateGameValues("worst", gameValues.score);
        }
        updateGameValues("last", gameValues.score);
}

function levelUp() {
    oldGV = gameValues.level;
    if (gameValues.score < 500){
        gameAudio.playbackRate=1.00;

    }else if(gameValues.score >= 500 && gameValues.score < 1000){
        gameAudio.playbackRate=1.03;
        gameValues.level = 2;
        speed = 500;
    }else if (gameValues.score >= 1000 && gameValues.score < 1500){
        gameAudio.playbackRate=1.06;
        gameValues.level = 3;
        speed = 475;
    }else if (gameValues.score >= 1500 && gameValues.score < 2000){
        gameValues.level = 4;
        gameAudio.playbackRate=1.09;
        speed = 450;
    }else if (gameValues.score >= 2000 && gameValues.score < 2500){
        gameAudio.playbackRate=1.12;
        gameValues.level = 5;
        speed = 425;
    }else if (gameValues.score >= 2500 && gameValues.score < 3000){
        gameAudio.playbackRate=1.15;
        gameValues.level = 6;
        speed = 400;
    }else if (gameValues.score >= 3000 && gameValues.score < 3500){
        gameAudio.playbackRate=1.18;
        gameValues.level = 7;
        speed = 375;
    }else if (gameValues.score >= 3500 && gameValues.score < 4000){
        gameAudio.playbackRate=1.21;
        gameValues.level = 8;
        speed = 350;
    }else if (gameValues.score >= 4000 && gameValues.score < 4500){
        gameAudio.playbackRate=1.30;
        gameValues.level = 9;
        speed = 300;
    }else if (gameValues.score >= 4500 && gameValues.score < 5000){
        gameAudio.playbackRate=1.40;
        gameValues.level = 10;
        speed = 200;
    }

    if (oldGV != gameValues.level){
        updateGameValues("level", gameValues.level)
        clearInterval(timer);
        timer = setInterval(spielfluss, speed);
    }
}