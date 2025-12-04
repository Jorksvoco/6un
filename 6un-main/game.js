const size = 20;
const game = document.getElementById("game");
const levelTitle = document.getElementById("levelTitle");

// Create grid
let cells = [];
for (let i = 0; i < size * size; i++) {
  const div = document.createElement("div");
  div.classList.add("cell");
  game.appendChild(div);
  cells.push(div);
}

/* ------------------------------------
   LEVELS — ASCII MAPS
------------------------------------- */
const levels = [
  [
    "####################",
    "#.................E#",
    "#..................#",
    "#.......####.......#",
    "#....W........A....#",
    "####################"
  ],
  [
    "####################",
    "#...A..............#",
    "#.......#######....#",
    "#..W...............#",
    "#...............E..#",
    "####################"
  ],

  // NEW LEVELS ↓↓↓

  [
    "####################",
    "#..............A..E#",
    "#..........###.....#",
    "#.......W..........#",
    "#..................#",
    "####################"
  ],
  [
    "####################",
    "#..............#####",
    "#..A...............#",
    "#..#####...........#",
    "#W..............E..#",
    "####################"
  ],
  [
    "####################",
    "#W.................#",
    "######.#############",
    "#A...............E.#",
    "####################",
    "####################"
  ],
  [
    "####################",
    "#.......A..........#",
    "#.......#####......#",
    "#W.................#",
    "#..............E...#",
    "####################"
  ],
  [
    "####################",
    "#..........A.......#",
    "#..######..........#",
    "#W.......#########.#",
    "#...............E..#",
    "####################"
  ]
];


let currentLevel = 0;

let worm = [
   { pos: 10, dir: 1 }, // tail
  { pos: 11, dir: 1 }, // middle
  { pos: 12, dir: 1 }  // head
];
let apple = null;
let exitTile = null;
let lastDirection = 1; // default facing right (1, -1, size, -size)
let gravityEnabled = true;

/* ------------------------------------
   LOAD LEVEL
------------------------------------- */
function loadLevel(n) {
  levelTitle.textContent = "Level " + (n + 1);

  worm = [];
  apple = null;
  exitTile = null;

  const map = levels[n];

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const char = map[r][c];
      const index = r * size + c;

      cells[index].className = "cell";

      if (char === "#") cells[index].classList.add("wall");

      if (char === "W") {
        worm.push(index);
      }

      if (char === "A") {
        apple = index;
        cells[index].classList.add("apple");
      }

      if (char === "E") {
        exitTile = index;
        cells[index].classList.add("exit");
      }
    }
  }

  draw();
}

loadLevel(currentLevel);

/* ------------------------------------
   MOVEMENT
------------------------------------- */
document.addEventListener("keydown", (e) => {
  let dir = 0;

  if (e.key === "ArrowUp") dir = -size;
  if (e.key === "ArrowDown") dir = size;
  if (e.key === "ArrowLeft") dir = -1;
  if (e.key === "ArrowRight") dir = 1;

  if (dir !== 0) move(dir);

  // Controls: 'r' to reset level, 'g' to toggle gravity
  if (e.key === 'r' || e.key === 'R') loadLevel(currentLevel);
  if (e.key === 'g' || e.key === 'G') {
    gravityEnabled = !gravityEnabled;
    const hud = document.getElementById('hudState');
    if (hud) hud.textContent = gravityEnabled ? 'Gravity: ON' : 'Gravity: OFF';
  }
});

function move(direction) {
  // store last direction for head orientation
  if (direction !== 0) lastDirection = direction;
  const head = worm[worm.length - 1];
  const next = head + direction;

  // Boundary wrap prevention
  if (next < 0 || next >= size * size) return;
  if (direction === 1 && head % size === size - 1) return;
  if (direction === -1 && head % size === 0) return;

  // Hit wall?
  if (cells[next].classList.contains("wall")) return;

  // Cannot move into own body — allow moving into the tail cell if we're not growing
  const tail = worm[0];
  const movingIntoTailButNotGrowing = (next === tail && next !== apple);
  if (worm.includes(next) && !movingIntoTailButNotGrowing) return;

  // Move head forward
  worm.push(next);

  // Eat apple → worm grows
  if (next === apple) {
    cells[apple].classList.remove("apple");
    apple = null;
  } else {
    // Normal movement → remove tail
    worm.shift();
  }

  // Level complete?
  if (next === exitTile && apple === null) {
    currentLevel++;

    if (currentLevel >= levels.length) {
      alert("You beat all levels!");
      currentLevel = 0;
    }

    loadLevel(currentLevel);
    return;
  }

  draw();
}

/* ------------------------------------
   GRAVITY / AUTO-FALL
   runs on a regular interval — if there's nothing under the head, the snake falls one row
------------------------------------- */
const GRAVITY_TICK_MS = 220;
setInterval(() => {
  if (!gravityEnabled) return;
  // Try to push the snake downwards (positive size)
  const head = worm[worm.length - 1];
  const below = head + size;

  // bounds check
  if (below < 0 || below >= size * size) return; // out of grid

  // if there's a block (wall) right below the head, we are standing — no fall
  if (cells[below].classList.contains('wall')) return;

  // if below is exit and we don't have apple yet, we allow falling into exit
  // if below is apple we can fall into it and eat

  // if below is part of the worm body, allow falling only if it's the tail and we're not growing
  const belowIsBody = worm.includes(below);
  const tail = worm[0];
  const movingIntoTailButNotGrowing = (below === tail && below !== apple);

  if (belowIsBody && !movingIntoTailButNotGrowing) return;

  // perform the falling move
  move(size);
}, GRAVITY_TICK_MS);

/* ------------------------------------
   DRAW WORM + MAP
------------------------------------- */
function draw() {
  // Clear non-wall cells
  cells.forEach((cell, i) => {
    if (!cell.classList.contains("wall") &&
        !cell.classList.contains("apple") &&
        !cell.classList.contains("exit")) 
    {
      cell.className = "cell";
    }
  });

  // Draw worm body
  worm.forEach(i => cells[i].classList.add("worm"));

  // Draw worm head
  const head = worm[worm.length - 1];
  cells[head].classList.add("head");

  // head orientation classes
  if (lastDirection === -size) cells[head].classList.add('head-up');
  if (lastDirection === size)  cells[head].classList.add('head-down');
  if (lastDirection === 1)     cells[head].classList.add('head-right');
  if (lastDirection === -1)    cells[head].classList.add('head-left');
}
