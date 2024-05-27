document.addEventListener("DOMContentLoaded", initiateTextyBG);
document.addEventListener("DOMContentLoaded", initBeanPicExplosion);
document.addEventListener("mousemove", trackMouse);
window.addEventListener("resize", initiateTextyBG);

let window_y_em = undefined;
let window_x_em = undefined;
let RandomizeSymbolInterval = undefined;
let mousePos = { x: 0, y: 0 };

const emojis = ['🦍', '🐕', '🐻', '🐢', '🐴', '🐮', '🐷', '🐂', '🐄',
                '🐐', '🐏', '🐑', '🐎', '🐖', '🐩', '🐈', '🐇', '🐶', '🐱', '🐭', '🐹',
                '🐰', '🐕', '🐈', '🐩', '🐈', '🐇', '🐶', '🐱', '🐭', '🐹', '🐰',
                '🐕', '🦺', '🐈', '🐝', '🐛', '🐞', '🐜', '🕷', '🦋', '🦂', '🪲', '🪳',
                '🦟', '🪰', '🐍', '🐢', '🐊', '🐉', '🦎', '🦕', '🦖', '🐸', '🐌',
                '🦑', '🐙', '🪱', '🐠', '🐟', '🐡', '🐬', '🐳', '🐋', '🦈', '🦐', '🦑',
                '🐙', '🦀', '🦭', '🐓', '🦃', '🦆', '🦉', '🐔', '🐧', '🐦', '🐤', '🐣',
                '🐥', '🦢', '🦤', '🦩', '🦚', '🦜'];

const catppuccin_color_vars = [
    '--cat-fg-light',
    '--cat-lavender',
    '--cat-blue',
    '--cat-rosewater',
	'--cat-flamingo',
	'--cat-pink',
	'--cat-mauve',
	'--cat-red',
	'--cat-maroon',
	'--cat-peach',
	'--cat-yellow',
	'--cat-green',
	'--cat-teal',
	'--cat-sky',
	'--cat-sapphire'
];

const rand_symbols = '<>/;\\|-=!@#$%^&*(){}[]€Œƒ¥¤£¢¡§µ¿°※⊕⊗⊖⊘⊱⊰▚★☆☿♀♁♂♃♄♅♆♇♠♣♥♦♡♢♤♧⚥⚦⚧⚳⚴⛭✜✱';

function pickRandEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function pickRandCatColor() {
    return catppuccin_color_vars[Math.floor(Math.random() * catppuccin_color_vars.length)];
}

function pickRandSymbol(length) {
    let result = "";
    for(let i = 0; i < length; i++) {
        let symbol = rand_symbols[Math.floor(Math.random() * rand_symbols.length)];
        result += symbol;
    }
    return result;
}

function generateTextSpan(x, y) {
    let element = document.createElement("span");
    element.className = `glyphset` //${inverted ? ' inverse' : ''}`;
    element.style.color = `var(${pickRandCatColor()})`;
    element.style.top = `${y}em`;
    element.style.left = `${x}em`;
    //element.style.animationDelay = `-${x}s`;
    return element;
}

function readWindowDims() {
    let bodyFontStyle = window.getComputedStyle(document.body, null).getPropertyValue('font-size');
    let bodyFontSize = parseFloat(bodyFontStyle);
    console.log(bodyFontSize);
    let windowX = window.innerWidth;
    let windowY = window.innerHeight;
    window_x_em = windowX / bodyFontSize;
    window_y_em = windowY / bodyFontSize;
}

function initiateTextyBG() {
    if (RandomizeSymbolInterval) {
        clearInterval(RandomizeSymbolInterval)
    }
    readWindowDims();
    let bg = document.getElementById("bg-container");
    while(bg.firstChild) {
        bg.removeChild(bg.lastChild);
    }

    const xSize = window_x_em;
    const ySize = window_y_em;
    //const animDuration = 16;
    
    for (let i = 0; i < xSize; i+=4) {
        for (let j = 0; j < ySize; j+=4) {
            let x = i;
            let y = j;
            if ((j / 4) % 2 == 0) {
                x += 2;
            }
            let newTextElement = generateTextSpan(x, y);
            newTextElement.innerText = pickRandSymbol(1); //Math.floor(Math.random() * 3));
            bg.appendChild(newTextElement);
        }
    }

    function randomizeSomeSymbols() {
        for (let i = 0; i < bg.children.length; i++) {
            if (Math.floor(Math.random()*6) <= 1)
            {
                bg.children[i].innerText = pickRandSymbol(1);
            }
        }
    }
    RandomizeSymbolInterval = setInterval(randomizeSomeSymbols, 500);
}

function initiateCursor() {
    let cursorIcon = document.createElement("span");
    cursorIcon.textContent = pickRandEmoji();
    cursorIcon.id = "cursor-emoji";
    //cursorIcon.style.display = "None";
    document.body.appendChild(cursorIcon);

    document.addEventListener("mouseenter", cursorInit);
    document.addEventListener("mouseleave", cursorLeaveScreen);
    document.addEventListener("mousemove", cursorMouseMove);
    document.addEventListener("mousedown", cursorMouseClick);

    function cursorInit(event) {
        cursorIcon.style.display = "auto";
    }

    function cursorLeaveScreen(event) {
        cursorIcon.style.display = "None";
    }

    function cursorMouseMove(event) {
        cursorIcon.style.top = `${event.pageY}px`;
        cursorIcon.style.left = `${event.pageX}px`;
    }
    
    function cursorMouseClick(event) {
        event.preventDefault();
        cursorIcon.textContent = pickRandEmoji();
    }
}

function resizeIframe(obj) {
    obj.style.height = `${obj.contentWindow.document.documentElement.scrollHeight}px`;
}

function initBeanPicExplosion() {
    let beanPic = document.getElementById("bean-pic");
    beanPic.addEventListener("click", createExplosionGif)
}

function createExplosionGif() {
    let gifElement = document.createElement('img');
    gifElement.src = "images/explode.gif"
    gifElement.style.top = `${mousePos.y}px`;
    gifElement.style.left = `${mousePos.x}px`;
    gifElement.className = "expl";
    setTimeout(() => delExplosion(gifElement), 700)
    function delExplosion(expl)
    {
        document.body.removeChild(expl);
    }
    document.body.appendChild(gifElement);
}

function trackMouse(e)
{
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
}