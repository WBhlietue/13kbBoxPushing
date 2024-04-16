import { Tween } from "./tween.js";
import * as Ease from "./easa.js";

const gameWindow = document.getElementById("Main");
const windowBorder = 50;
var centerX;
var centerY;
var player;
var currentMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 3, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 5, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 4, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var playerPos = [0, 0];
var moving = false;
var boxPos = [];
var boxes = [];

document.addEventListener("keydown", (e) => {
    PlayerMove(e.code);
});

function ResizeWindow() {
    let width = window.innerWidth - windowBorder;
    let height = window.innerHeight - windowBorder;
    let scale = 1;
    let testWidth;
    testWidth = (height / gameWindow.offsetHeight) * gameWindow.offsetWidth;
    if (testWidth < width) {
        scale = testWidth / gameWindow.offsetWidth;
    } else {
        scale = width / gameWindow.offsetWidth;
    }
    console.log(scale);
    centerX = gameWindow.offsetWidth / 2;
    centerY = gameWindow.offsetHeight / 2;

    gameWindow.style.transform =
        "translate(-50%, -50%)" + "scale(" + scale + ")";
}

function CreateElement(url) {
    const elem = document.createElement("img");
    elem.src = url;
    elem.className = "element";
    return elem;
}

function CreateMap() {
    for (let i = 0; i < currentMap.length; i++) {
        for (let j = 0; j < currentMap[i].length; j++) {
            let name = "";
            switch (currentMap[i][j]) {
                case 0:
                    name = "ground";
                    break;
                case 1:
                    name = "wall";
                    break;
                case 2:
                    name = "wall2";
                    break;
                case 3:
                    name = "hole";
                    break;
                case 4: // box
                    name = "ground";
                    currentMap[i][j] = 0;
                    boxPos.push([i, j]);
                    break;
                case 5: // player
                    name = "ground";
                    currentMap[i][j] = 0;
                    playerPos = [i, j];
                    break;
            }
            var elem = CreateElement(name + ".png");
            elem.style.left = 100 * (j - 4.5) + centerX + "px";
            elem.style.top = 100 * (i - 4.5) + centerY + "px";
            gameWindow.appendChild(elem);
        }
    }
    player = CreateElement("player.png");
    gameWindow.appendChild(player);
    player.style.left = 100 * (playerPos[1] - 4.5) + centerX + "px";
    player.style.top = 100 * (playerPos[0] - 4.5) + centerY + "px";
    boxPos.map((i) => {
        let box = CreateElement("box.png");
        box.style.left = 100 * (i[1] - 4.5) + centerX + "px";
        box.style.top = 100 * (i[0] - 4.5) + centerY + "px";
        boxes.push(box)
        gameWindow.appendChild(box);
    });
}

function PlayerMove(key) {
    console.log(playerPos);
    if (!moving && (currentMap[playerPos[0]][playerPos[1]] == 0)) {
        if (key == "KeyA" || key == "ArrowLeft") {
            if (playerPos[1] > 0) {
                MoveHorizontal(-1)
            }
        } else if (key == "KeyD" || key == "ArrowRight") {
            if (playerPos[1] < 9) {
                MoveHorizontal(1)
            }
        } else if (key == "KeyW" || key == "ArrowUp") {
            if (playerPos[0] > 0) {
                MoveVertical(-1)
            }
        } else if (key == "KeyS" || key == "ArrowDown") {
            if (playerPos[0] < 9) {
                MoveVertical(1)
            }
        }
    }
}

function MoveHorizontal(dir){
    playerPos = Move(player, dir, playerPos, false)
}
function MoveVertical(dir){
    playerPos = Move(player, dir, playerPos, true)
}

function Move(obj, dir, pos, isVer) { 
    pos[isVer?0:1] += dir;
    let l = isVer?(obj.style.top):(obj.style.left);
    console.log(l);
    Tween({
        from: parseFloat(l.substring(0, l.length - 2)),
        to: 100 * (pos[isVer?0:1] - 4.5) + (isVer?centerY:centerX),
        duration: 200,
        onComplete: () => {
            moving = false;
        },
        onUpdate: (i) => {
            
            if(isVer){
                obj.style.top = i + "px"
            }else{
                obj.style.left = i + "px";
            }
        },
    });
    return pos
}

ResizeWindow();
CreateMap();
