const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
ctx.width = ctx.height = 800;
const img = new Image();
img.src = './map.png';
let x = y = 0;
const movement = [0, 0, 0, 0];
document.onkeydown = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 1;
};
document.onkeyup = e => {
    if (e.keyCode >= 37 && e.keyCode <= 40)
        movement[e.keyCode - 37] = 0;
};
setInterval(() => {
    if (movement[0])
        x--;
    if (movement[1])
        y--;
    if (movement[2])
        x++;
    if (movement[3])
        y++;
    ctx.clearRect(0, 0, 800, 800);
    ctx.drawImage(img, -x, -y, 4000, 4000);
    ctx.fillRect(395, 395, 10, 10)
}, 13);
