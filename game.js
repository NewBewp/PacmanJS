const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")
const pacmanFrames = document.getElementById("animations")
const ghostFrames = document.getElementById("ghosts")

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

let fps = 30;
let pacman;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;


const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_LEFT = "LEFT";
const DIRECTION_UP = "UP";
const DIRECTION_BOTTOM = "DOWN";

let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
]

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },   
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
];


let isGameOver = false;
let gameOver = () => {
    clearInterval(gameInterval); // Dừng vòng lặp game
    isGameOver = true; // Đánh dấu game đã kết thúc
    canvasContext.fillStyle = "white";
    canvasContext.font = "20px Arial";
    
    canvasContext.fillText(
        "GAME OVER",
        canvas.width / 2 - 50, // Căn giữa
        canvas.height / 2 // Căn giữa
    );
};

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    //todo
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();

    if(pacman.checkGhostCollision(ghosts)){
        gameOver(); // Gọi hàm gameOver
    }

};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                )
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1) + 10
    );
};



let draw = () => {
    //todo
    createRect(0, 0, canvas.width, canvas.height, "black")
    drawWall();
    drawFoods();
    drawScore();
    drawGhost();
    pacman.draw();
    if (isGameOver) {
        canvasContext.font = "20px Arial";
        canvasContext.fillStyle = "white";a
        canvasContext.fillText(
            "GAME OVER",
            canvas.width / 2 - 50, // Căn giữa
            canvas.height / 2 // Căn giữa
        );
    }
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWall = () => {
    //x = j oneBlockSize (vị trí ngang)
    //y = i oneBlockSize (vị trí dọc)
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                //This is wall
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
            };

            //x = j oneBlockSize (vị trí ngang)
            if (j > 0 && map[i][j - 1] == 1) {
                //Check if left is a wall 
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize + wallOffset,
                    wallSpaceWidth + wallOffset,
                    wallSpaceWidth,
                    wallInnerColor
                );
            }
            if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                //Check if right is a wall 
                createRect(
                    j * oneBlockSize + wallOffset,
                    i * oneBlockSize + wallOffset,
                    wallSpaceWidth + wallOffset,
                    wallSpaceWidth,
                    wallInnerColor
                );
            }

            //y = i oneBlockSize (vị trí dọc)
            if (i > 0 && map[i - 1][j] == 1) {
                //Check if top is a wall 
                createRect(
                    j * oneBlockSize + wallOffset,
                    i * oneBlockSize,
                    wallSpaceWidth,
                    wallSpaceWidth + wallOffset,
                    wallInnerColor
                );
            }
            if (i < map.length - 1 && map[i + 1][j] == 1) {
                //Check if bottom is a wall 
                createRect(
                    j * oneBlockSize + wallOffset,
                    i * oneBlockSize + wallOffset,
                    wallSpaceWidth,
                    wallSpaceWidth + wallOffset,
                    wallInnerColor
                );
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
}

let createGhost = () => {
    ghosts = []
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124, 116, 6 + i
        );
        ghosts.push(newGhost);
    }
};


createNewPacman();
createGhost();
gameLoop()

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) { // left
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) { // up
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) { // right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) { // down
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1)
})