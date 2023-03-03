class Piece {
    constructor(ctx) {
        this.ctx = ctx;

        //Startposition:
        this.x = 0;
        this.y = 0;

        this.init();
    }


    init(){
        var tetroNumber = this.randomizeTetromino(7);
        this.tetroNumber = tetroNumber;

        this.color = COLORS[tetroNumber];
        var shapenumber = 0;
        this.shapenumber = shapenumber;
        this.shape = SHAPES[this.tetroNumber][this.shapenumber];
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(  this.x + x + BLOCK_WHITENING, 
                                        this.y + y + BLOCK_WHITENING, 
                                        1 - BLOCK_WHITENING, 
                                        1 - BLOCK_WHITENING
                                    );
                }
            })
        })
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
    }

    rotate(p) {
        this.shapenumber = p.shapenumber;
        this.shape = SHAPES[this.tetroNumber][this.shapenumber];
    }

    randomizeTetromino(max) {
        return Math.floor(Math.random() * max + 1);
    }

    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3;
      }


}