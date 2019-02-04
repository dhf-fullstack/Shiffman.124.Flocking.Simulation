// eslint-disable-next-line no-shadow
function Canvas(w, h) {
  this.h = h;
  this.w = w;
  this.c = document.getElementById('canvas');
  this.c.style.width =  this.c.width = w;
  this.c.style.height = this.c.height = h;
  this.ctx = this.c.getContext('2d');
  this.ctx.globalCompositeOperation = 'destination-over';
}

const sun = new Image();
const moon = new Image();
const earth = new Image();

sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

function draw() {
  this.ctx.clearRect(0, 0, 300, 300); // clear canvas

  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  this.ctx.save();
  this.ctx.translate(150, 150);

  // Earth
  var time = new Date();
  this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
  this.ctx.translate(105, 0);
  this.ctx.fillRect(0, -12, 40, 24); // Shadow
  this.ctx.drawImage(earth, -12, -12);

  // Moon
  this.ctx.save();
  this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
  this.ctx.translate(0, 28.5);
  this.ctx.drawImage(moon, -3.5, -3.5);
  this.ctx.restore();

  this.ctx.restore();

  this.ctx.beginPath();
  this.ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
  this.ctx.stroke();

  this.ctx.drawImage(sun, 0, 0, 300, 300);

  window.requestAnimationFrame(draw);
}

const c = new Canvas(640, 480)
// eslint-disable-next-line no-func-assign
draw = draw.bind(c);
window.requestAnimationFrame(draw);
