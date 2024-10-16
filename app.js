const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fill the canvas with a color
ctx.fillStyle = "white"; // Choose your desired background color here
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let hue = 0;
ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// Character position and movement
let characterX = canvas.width / 2;
let characterY = canvas.height / 2;
let velocityY = 0;
let speed = 10;
let gravity = 0.5;
let jumpStrength = -30;
let isOnGround = false;
let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Animation variables
let time = 0;

let isMouthOpen = false;
let mouthChangeInterval = 10; // Change mouth every 200ms
let lastMouthChangeTime = 0;

function drawCircleWithArmsAndFace(x, y, size) {
    // Draw the main circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.stroke();
    
    // Draw arms
    const armLength = size * 1.2;
    const handLength = size * 0.3;
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - size - armLength, y);
    ctx.lineTo(x - size - armLength, y + handLength);
    ctx.stroke();
    
    // Right arm
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size + armLength, y);
    ctx.lineTo(x + size + armLength, y + handLength);
    ctx.stroke();
    
    // Draw face
    // Eyes
    const eyeSize = size * 0.15;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.2, eyeSize, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y - size * 0.2, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.2, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y - size * 0.2, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * 0.1, y + size * 0.3);
    ctx.lineTo(x + size * 0.1, y + size * 0.3);
    ctx.closePath();
    ctx.stroke();

    // Mouth
    ctx.beginPath();
    if (isMouthOpen) {
        ctx.ellipse(x, y + size * 0.4, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.moveTo(x - size * 0.2, y + size * 0.4);
        ctx.lineTo(x + size * 0.2, y + size * 0.4);
    }
    ctx.stroke();

    // Draw nametag
    ctx.font = `${size * 0.3}px Arial`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText("BIG BILLY", x, y - size - 10);

    hue++;
    if (hue >= 360) hue = 0;
}

function updateCharacterPosition() {
    if (keys.a) characterX -= speed;
    if (keys.d) characterX += speed;

    // Apply gravity
    velocityY += gravity;
    characterY += velocityY;

    // Check for ground collision
    if (characterY + 50 > canvas.height) {
        characterY = canvas.height - 50;
        velocityY = 0;
        isOnGround = true;
    } else {
        isOnGround = false;
    }

    // Jump when 'W' is pressed and character is on the ground
    if (keys.w && isOnGround) {
        velocityY = jumpStrength;
        isOnGround = false;
    }

    // Keep character within canvas bounds
    characterX = Math.max(50, Math.min(canvas.width - 50, characterX));
}

function animate() {
    // Clear the canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateCharacterPosition();
    
    // Check if it's time to change the mouth state
    if (time - lastMouthChangeTime > mouthChangeInterval) {
        isMouthOpen = !isMouthOpen;
        lastMouthChangeTime = time;
    }
    
    drawCircleWithArmsAndFace(characterX, characterY, 50);
    
    time++;
    
    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// ... existing mouse event listeners ...
