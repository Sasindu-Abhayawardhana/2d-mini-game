import {characterElmUser} from "/js/character-user.js";
import {doJump} from "/js/character-user.js";

export const characterElmGame = document.querySelector('#character-game');

let characterElm = characterElmGame;

const stageHeight = 100;
let dy = 10;
let dx = 0;
let i = 0;
let t = 0;
let run = false;
let jump = false;
let attack = false;
let angle = 0;
let tmr4Jump;
let tmr4Run;
let tmr4Attack;

setInterval(() => {
    if (jump) {
        characterElm.style.backgroundImage = `url('/image/character/ninjagirlnew/png/Jump__00${i++}.png')`;
        if (i === 10) i = 0;
    } else if (run) {
        characterElm.style.backgroundImage = `url('/image/character/ninjagirlnew/png/Run__00${i++}.png')`;
        if (i === 10) i = 0;

    } else if(attack) {
        characterElm.style.backgroundImage = `url('/image/character/ninjagirlnew/png/Attack__00${i++}.png')`;
        if (i === 10) i = 0;
    }
    else {
        characterElm.style.backgroundImage =
            `url('/image/character/ninjagirlnew/png/Idle__00${i++}.png')`;
        if (i === 10) i = 0;
    }
}, 1000/3);


// Run
function doRun(left,characterElm) {
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

            const left = characterElm.offsetLeft+dx;
            if(left+characterElm.offsetWidth >= innerWidth-characterElm.clientWidth) {
                doRun(true, characterElm);
                return;
            }
            if(left <= characterElm.clientWidth){
                doRun(false, characterElm);
                return;
            }
                characterElm.style.left = `${characterElm.offsetLeft + dx}px`;
        }, 40);
}


//attack

let robotScore = 0;

function doAttack() {
        attack = true;
        run = false;
        dx=0;
    console.log("Attacking");
         if(Math.abs(characterElmGame.offsetLeft+characterElmGame.clientWidth/2- characterElmUser.offsetLeft+characterElmUser.clientWidth/2)<150)
        {
            document.getElementById('character-robot-score').innerText = `${robotScore += 5}`;
        }

}

// Utility Fn (Degrees to Radians)
function toRadians(angle) {
        return angle * Math.PI / 180;
}

const movementArary = ["idle", "left", "right", "left", "right", "idle"];

function getRandomMovements() {
    // Shuffle the movement array
    for (let i = movementArary.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movementArary[i], movementArary[j]] = [movementArary[j], movementArary[i]];
    }
    // Return the first two elements
    return movementArary.slice(0, 2);
}

// Initially Fall Down
const tmr4InitialFall = setInterval(() => {
    const top = characterElm.offsetTop + (t++ * 0.2);
    if (characterElm.offsetTop >= (innerHeight - stageHeight -2 - characterElm.offsetHeight)) {
        clearInterval(tmr4InitialFall);
        return;
    }
    characterElm.style.top = `${top}px`
}, 20);

export function start(){
        setInterval(() => {
                let arrayMovement = [doAttack, doRun,doJump];
                const movement = arrayMovement[Math.floor(Math.random()*3)];
                if(movement===doAttack) {

                    movement();
                }
                else if (movement===doJump) movement(characterElmGame);
                else {
                    const runMovementArary = ["left","right", "left", "right", "left", "right"];
                    //
                    const randomMovement = runMovementArary[Math.floor(Math.random() * 6)];
                    const chosenMovements = getRandomMovements();
                    for (const movement of chosenMovements) {
                        switch (randomMovement) {
                            case "idle":
                                dx = 0;
                                // run = false;
                                break;
                            case "left":
                                doRun(true, characterElm);
                                break;
                            case "right":
                                doRun(false, characterElm);
                                break;
                        }
                    }
                }
        },1000);
}

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



