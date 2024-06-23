import {start} from "/js/character-game.js";
import {characterElmGame} from "/js/character-game.js";

export const characterElmUser = document.querySelector('#character-user');

await new Promise((resolve)=>{
    document.getElementById('play-button').addEventListener('click',  ()=>{
            document.querySelector("#start-screen").remove();
            resolve();
        });
});

// loading game progress bar
// This promise will ensure to load the all the images
await new Promise(function (resolve)
{
    const images = ['/image/background/BG.png', '/image/tile/tile1.png',
        '/image/tile/tile2.png',
        '/image/tile/tile3.png',
        ...Array(10).fill('/image/character').
        flatMap((v, i) => [
            `${v}/Jump__00${i}.png`,
            `${v}/Run__00${i}.png`,
            `${v}/Attack__00${i}.png`,
            `${v}/Idle__00${i}.png`,
            `${v}/ninjagirlnew/png/Jump__00${i}.png`,
            `${v}/ninjagirlnew/png/Run__00${i}.png`,
            `${v}/ninjagirlnew/png/Attack__00${i}.png`,
            `${v}/ninjagirlnew/png/Idle__00${i}.png`
        ])
    ];

    for (const image of images){
        const img = new Image();
        img.src = image;
        img.addEventListener('load',progress);
    }

    const barElm = document.getElementById('bar');
    const totalImages = images.length;

    function progress(e){
        images.pop();
        barElm.style.width=`${100/totalImages*(totalImages-images.length)}%`;
        console.log(barElm.style.width);
        if(!images.length) {
            setTimeout(()=>
            {
                document.getElementById('overlay').classList.add('hide');
                resolve();
            },2000);
        }

    }
});

document.querySelector('#character-user-score').classList.remove('hide-background-element');
document.querySelector('#character-robot-score').classList.remove('hide-background-element');

const scoreElmUser = document.querySelector('#score-icons-user');
scoreElmUser.style.backgroundImage = `url('/image/character/Idle__001.png')`;

const scoreElmGame = document.querySelector('#score-icons-robot');
scoreElmGame.style.backgroundImage = `url('/image/character/ninjagirlnew/png/Idle__001.png')`;


const stageHeight = 100;
let dx = 0;
let i = 0;
let t = 0;
let run = false;
let jump = false;
let attack = false;
let angle = 0;
let tmr4Jump;
let tmr4Run;


let characterElm = characterElmUser;

setInterval(() => {
    if (jump) {
        characterElm.style.backgroundImage =
            `url('/image/character/Jump__00${i++}.png')`;
        if (i === 10) i = 0;
    } else if (run) {
        characterElm.style.backgroundImage =
            `url('/image/character/Run__00${i++}.png')`;
        if (i === 10) i = 0;
    } else if (attack) {
        characterElm.style.backgroundImage = `url('/image/character/Attack__00${i++}.png')`;
        if (i === 10) i = 0;
    } else {
        characterElm.style.backgroundImage =
            `url('/image/character/Idle__00${i++}.png')`;
        if (i === 10) i = 0;
    }
}, 1000 / 30);

// Initially Fall Down
const tmr4InitialFall = setInterval(() => {
    const top = characterElm.offsetTop + (t++ * 0.2);
    if (characterElm.offsetTop >= (innerHeight - stageHeight - characterElm.offsetHeight)) {
        clearInterval(tmr4InitialFall);
        return;
    }
    characterElm.style.top = `${top}px`
}, 20);

// Jump
export function doJump(characterElm) {
    if (tmr4Jump) return;
    jump = true;
    const initialTop = characterElm.offsetTop;
    tmr4Jump = setInterval(() => {
        const top = initialTop - (Math.sin(toRadians(angle++))) * 150;
        characterElm.style.top = `${top}px`
        if (angle === 181) {
            clearInterval(tmr4Jump);
            tmr4Jump = undefined;
            jump = false;
            angle = 0;
        }
    }, 1);
}

// Run
function doRun(left, characterElm) {
    if (tmr4Run) return;
    run = true;
    i = 0;
    if (left) {
        dx = -10;
        characterElm.classList.add('rotate');
    } else {
        dx = 10;
        characterElm.classList.remove('rotate');
    }
    tmr4Run = setInterval(() => {
        if (dx === 0) {
            clearInterval(tmr4Run);
            tmr4Run = undefined;
            run = false;
            return;
        }

        const left = characterElm.offsetLeft + dx;
        if (left + characterElm.offsetWidth >= innerWidth ||
            left <= 0) {
            if (left <= 0){
                characterElm.style.left = '0';
            }else{
                characterElm.style.left = `${innerWidth - characterElm.offsetWidth - 1}px`
            }
            dx = 0;
            return;
        }

        characterElm.style.left = `${left}px`;
    }, 20);
}

let userScore = 0;
//attack
function doAttack() {
    attack = true;
    run = false;
    dx=0;
    console.log("Attacking");
     if(Math.abs(characterElmUser.offsetLeft+characterElmUser.clientWidth/2- characterElmGame.offsetLeft+characterElmGame.clientWidth/2)<150)
    {
        document.getElementById('character-user-score').innerText = `${userScore++}`;
    }
}

// Utility Fn (Degrees to Radians)
function toRadians(angle) {
    return angle * Math.PI / 180;
}

let firstMove = true;
// Event Listeners
addEventListener('keydown', (e) => {

    if(firstMove){
        start();
        firstMove = false;
    }
    switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
            doRun(e.code === "ArrowLeft", characterElmUser);
            break;
        case "ArrowUp":
            doJump(characterElmUser);
        case "Space":
            // debugger;
            doAttack();
    }
});

addEventListener('keyup', (e) => {
    switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
            dx = 0;

        case "Space":
            attack = false;
    }
});

const resizeFn = ()=>{
    characterElm.style.top = `${innerHeight - stageHeight - characterElm.offsetHeight}px`;
    if (characterElm.offsetLeft < 0){
        characterElm.style.left = '0';
    }else if (characterElm.offsetLeft >= innerWidth ){
        characterElm.style.left = `${innerWidth - characterElm.offsetWidth - 1}px`
    }
}

addEventListener('resize', resizeFn);
/* Fix screen orientation issue in mobile devices */
screen.orientation.addEventListener('change', resizeFn);

