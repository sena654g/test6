const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

const isTouchDevice = 'ontouchstart' in window;
if (isTouchDevice) {
    canvas.addEventListener("touchstart", handleInput, { passive: false });
} else {
    canvas.addEventListener("mousedown", handleInput);
}


const playerImg = new Image();
playerImg.src = "doraemon.png";
const obstacleImg = new Image();
obstacleImg.src = "car.png";
const groundImg = new Image();
groundImg.src = "road.jpg";

const jumpSound = new Audio("jump.wav");
const gameoverSound = new Audio("crush.wav");


const player = {
    x: 400,
    y: canvas.height - 300,
    width: 200,
    height: 200,
    vy: 0,
    onGround: true
};
const obstacle = {
    x: -300,
    y: canvas.height - 200,
    width: 200,
    height: 130,
    speed: 6100

};
const ground = {
    x: 0,
    y: canvas.height - 100,
    width: canvas.width,
    height: 100
};

const gravity = 1.6;
const jumpPower = -20;
const max = 5.0;
const min = 1.0;
let count = Math.floor(Math.random() * 5) + 1;
let shownCount = count; //表示用
let lastTime = performance.now();
let score = 0;
let scene = "title";






function init() {
    scene = "title";
    count = Math.floor(Math.random() * 5) + 1;
    shownCount = count;
    obstacle.x = -300;
    obstacle.y = canvas.height - 200;
    player.y = canvas.height - 300;
    player.vy = 0;
    score = 0;

}

function handleInput() {
    if (scene === "title") {
        lastTime = performance.now();
        scene = "game";
    }
    else if (scene === "game") {
        jump();
    }
    else if (scene === "gameover") {
        init();
    }
}


// ジャンプ処理
function jump() {  
if (player.onGround) { 
   player.vy = jumpPower;
    player.onGround = false;
    jumpSound.currentTime = 0;
    jumpSound.play();
    }
}


// title
function updateTitle() {
}
function drawTitle() {
    ctx.fillStyle = "white";
    ctx.font = "100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("タップでスタート",
        canvas.width / 2, canvas.height / 2);
}

//game
function updateGame(now) {
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    if (count > 0) {
        count -= deltaTime;
    } else {
        count = Math.floor(Math.random() * 5) + 1;
        shownCount = count;
        obstacle.x = canvas.width; //障害物スポーン
        score += 1;

    }
    obstacle.x -= obstacle.speed * deltaTime;

    // 重力 
    player.vy += gravity * deltaTime * 60;
    player.y += player.vy;

    // 地面判定 
    const groundY = canvas.height - 300;
    if (player.y >= groundY) {
        player.y = groundY;
        player.vy = 0;
        player.onGround = true;
    }


    if (isHit(player, obstacle)) {
        gameoverSound.currentTime = 0;
        gameoverSound.play();

        scene = "gameover";
    }

}
function drawGame() {
    ctx.drawImage(
        playerImg,
        player.x,
        player.y,
        player.width,
        player.height
    );
    ctx.drawImage(
        obstacleImg,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
    );
    //地面
    ctx.drawImage(
        groundImg,
        ground.x,
        ground.y,
        ground.width,
        ground.height
    );

    //count表示
    ctx.fillStyle = "yellow";
    ctx.font = "164px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${shownCount}秒後`, canvas.width / 2, canvas.height / 2 - 200);
}

// gameover
function updateGameOver() {

}
function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "100px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ゲームオーバー",
        canvas.width / 2, canvas.height / 2 - 200);

    //score表示
    ctx.fillStyle = "white";
    ctx.font = "130px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`スコア${score - 1}`, canvas.width / 2, canvas.height / 2 + 200);


    ctx.drawImage(
        playerImg,
        player.x,
        player.y,
        player.width,
        player.height
    );
    ctx.drawImage(
        obstacleImg,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
    );
    ctx.drawImage(
        groundImg,
        ground.x,
        ground.y,
        ground.width,
        ground.height
    );

}


function isHit(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// メインループ
function loop(now) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    switch (scene) {
        case "title":
            updateTitle();
            drawTitle();
            break;

        case "game":
            updateGame(now);
            drawGame();
            break;

        case "gameover":
            updateGameOver();
            drawGameOver();
            break;
    }

    requestAnimationFrame(loop);
}

loop();