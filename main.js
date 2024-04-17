function Tween({
    from = 0,
    to = 1,
    duration = 100,
    ease = (t) => t,
    onUpdate = () => {},
    onComplete = () => {},
}) {
    const distance = to - from;
    let lastTime;
    var time = 0;
    var isAnimate = true;
    function Animate(currentTime) {
        if (!isAnimate) return;
        if (currentTime != null) {
            if (lastTime != undefined) {
                time += currentTime - lastTime;
            }
            lastTime = currentTime;
        }
        if (time >= duration) {
            onUpdate(ease(1) * distance + from);
            onComplete && onComplete();
            isAnimate = false;
        } else {
            onUpdate && onUpdate(ease(time / duration) * distance + from);
        }
        requestAnimationFrame(Animate);
    }
    requestAnimationFrame(Animate);
    function Kill() {
        isAnimate = false;
    }
    function Reload() {
        time = 0;
    }
    function Reset() {
        time = 0;
        isAnimate = false;
        onUpdate(from);
    }
    return { Kill: Kill, Reload: Reload, Reset: Reset };
}
var isWin = false
var currentLevel = 0;
const startWindow = Get("Start");
const gameWindow = Get("Main");
const endWindow = Get("End");
const game = Get("Game");
const howWindow = Get("How");
const listBtn = Get("list");
const fail = Get("Fail");
const levelWindow = Get("Level");
listBtn.addEventListener("click", () => {
    howWindow.style.display = "none";
    levelWindow.style.display = "block";
    const level = Get("level");
    level.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        let btn = Create("div");
        btn.className = "level";
        btn.innerHTML = "Level " + (i + 1);
        btn.addEventListener("click", () => {
            levelWindow.style.display = "none";
            startWindow.style.display = "none";
            game.style.display = "block";
            LoadLevel(i);
        });
        level.appendChild(btn);
    }
});
Get("X2").addEventListener("click", () => {
    levelWindow.style.display = "none";
});
Get("X").addEventListener("click", () => {
    howWindow.style.display = "none";
});
Get("how").addEventListener("click", () => {
    howWindow.style.display = "block";
    levelWindow.style.display = "none";
});
Get("next").addEventListener("click", () => {
    NextGame();
});

levelWindow.style.display = "none";
howWindow.style.display = "none";
startWindow.style.display = "block";
game.style.display = "none";
endWindow.style.display = "none";
fail.style.display = "none";
const startBtn = Get("StartBtn");
startBtn.addEventListener("click", () => {
    startWindow.style.display = "none";
    game.style.display = "block";
    endWindow.style.display = "none";
    LoadLevel(0);
});
var inGaming = false;
const windowBorder = 50;
var centerX;
var centerY;
var player;
var levels = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 4, 0, 0, 3, 0, 0, 1],
        [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 5, 0, 0, 4, 0, 4, 0, 4, 0, 3, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 0, 2, 0, 0, 0, 0, 3, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 2, 1],
        [1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 1],
        [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 3, 0, 0, 0, 0, 2, 0, 0, 0, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
        [1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 4, 4, 2, 0, 0, 0, 1],
        [1, 0, 0, 2, 1, 1, 1, 1, 2, 0, 0, 1],
        [1, 5, 0, 2, 1, 1, 1, 1, 2, 0, 0, 1],
        [1, 0, 0, 0, 2, 4, 4, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 2, 0, 3, 3, 3, 3, 0, 2, 1, 1],
        [1, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 1],
        [1, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 1],
        [1, 3, 1, 0, 4, 4, 4, 4, 0, 1, 3, 1],
        [1, 3, 1, 0, 4, 5, 0, 4, 0, 1, 3, 1],
        [1, 3, 1, 0, 4, 0, 0, 4, 0, 1, 3, 1],
        [1, 3, 1, 0, 4, 4, 4, 4, 0, 1, 3, 1],
        [1, 0, 0, 4, 0, 0, 0, 0, 4, 0, 0, 1],
        [1, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 1],
        [1, 1, 2, 0, 3, 3, 3, 3, 0, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
];
document.addEventListener("keydown", (e) => {
    if (!inGaming) {
        return;
    }
    if (e.code == "KeyR") {
        Restart();
    }
    if (e.code == "Space") {
        NextGame();
    }
    PlayerMove(e.code, playerPos);
});
window.addEventListener("resize", ResizeWindow);
var currentMap;
var mS = 12;
var n = mS / 2 - 0.5;
var s = 80;
var playerPos;
var moving;
var boxPos;
var boxes;
var gameOver = false;
var power = 100;
var powerBar;
var st = 0;
var potionPos;
var potion;
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
    centerX = gameWindow.offsetWidth / 2;
    centerY = gameWindow.offsetHeight / 2;

    gameWindow.style.transform =
        "translate(-50%, -50%)" + "scale(" + scale + ")";
}
ResizeWindow();
function PlayerMove(key, pos, num = 0, isP = true) {
    if (gameOver) {
        return;
    }
    let isBox = false;
    let b;
    let bP;
    boxPos.map((i) => {
        if (i[0] == pos[0] && i[1] == pos[1]) {
            isBox = true;
            b = boxes[boxPos.indexOf(i)];
            bP = i;
        }
    });
    if (!isBox && !isP) {
        if (
            currentMap[pos[0]][pos[1]] == 3 ||
            currentMap[pos[0]][pos[1]] == 0
        ) {
            ChangePower(-((num - 1) * (5 + num) + 1));
            return true;
        }
        return false;
    }
    if (!moving) {
        let currentPos = [pos[0], pos[1]];
        if (key == "KeyA" || key == "ArrowLeft") {
            if (pos[1] > 0) {
                SetPlayer("L");
                currentPos[1]--;
            }
        } else if (key == "KeyD" || key == "ArrowRight") {
            if (pos[1] < mS - 1) {
                SetPlayer("R");
                currentPos[1]++;
            }
        } else if (key == "KeyW" || key == "ArrowUp") {
            if (pos[0] > 0) {
                SetPlayer("B");
                currentPos[0]--;
            }
        } else if (key == "KeyS" || key == "ArrowDown") {
            if (pos[0] < mS - 1) {
                SetPlayer("F");
                currentPos[0]++;
            }
        } else {
            return false;
        }
        let c = PlayerMove(key, currentPos, num + 1, false);
        if (c) {
            moving = true;
            MoveDIR(
                currentPos[1] - pos[1],
                false,
                isP ? player : b,
                isP ? playerPos : bP
            );
            MoveDIR(
                currentPos[0] - pos[0],
                true,
                isP ? player : b,
                isP ? playerPos : bP
            );
        }
        if (isP) {
            Check();
        }
        return c;
    }
    return false;
}
function SetPlayer(name) {
    player.children[0].src = "./src/p" + name + ".png";
}

function Restart() {
    LoadLevel(currentLevel);
    endWindow.style.display = "none";
    howWindow.style.display = "none";
    fail.style.display = "none";
}
function Create(n){
    return document.createElement(n);
}
function Get(n){
    return document.getElementById(n);
}
function NextGame() {
    if (!gameOver) {
        return;
    }
    if (st == -1) {
        Restart();
        return;
    }
    fail.style.display = "none";
    endWindow.style.display = "none";
    if (currentLevel < 7) {
        LoadLevel(currentLevel + 1);
    } else {
        game.style.display = "none";
        startWindow.style.display = "block";

        howWindow.style.display = "none";
    }
}
function MoveDIR(dir, isVer, obj, pos) {
    if (dir == 0) {
        return;
    }
    pos = Move(obj, dir, pos, isVer);
}

function Move(obj, dir, pos, isVer) {
    pos[isVer ? 0 : 1] += dir;
    let l = isVer ? obj.style.top : obj.style.left;
    Tween({
        from: parseFloat(l.substring(0, l.length - 2)),
        to: s * (pos[isVer ? 0 : 1] - n) + (isVer ? centerY : centerX),
        onComplete: () => {
            moving = false;
        },
        onUpdate: (i) => {
            if (isVer) {
                obj.style.top = i + "px";
            } else {
                obj.style.left = i + "px";
            }
        },
    });
    return pos;
}
function Check() {
    if (!inGaming) {
        return;
    }
    var iw = true;
    boxPos.map((i) => {
        if (currentMap[i[0]][i[1]] != 3) {
            iw = false;
        }
    });

    if (iw) {
        gameOver = true;
        isWin = true
        st = 1;
        endWindow.style.display = "block";
        fail.style.display = "none";
        SetPlayer("F");
    }
    for (let i = 0; i < potionPos.length; i++) {
        console.log(playerPos, i);
        if (
            playerPos[0] == potionPos[i][0] &&
            playerPos[1] == potionPos[i][1]
        ) {
            power = 100;
            ChangePower(0);
            potion[i].style.display = "none";
            potion.splice(i, 1);
            potionPos.splice(i, 1);
            break;
        }
    }
}

function ChangePower(value) {
    power += value;
    console.log(isWin);
    if (power < 0 && !isWin) {
        power = 0;
        st = -1;
        SetPlayer("D");
        gameOver = true;
        fail.style.display = "block";
    }
    powerBar.style.width = power + "%";
}

function LoadLevel(level) {
    currentMap = [];
    gameOver = false;
    power = 100;
    console.log(power);
    currentLevel = level;
    for (let i = 0; i < mS; i++) {
        let l = [];
        for (let j = 0; j < mS; j++) {
            l.push(levels[level][i][j]);
        }
        currentMap.push(l);
    }
    playerPos = [0, 0];
    moving = false;
    boxPos = [];
    boxes = [];
    potion = [];
    potionPos = [];
    inGaming = true;
    game.innerHTML = "";
    var bar = Create("div");
    bar.className = "bar";
    var restart = Create("img");
    restart.src = "src/restart.png";
    restart.className = "restart";
    restart.addEventListener("click", () => {
        Restart();
    });
    bar.appendChild(restart);

    var how = Create("img");
    how.src = "src/how.png";
    how.className = "restart";
    how.addEventListener("click", () => {
        howWindow.style.display = "block";
    });
    bar.appendChild(how);

    var home = Create("img");
    home.src = "src/home.png";
    home.className = "restart";
    home.addEventListener("click", () => {
        game.style.display = "none";
        startWindow.style.display = "block";
        endWindow.style.display = "none";
        howWindow.style.display = "none";
        fail.style.display = "none";
    });
    bar.appendChild(home);

    game.appendChild(bar);

    
    var powerT = Create("div");
    powerT.className = "power";
    powerBar = Create("div");
    powerBar.className = "powerBar";
    powerT.appendChild(powerBar);
    game.appendChild(powerT);
    var pt = Create("div");
    pt.className = "powerText";
    pt.innerHTML = "Power";
    game.appendChild(pt);

    function CreateElement(url) {
        const elem = Create("div");
        const img = Create("img");
        if (url == "h") {
            const d = Create("div");
            d.className = "hole";
            elem.appendChild(d);
        }
        elem.style.width = s + "px";
        elem.style.height = s + "px";
        img.src = "src/" + (url == "h" ? "g" : url) + ".png";
        elem.className = "element";
        elem.appendChild(img);
        return elem;
    }

    function CreateMap() {
        for (let i = 0; i < mS; i++) {
            for (let j = 0; j < mS; j++) {
                let name = "";
                switch (currentMap[i][j]) {
                    case 0:
                        name = "g";
                        break;
                    case 1:
                        name = "wall";
                        break;
                    case 2:
                        name = "g";
                        currentMap[i][j] = 0;
                        potionPos.push([i, j]);
                        break;
                    case 3:
                        name = "h";
                        break;
                    case 4: // box
                        name = "g";
                        currentMap[i][j] = 0;
                        boxPos.push([i, j]);
                        break;
                    case 5: // player
                        name = "g";
                        currentMap[i][j] = 0;
                        playerPos = [i, j];
                        break;
                }
                var elem = CreateElement(name);
                elem.style.left = s * (j - n) + centerX + "px";
                elem.style.top = s * (i - n) + centerY + "px";
                game.appendChild(elem);
            }
        }
        player = CreateElement("pF");
        game.appendChild(player);
        player.style.left = s * (playerPos[1] - n) + centerX + "px";
        player.style.top = s * (playerPos[0] - n) + centerY + "px";
        boxPos.map((i) => {
            let box = CreateElement("box");
            box.style.left = s * (i[1] - n) + centerX + "px";
            box.style.top = s * (i[0] - n) + centerY + "px";
            boxes.push(box);
            game.appendChild(box);
        });
        potionPos.map((i) => {
            let box = CreateElement("potion");
            box.style.left = s * (i[1] - n) + centerX + "px";
            box.style.top = s * (i[0] - n) + centerY + "px";
            potion.push(box);
            game.appendChild(box);
        });
    }

    CreateMap();
}
