
class Board {

    constructor(ctx, ctxNext){
        this.ctx = ctx;
        this.ctxNext = ctxNext;

        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;
        
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        

        this.initSound();
        

        
        

    }

    initSound() {
        this.singleAudio = new Audio ('Sounds/Single.mp3');
        this.singleAudio.volume = 0.3;

        this.doubleAudio = new Audio ('Sounds/Double.mp3');
        this.doubleAudio.volume = 0.3;

        this.tripleAudio = new Audio ('Sounds/Triple.mp3');
        this.tripleAudio.volume = 0.3;

        this.tetrisAudio = new Audio ('Sounds/Tetris.mp3'); //Musikdatei von einem Server eingebunden
        this.tetrisAudio.volume = 0.3;
    }

    // Board reset bei Neustart
    reset() {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(this.ctx);
        this.piece.setStartingPosition();
        //this.piece.draw();
        this.getNewPiece()
    }

    // Spielfeld mit 0 füllen und zurückgeben
    getEmptyBoard() {
        return Array.from(
        {length: ROWS}, () => Array(COLS).fill(0)
        );
    }

    //  Spielfeld & aktuelles Piece ausmalen
    draw() {
        this.piece.draw();
        this.drawBoard();
    }

    // ganzes Spielfeld ablaufen und alle Felder mit Blöcken ( Feld > 0 ) in deren Farbe (1-7) ausmalen
    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0){
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(  x + BLOCK_WHITENING,
                                        y + BLOCK_WHITENING,
                                        1 - BLOCK_WHITENING,
                                        1 - BLOCK_WHITENING
                                        );
                }
            })
        })
    }

    /*
        Bewege den Block ein Feld nach unten (Wenn Move = valid)
        - return true bei erfolgreichem drop
        - return false bei nicht erfolgreichem drop
    */
    drop(){
        let p = MOVES['ArrowDown'](this.piece)

        if (this.valid(p)){
            this.piece.move(p);
            return true;
        }else{
            this.freeze();
            this.clearLines();
        
            if (this.piece.y === 0){
                return false;
            }
            if (isNormalMove == true){
                blockDownAudio.currentTime = 0;
                blockDownAudio.play();
            }
            this.piece = this.next;
            this.piece.ctx = this.ctx;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        isNormalMove = true;
        return true;
    }

    getNewPiece() {
        this.next = new Piece(this.ctxNext);
        this.ctxNext.clearRect(
          0,
          0, 
          this.ctxNext.canvas.width, 
          this.ctxNext.canvas.height
        );
        this.next.draw();
      }



    // ist der Move der auszuführen ist "legal"?
    /*
        - laufe alle Felder des Shapes ab
        - setze x und y auf die nächste Position, die durch die Eingabe bestimmt wird
        - gib true -> Move = "legal" ODER false -> Move != "legal"

    */
    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;

                return value === 0 || (this.insideWalls(x) && this.aboveFloor(y) && !this.isFilled(x,y));
            })
        })
    }

    //  Prüfe ob x innerhalb des Arrays (Spielfeld) ist
    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    //Prüfe ob y in, oder über der letzten ROW ist
    aboveFloor(y) {
        return y < ROWS;
    }

    isFilled(x,y){
        return this.grid[y][x] > 0;
    }

   /*
        rotiere den Block p:
        - shapenumber = Nummer der Shapes des Blockes ( jeder Block hat 4 verschiedene Shapes, je nach Rotation )
   */
    rotate(p){
        if (p.shapenumber < 3){
            p.shapenumber++;
        }else{
            p.shapenumber = 0;
        }

        p.shape = SHAPES[p.tetroNumber][p.shapenumber]; 
        //console.log(p.shape);
        return p;
      }
      
      freeze(){
        this.piece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                let x = this.piece.x + dx;
                let y = this.piece.y + dy;
                
                if (value > 0){
                    this.grid[y][x] = this.piece.tetroNumber;
                }   
            })
        })
      }

      /*
        - jede Reihe des Grids durchlaufen
        - v zählt Felder mit Inhalt > 0
        - Wenn Reihe voll (v == COLS) -> lösche diese Reihe und füge neue vorne an
      */
      clearLines(){
        var v = 0;
        var linesToClear = 0;
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    v++;
                }else{
                    return
                }
                if (v == COLS){
                    //  lösche die volle Reihe
                    this.grid.splice(y, 1);
                    //  füge neue Reihe oben hinzu
                    this.grid.unshift([0,0,0,0,0,0,0,0,0,0]);
                    // voll Variable wieder auf 0
                    v = 0;
                    // linestoclear einen hoch
                    linesToClear += 1;
                }
            })
            // nach jeder Reihe v = 0
            v = 0;
        })
        
        updateGameValues("lines", gameValues.lines += linesToClear);

        // je nachdem wieviele Reihen gleichzeitig voll waren; erhöhe score
        switch (linesToClear){
            case 1: 
                updateGameValues("score", gameValues.score += POINTS.SINGLE);
                this.singleAudio.play();
                break;
            case 2:
                updateGameValues("score", gameValues.score += POINTS.DOUBLE);
                this.doubleAudio.play();
                break;
            case 3:
                updateGameValues("score", gameValues.score += POINTS.TRIPLE);
                this.tripleAudio.play();
                break;
            case 4:
                updateGameValues("score", gameValues.score += POINTS.TETRIS);
                this.tetrisAudio.play();
                break;
            default:
        }
      }
}