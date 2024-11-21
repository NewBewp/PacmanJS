const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

const pacmanFrames = document.getElementById("animations")
const ghostFrames = document.getElementById("ghosts")

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

let fps = 30;
// let pacman;s
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_LEFT = "LEFT";
const DIRECTION_UP = "UP";
const DIRECTION_BOTTOM = "DOWN";

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

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    //todo
    pacman.moveProcess();
   
};

let draw = () => {
    //todo
    createRect(0, 0, canvas.width, canvas.height, "black")
    drawWall();
    pacman.draw();
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

let createNewPacman = () =>{
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize/ 5
    );
}

createNewPacman();
gameLoop()

window.addEventListener("keydown",(event)=>{
    let k = event.keyCode;
    setTimeout(()=>{
        if(k == 37 || k == 65){ // left
            pacman.nextDirection = DIRECTION_LEFT;
        }else if(k == 38 || k == 87){ // up
            pacman.nextDirection = DIRECTION_UP;
        }else if(k == 39 || k == 68){ // right
            pacman.nextDirection = DIRECTION_RIGHT;
        }else if(k == 40 || k == 83){ // down
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    },1)
})