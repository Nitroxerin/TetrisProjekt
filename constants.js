const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const BLOCK_WHITENING = 0.1;

const MOVES = {
  'ArrowLeft':  p => ({ ...p, x: p.x - 1 }),
  'ArrowRight': p => ({ ...p, x: p.x + 1 }),
  'ArrowDown':    p => ({ ...p, y: p.y + 1 }),
  ' ':  p => ({...p, y: p.y +1}),
  'ArrowUp': p => ({...p, shapenumber: p.shapenumber + 1})
};


const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
}

const COLORS = [
    'none',
    'purple',
    'orange',
    'blue',
    'yellow',
    'green',
    'red',
    'cyan'
  ];

const SHAPES = [
  [],
  [
    //  Dreieck Tetromino

    [
      [ 1 , 1 , 1 ],
      [ 0 , 1 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 1 ],
      [ 0 , 1 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 1 , 1 , 1 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 1 , 1 , 0 ],
      [ 0 , 1 , 0 ]
    ]
  ],
    //  L 1 Tetromino

  [
    [
      [ 1 , 1 , 1 ],
      [ 1 , 0 , 0 ],
      [ 0 , 0 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 1 ]
    ],
    [
      [ 0 , 0 , 1 ],
      [ 1 , 1 , 1 ],
      [ 0 , 0 , 0 ]
    ],
    [
      [ 1 , 1 , 0 ],
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 0 ]
    ]
  ],
  [

    // L 2 Tetromino

    [
      [ 1 , 0 , 0 ],
      [ 1 , 1 , 1 ],
      [ 0 , 0 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 0 ],
      [ 1 , 1 , 0 ]
    ],
    [
      [ 0 , 0 , 0 ],
      [ 1 , 1 , 1 ],
      [ 0 , 0 , 1 ]
    ],
    [
      [ 0 , 1 , 1 ],
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 0 ]
    ]
  ],
  [

    // Viereck Tetromino

    [
      [ 0 , 1 , 1 ],
      [ 0 , 1 , 1 ],
      [ 0 , 0 , 0 ]
    ],
    [
      [ 1 , 1 ],
      [ 1 , 1 ]
    ],
    [
      [ 1 , 1 ],
      [ 1 , 1 ]
    ],
    [
      [ 1 , 1 ],
      [ 1 , 1 ]
    ]
  ],
  [

    // Z 1 Tetromino

    [
      [ 1 , 0 , 0 ],
      [ 1 , 1 , 0 ],
      [ 0 , 1 , 0 ]
    ],
    [
      [ 0 , 0 , 0 ],
      [ 0 , 1 , 1 ],
      [ 1 , 1 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 0 , 1 , 1 ],
      [ 0 , 0 , 1 ]
    ],
    [
      [ 0 , 1 , 1 ],
      [ 1 , 1 , 0 ],
      [ 0 , 0 , 0 ]
    ]

  ],
  [

    // Z 2 Tetromino

    [
      [ 0 , 0 , 1 ],
      [ 0 , 1 , 1 ],
      [ 0 , 1 , 0 ]
    ],
    [
      [ 1 , 1 , 0 ],
      [ 0 , 1 , 1 ],
      [ 0 , 0 , 0 ]
    ],
    [
      [ 0 , 1 , 0 ],
      [ 1 , 1 , 0 ],
      [ 1 , 0 , 0 ]
    ],
    [
      [ 0 , 0 , 0 ],
      [ 1 , 1 , 0 ],
      [ 0 , 1 , 1 ]
    ]    

  ],
  [

    // I Tetromino
    [
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ]
    ],
    [
      [ 0 , 0 , 0 , 0 ],
      [ 1 , 1 , 1 , 1 ],
      [ 0 , 0 , 0 , 0 ],
      [ 0 , 0 , 0 , 0 ]
    ],
    [
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ],
      [ 0 , 0 , 1 , 0 ]
    ],
    [
      [ 0 , 0 , 0 , 0 ],
      [ 1 , 1 , 1 , 1 ],
      [ 0 , 0 , 0 , 0 ],
      [ 0 , 0 , 0 , 0 ]
    ],

    

  ]
]