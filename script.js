//container references
const body = document.querySelector('#body')
const container = document.querySelector('#container');
const pageContentContainer = document.querySelector('#page-content');
const leftContainer = document.querySelector('.left');
//main tools references
const resetButton = document.querySelector('#reset-btn');
const colourInput = document.querySelector('#colour-input');
const eraserBtn = document.querySelector('#eraser-btn');
//different modes references
const normalBtn = document.querySelector('#normal-btn');
const rainbowBtn = document.querySelector('#rainbow-btn');
//extra tool references
const gradientBtn = document.querySelector('#gradient-btn');
const hoverCheckbox = document.querySelector('#hover-check');

//node list references
const buttons = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');

//canvas container (not const because dynamically created and deleted)
let canvas;
//individual 'pixel' grid square nodelist
let gridSquares;
//tool conditionals and modes
let gradient = false;
let mode = 'normal';
let eraser = false;
let hoverMode = false;
//used when click draw mode is enabled (check if user is clicking on grid)
let mouseDown = false;
//colour of paintbrush
let boxColour = 'black';
//size of canvas (row and column length)
let size = 16;

//main tool listeners
resetButton.addEventListener('click', onReset);
colourInput.addEventListener('change', (e) => {boxColour = e.target.value});
eraserBtn.addEventListener('click', toggleEraser);
//mode listeners
normalBtn.addEventListener('click', () => switchMode('normal'));
rainbowBtn.addEventListener('click', () => switchMode('rainbow'));
//extra tool toggle listeners
gradientBtn.addEventListener('click', ()=> switchMode('gradient'));
hoverCheckbox.addEventListener('click', (e)=> {hoverMode = !hoverMode});
//listeners for click draw mode
container.addEventListener('mousedown', ()=> mouseDown = true);
container.addEventListener('mouseup', ()=> mouseDown = false);
//hotkey listeners
body.addEventListener('keydown', (e)  => {
    if (e.code == "KeyE") toggleEraser() 
    if (e.code == "KeyR") createCanvas(size);
});


//Hover transition (making elements bigger when hovering)
buttons.forEach((button)=> {
    button.addEventListener('mouseover', ()=> {button.classList.add('hover-transition');
    })
    button.addEventListener('mouseleave', ()=> button.classList.remove('hover-transition'));
});

inputs.forEach((input)=> {
        input.addEventListener('mouseover', ()=> {input.classList.add('hover-transition');
        })
        input.addEventListener('mouseleave', ()=> input.classList.remove('hover-transition'));
    });

function switchMode(newMode) {
    if (newMode == 'normal') {
        normalBtn.classList.add('button-select');
        rainbowBtn.classList.remove('button-select');
        mode = 'normal'
    } else if (newMode == 'rainbow') {
        normalBtn.classList.remove('button-select');
        rainbowBtn.classList.add('button-select');
        mode = 'rainbow';
    } else if (newMode == 'gradient') {
        gradient = !gradient;
        if (gradient) gradientBtn.classList.add('button-select');
        else gradientBtn.classList.remove('button-select');
    }
}

function toggleEraser() {
    eraser = !eraser
    if (eraser) {
        body.style.cursor = 'url("eraser.png"), default';
        eraserBtn.classList.add('button-select');
        }
        else {
            body.style.cursor = 'url("pencil.png"), default';
            eraserBtn.classList.remove('button-select');
        }
}

//generate random colour (used for rainbow mode)
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

//called on creation of canvas for each individual grid square
function initializeSquares(gridSquare) {
    onHover(gridSquare);
    onClick(gridSquare);
}

//add listener to each square to be coloured when moused over (hover) or clicked (click draw)
//set opacity to 0 as initial, if gradient off, then set opacity to 1 while drawing. if gradient on, then add .1 to opacity
function onHover(gridSquare) {
    gridSquare.style.opacity = 0;
    gridSquare.addEventListener('mouseover', colourSquare);
}

function onClick(gridSquare) {
    gridSquare.addEventListener('click', colourSquare);
}

//check if the hovermode is on, the mouse is being dragged, or the square was just clicked on
//then check if eraser enabled => set square opacity back to 0 (reset square for gradient mode), and set colour to white
//else check mode and change colour accordingly
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

//create canvas of size entered. Called onced at beginning of page load, and when reset button pressed.
function createCanvas(size) {
    //toggles the button border around normal on reset
    switchMode('normal');
    //if canvas already exists, delete it
    if (canvas) {
        pageContentContainer.removeChild(canvas);
    }
    canvas = document.createElement('div');
    canvas.classList.add('canvas');
    leftContainer.after(canvas);
    //create 'size' # of columns, and in each column create 'size' # of squares
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

    //assign gridSquares nodelist, initialize hover and click events for each square
    gridSquares = document.querySelectorAll('.gridSquare');
    gridSquares.forEach(onHover);
    gridSquares.forEach(onClick);
}

//initial canvas creation
createCanvas(16);
