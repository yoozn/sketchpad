const body = document.querySelector('#body')
const container = document.querySelector('#container');
const pageContentContainer = document.querySelector('#page-content');
const button = document.querySelector('#reset-btn');
const colourInput = document.querySelector('#colour-input');
const eraserBtn = document.querySelector('#eraser-btn');
const normalBtn = document.querySelector('#normal-btn');
const gradientBtn = document.querySelector('#gradient-btn');
const rainbowBtn = document.querySelector('#rainbow-btn');
const hoverCheck = document.querySelector('#hover-check');
let canvas;
let gridSquares;
let gradient = false;
let mode = 'normal';
let eraser = false;
let boxColour = 'black';
let hoverMode = true;
let size = 16;
let mouseDown = false;

button.addEventListener('click', onReset);
colourInput.addEventListener('change', (e) => {boxColour = e.target.value});
hoverCheck.addEventListener('click', (e)=> {hoverMode = !hoverMode});
normalBtn.addEventListener('click', ()=>  mode = 'normal');
gradientBtn.addEventListener('click', ()=> gradient = !gradient);
rainbowBtn.addEventListener('click', ()=> mode = 'rainbow');
container.addEventListener('mousedown', ()=> mouseDown = true);
container.addEventListener('mouseup', ()=> mouseDown = false);
body.addEventListener('keydown', (e)  => {
    if (e.code == "KeyE") toggleEraser() 
    if (e.code == "KeyR") createCanvas(size);
});
eraserBtn.addEventListener('click', toggleEraser);

function toggleEraser() {
    eraser = !eraser
    if (eraser) {
        body.style.cursor = 'url("eraser.png"), default';
        }
        else {
            body.style.cursor = 'url("pencil.png"), default';
        }
}

//figure out click bug
function randomColour() {
    let rVal = Math.floor(Math.random() * 256) + 1;
    let gVal = Math.floor(Math.random() * 256) + 1;
    let bVal = Math.floor(Math.random() * 256) + 1;
    return `rgb(${rVal}, ${gVal}, ${bVal})`;
}

function onReset () {
    size = prompt("What size canvas? (max 100)", size);
    if (size > 0 && size <= 100) createCanvas(size);
    else createCanvas(16);
}

function initializeSquares(gridSquare) {
    onHover(gridSquare);
    onClick(gridSquare);
}

function onHover(gridSquare) {
    gridSquare.style.opacity = 0;
    gridSquare.addEventListener('mouseover', colourSquare);
}

function onClick(gridSquare) {
    gridSquare.style.opacity = 0;
    gridSquare.addEventListener('click', colourSquare);
}

function colourSquare(e) {
    if (hoverMode == true || mouseDown == true || e.type == 'click') {
        if (eraser) {
            e.target.style.opacity = 0;
            e.target.style.backgroundColor = 'white';
        } else {
            if (gradient) {
                if (e.target.style.opacity <= 1) e.target.style.opacity = Number(e.target.style.opacity) + .1;
            }
            else {
                e.target.style.opacity = 1;
            }
            if (mode == 'normal') {
                e.target.style.backgroundColor = boxColour;
            }

            else if (mode == 'rainbow') {
                e.target.style.backgroundColor = randomColour();
            }
        }
    }
}

function createCanvas(size) {
    if (canvas) {
        container.removeChild(canvas);
    }
    canvas = document.createElement('div');
    canvas.classList.add('canvas');
    pageContentContainer.appendChild(canvas);
    for (let i = 0; i < size; i++) {
        const column = document.createElement('div');
        column.classList.add('column');
        canvas.appendChild(column);
        for (let j = 0; j < size; j++) {
            const gridSquare = document.createElement('div');
            gridSquare.classList.add('gridSquare');
            column.appendChild(gridSquare);
        }
    }

    gridSquares = document.querySelectorAll('.gridSquare');
    // gridSquares.forEach(initializeSquares);
    gridSquares.forEach(onHover);
    gridSquares.forEach(onClick);
}


createCanvas(16);
console.log("hello world");
